import { useState } from 'react'
import { useRouter } from 'next/router'
import { getNonce } from '@/utils/nonce'
import { useMediaQuery } from 'react-responsive'
import { loginPostUrl } from '@/utils/urls'
import Toast from '@/reuseComps/ToastMessage'
import Spinner from '@/reuseComps/Spinner'

function LoginDropdown({ handleSuccessfulLogin, handleCreateAcc }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const isDesktop = useMediaQuery({ query: '(min-width:900px)' })
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name === 'email') {
      if (!value) {
        setEmailError('Email address is required')
      } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
        setEmailError('Please enter a valid email address')
      } else {
        setEmailError('')
      }
      formData.username = value
    }
    if (name === 'password') {
      if (!value) {
        setPasswordError('Password is required')
      } else {
        setPasswordError('')
      }
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData?.username || !formData?.password || emailError) {
      setShowToast(true)
      setToastMsg('Please enter email address and password')
      return
    }
    try {
      setIsLoggingIn(true)
      const response = await fetch(
        loginPostUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        },
      )
      if (!response.ok) {
        const responseData = await response.json()
        setIsLoggingIn(false)
        setShowToast(true)
        setToastMsg(responseData?.message)
        return
      }
      if (response.ok) {
        const responseData = await response.json() // Parse the response body as JSON
        const token = responseData.token
        if (token) {
          setIsLoggingIn(false)
          localStorage.setItem('loginToken', token)
          // router.push('/profile-page')
          handleSuccessfulLogin()
          getNonce()
        }
      } else {
        // Handle errors
        console.error('Signup failed')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="fixed z-[1] h-full w-full overflow-y-scroll border-t-[1px] border-colorBlack bg-colorBlack bg-opacity-75">
      <div className="absolute top-0 z-[2] flex h-auto w-full flex-col items-start justify-between gap-4 bg-textPrimary px-6 pb-[100px] pt-[50px] text-footerBg sm:px-[50px] lg:flex-row lg:pb-[50px] xl:gap-8 xl:px-[80px] dxl:px-[140px]">
        {!isDesktop && (
          <p
            className="flex items-center gap-1 font-sans text-display-4"
            onClick={() => {
              handleSuccessfulLogin()
            }}
          >
            <img className="h-3 w-3" src="/Images/leftArrow.svg" alt="prev" />
            <u>Back</u>
          </p>
        )}
        <div className="flex w-auto max-w-[803px] flex-1 flex-col justify-between gap-7 self-stretch bg-search p-4 sm:p-6 xl:p-9 dxl:p-[50px]">
          <p className="text-display-11 xl:text-display-13">
            Registered Customers
          </p>
          <p className="h-auto w-full font-sans text-display-3 dxl:text-display-6">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua
          </p>
          <form
            className="flex w-full flex-col gap-5 font-sans"
            onSubmit={handleSubmit}
          >
            <div className="h-[50px]">
              <input
                type="username"
                id="username"
                name="email"
                placeholder="Email address*"
                value={formData.username}
                onChange={handleChange}
                className="focus:shadow-outline h-full w-full appearance-none rounded border px-[30px] py-2 text-display-6 leading-tight text-gray-700 shadow focus:outline-none"
              />
              {emailError && (
                <p className="text-sm text-red-500">{emailError}</p>
              )}
            </div>
            <div className="h-[50px]">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password*"
                value={formData.password}
                onChange={handleChange}
                className="focus:shadow-outline h-[50px] w-full appearance-none rounded border px-[30px] py-2 text-display-6 leading-tight text-gray-700 shadow focus:outline-none"
              />
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
            </div>
            {showToast && (
              <div className="mt-1 h-auto w-full">
                <Toast
                  message={toastMsg}
                  showToast={showToast}
                  setShowToast={setShowToast}
                />
              </div>
            )}
            {isLoggingIn && (
              <section className="mt-0 flex gap-2">
                <Spinner width={25} height={25} />
                <p>Logging In please wait...</p>
              </section>
            )}
            <div className="mt-[10px] flex w-full items-center justify-start gap-5 sm:gap-10">
              <div className="relative flex h-[40px] w-[100px] font-sans text-display-4 xl:h-[53px] xl:w-[174px] xl:text-display-17">
                <div className="absolute bottom-0 h-[37px] w-[97px] border-[0.5px] border-textSecondary xl:h-[50px] xl:w-[171px]"></div>
                <div className="absolute right-0 h-[37px] w-[97px] border-[0.5px] border-textSecondary xl:h-[50px] xl:w-[171px]"></div>
                <button
                  type="submit"
                  className="relative flex w-full items-center justify-center"
                >
                  Login
                </button>
              </div>
              <p className="cursor-pointer font-sans text-display-1 xl:text-display-17">
                <u>Forgotten Your Password?</u>
              </p>
            </div>
          </form>
        </div>
        <div className="flex w-auto max-w-[803px] flex-1 flex-col justify-between gap-4 self-stretch bg-search p-4 sm:p-6 xl:p-9 dxl:gap-7 dxl:p-[50px]">
          <div className="text-display-11 xl:text-display-13">
            Don’t Have An Account?
          </div>
          <p className="font-sans text-display-3 dxl:text-display-6">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua.
          </p>
          <p className="font-sans text-display-3 dxl:text-display-6">
            Takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor
            sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
            invidunt ut labore et dolore. Tempor invidunt ut labore et dolore
            magna aliquyam erat, sed diam voluptua.
          </p>
          <div
            className="relative flex h-[40px] w-[160px] cursor-pointer font-sans text-display-4 xl:h-[53px] xl:w-[235px] xl:text-display-17"
            onClick={() => {
              handleCreateAcc()
            }}
          >
            <div className="absolute bottom-0 h-[37px] w-[157px] border-[0.5px] border-textSecondary xl:h-[50px] xl:w-[232px]"></div>
            <div className="absolute right-0 h-[37px] w-[157px] border-[0.5px] border-textSecondary xl:h-[50px] xl:w-[232px]"></div>
            <div className="relative flex w-full items-center justify-center">
              Create An Account
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default LoginDropdown

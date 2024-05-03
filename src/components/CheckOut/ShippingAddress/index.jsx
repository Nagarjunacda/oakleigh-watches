import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Toast from '@/reuseComps/ToastMessage'
import { updateCusUrl } from '@/utils/urls'
import Link from 'next/link'
import CountrySelector from '@/reuseComps/CountrySelector'
import ProgressiveImageComp from '@/reuseComps/ProgressiveImageComp'
import Spinner from '@/reuseComps/Spinner'

function ShippingAddress({
  address,
  basketData,
  email,
  emailError,
  isFromPayment,
  isPaynowClicked,
}) {
  const router = useRouter()
  const [countryCode, setCountryCode] = useState('')
  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [addressError, setAddressError] = useState('')
  const [cityError, setCityError] = useState('')
  const [postCodeError, setPostCodeError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [formError, setFormError] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const selectedCountry = basketData?.shipping_address?.country
  const addressHeading = isFromPayment ? 'Billing Address' : 'Shipping Address'
  // const [formData, setFormData] = useState({
  //   first_name: '',
  //   last_name: '',
  //   address: '',
  //   apartment: '',
  //   city: '',
  //   post_code: '',
  //   phone: '',
  // })
  const [formData, setFormData] = useState({})
  const leftIcon = '/Images/leftArrow.svg'

  useEffect(() => {
    if (isFromPayment && isPaynowClicked) {
      handleContinueShiping()
      return
    }
    setFormData(address)
  }, [address, isPaynowClicked])

  const handleChange = (e) => {
    e.preventDefault
    const { name, value, type, checked } = e.target
    if (name === 'first_name') {
      if (!value) {
        setFirstNameError('First name is required')
      } else if (!/^[a-zA-Z]+$/.test(value)) {
        setFirstNameError('Please enter only alphabets')
      } else {
        setFirstNameError('')
      }
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }
    if (name === 'last_name') {
      if (!value) {
        setLastNameError('Last name is required')
      } else if (!/^[a-zA-Z]+$/.test(value)) {
        setLastNameError('Please enter only alphabets')
      } else {
        setLastNameError('')
      }
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }
    if (name === 'address_1') {
      if (!value) {
        setAddressError('Address is required')
      } else {
        setAddressError('')
      }
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }
    if (name === 'address_2') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }
    if (name === 'city') {
      if (!value) {
        setCityError('City info required')
      } else if (!/^[a-zA-Z]+$/.test(value)) {
        setCityError('Please enter only alphabets')
      } else {
        setCityError('')
      }
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }
    if (name === 'postcode') {
      if (!value) {
        setPostCodeError('Postcode is required')
      } else {
        setPostCodeError('')
      }
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }
    if (name === 'phone') {
      if (!value) {
        setPhoneError('Phone Number is required')
      } else if (!/^[0-9]+$/.test(value)) {
        setPhoneError('Please enter only Numbers')
      } else {
        setPhoneError('')
      }
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }
  }

  const handleContinueShiping = async (e) => {
    // e.preventDefault
    if (
      !formData?.first_name ||
      !formData?.last_name ||
      !formData?.address_1 ||
      !formData?.city ||
      !formData?.postcode ||
      !formData?.phone
    ) {
      setShowToast(true)
      setToastMessage('Please fill all the requied fields marked as *')
      return
    }
    if (!isFromPayment && (emailError || !email)) {
      setShowToast(true)
      setToastMessage('Please fill the Email address')
      return
    }
    const nonce = localStorage.getItem('nonce')
    const loginToken = localStorage.getItem('loginToken')
    const headers = { 'Content-Type': 'application/json', Nonce: nonce }
    const postData = {
      billing_address: {
        email: String(email),
        country: String(countryCode ? countryCode : selectedCountry),
        postcode: String(formData?.postCode),
        first_name: String(formData?.first_name),
        last_name: String(formData?.last_name),
        address_1: String(formData?.address_1),
        address_2: String(formData?.address_2),
        city: String(formData?.city),
        postcode: String(formData?.postcode),
        phone: String(formData?.phone),
      },
      shipping_address: {
        country: String(countryCode ? countryCode : selectedCountry),
        postcode: String(formData?.postCode),
        first_name: String(formData?.first_name),
        last_name: String(formData?.last_name),
        address_1: String(formData?.address_1),
        address_2: String(formData?.address_2),
        city: String(formData?.city),
        postcode: String(formData?.postcode),
        phone: String(formData?.phone),
      },
    }
    const onlyBillingData = {
      billing_address: {
        email: String(email),
        country: String(countryCode ? countryCode : selectedCountry),
        postcode: String(formData?.postCode),
        first_name: String(formData?.first_name),
        last_name: String(formData?.last_name),
        address_1: String(formData?.address_1),
        address_2: String(formData?.address_2),
        city: String(formData?.city),
        postcode: String(formData?.postcode),
        phone: String(formData?.phone),
      },
      shipping_address: {
        country: String(countryCode ? countryCode : selectedCountry),
        postcode: String(basketData?.shipping_address?.postCode),
        first_name: String(basketData?.shipping_address?.first_name),
        last_name: String(basketData?.shipping_address?.last_name),
        address_1: String(basketData?.shipping_address?.address_1),
        address_2: String(basketData?.shipping_address?.address_2),
        city: String(basketData?.shipping_address?.city),
        postcode: String(basketData?.shipping_address?.postcode),
        phone: String(basketData?.shipping_address?.phone),
      },
    }
    if (loginToken) {
      headers['Authorization'] = `Bearer ${loginToken}`
    }
    try {
      if (!isFromPayment) {
        setLoading(true)
      }
      const finalData = isFromPayment ? onlyBillingData : postData
      const response = await fetch(
        updateCusUrl,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(finalData),
          credentials: 'include',
        },
      )
      const responseData = await response.json()

      if (responseData) {
        if (responseData?.data?.status === 400) {
          // setAddingDeliveryInfo(false)
          // setShowToast(true)
          // setToastMessage('Please enter Valid Postcode')
          return
        }
        if (!isFromPayment) {
          router.push('/basket/checkout/shipping')
        }
        setLoading(false)
        // setAddingDeliveryInfo(false)
        // setIsPostcodeEntered(!isPostcodeEntered)
      }
    } catch (error) { }
  }

  return (
    <section className="flex w-full flex-col gap-4 dxl:mt-[30px] dxl:gap-5">
      <p className="text-display-11 dxl:text-display-12">{addressHeading}</p>
      <section className="h-auto w-full">
        <form className="flex w-full flex-col gap-3 font-sans lg:gap-5">
          <section className="w-full dxl:mt-[5px]">
            <CountrySelector
              setCountryCode={setCountryCode}
              selectedCountry={selectedCountry}
            />
          </section>
          <section className="flex h-auto w-full flex-col gap-3 sm:flex-row lg:gap-5">
            <section className="h-auto flex-1 opacity-100">
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData?.first_name || ''}
                placeholder="First Name*"
                onChange={handleChange}
                className="selection: h-[40px] w-full appearance-none bg-search px-3 py-2 text-display-3 leading-tight focus:border-none focus:outline-none focus:ring-0 dxl:h-[50px] dxl:text-display-6"
              />
              {firstNameError && (
                <p className="mt-1 text-sm text-red-500">{firstNameError}</p>
              )}
            </section>
            <section className="h-auto flex-1">
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData?.last_name || ''}
                placeholder="Last Name*"
                onChange={handleChange}
                className="h-[40px] w-full appearance-none bg-search px-3 py-2 text-display-3 leading-tight focus:border-none focus:outline-none focus:ring-0 dxl:h-[50px] dxl:text-display-6"
              />
              {lastNameError && (
                <p className="mt-1 text-sm text-red-500">{lastNameError}</p>
              )}
            </section>
          </section>
          <section className="h-auto">
            <input
              type="text"
              id="address"
              name="address_1"
              value={formData?.address_1 || ''}
              placeholder="Address*"
              onChange={handleChange}
              className="h-[40px] w-full appearance-none bg-search px-3 py-2 text-display-3 leading-tight focus:border-none focus:outline-none focus:ring-0 dxl:h-[50px] dxl:text-display-6"
            />
            {addressError && (
              <p className="mt-1 text-sm text-red-500">{addressError}</p>
            )}
          </section>
          <section>
            <input
              type="text"
              id="address_2"
              name="address_2"
              value={formData?.address_2 || ''}
              placeholder="Apartment, Suite, Etc.(Optional)"
              onChange={handleChange}
              className="h-[40px] w-full appearance-none bg-search px-3 py-2 text-display-3 leading-tight focus:border-none focus:outline-none focus:ring-0 dxl:h-[50px] dxl:text-display-6"
            />
          </section>
          <section className="flex h-auto w-full flex-col gap-3 sm:flex-row lg:gap-5">
            <section className="h-auto flex-1">
              <input
                type="text"
                id="city"
                name="city"
                value={formData?.city || ''}
                placeholder="City*"
                onChange={handleChange}
                className="h-[40px] w-full appearance-none bg-search px-3 py-2 text-display-3 leading-tight focus:border-none  focus:shadow focus:outline-none focus:ring-0 dxl:h-[50px] dxl:text-display-6"
              />
              {cityError && (
                <p className="mt-1 text-sm text-red-500">{cityError}</p>
              )}
            </section>
            <section className="h-auto flex-1">
              <input
                type="text"
                id="post_code"
                name="postcode"
                value={formData?.postcode || ''}
                placeholder="Postcode*"
                onChange={handleChange}
                className="h-[40px] w-full appearance-none bg-search px-3 py-2 text-display-3 leading-tight focus:border-none focus:outline-none focus:ring-0 dxl:h-[50px] dxl:text-display-6"
              />
              {postCodeError && (
                <p className="mt-1 text-sm text-red-500">{postCodeError}</p>
              )}
            </section>
          </section>
          <section>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData?.phone || ''}
              placeholder="Phone*"
              onChange={handleChange}
              className="h-[40px] w-full appearance-none bg-search px-3 py-2 text-display-3 leading-tight focus:border-none focus:outline-none focus:ring-0 dxl:h-[50px] dxl:text-display-6"
            />
            {phoneError && (
              <p className="mt-1 text-sm text-red-500">{phoneError}</p>
            )}
          </section>
        </form>
      </section>
      {showToast && (
        <Toast
          message={toastMessage}
          showToast={showToast}
          setShowToast={setShowToast}
        />
      )}
      {loading && (
        <section className="mt-4 flex gap-2">
          <Spinner width={25} height={25} />
          <p>Redirecting to shipping please wait...</p>
        </section>
      )}
      {!isFromPayment && (
        <section className="flex h-auto w-full items-center justify-between dxl:mt-[10px]">
          <section className="flex flex-1 items-center justify-start gap-[2px]">
            <section className="h-3 w-3 dxl:mt-[3px] dxl:h-4 dxl:w-4">
              <ProgressiveImageComp src={leftIcon} alt="left" />
            </section>
            <Link href="/basket">
              <p className="font-sans text-display-4 dxl:text-display-17">
                <u>Return To Basket</u>
              </p>
            </Link>
          </section>
          <section
            className="relative mt-1 flex h-[42px] w-full flex-1 font-sans lg:max-w-[180px] dxl:h-[53px] dxl:max-w-[279px]"
            role="button"
            onClick={handleContinueShiping}
          >
            <div className="absolute bottom-0 h-[39px] w-[98.5%] border-[0.8px] border-textSecondary bg-textSecondary sm:w-[99%] dxl:h-[50px]" />
            <div className="absolute right-0 h-[39px] w-[98.5%] border-[0.8px] border-textSecondary sm:w-[99%] dxl:h-[50px]" />
            <div className="absolute bottom-[3px] left-[1.5%] right-[1.5%] h-[36px] w-[97%] border-b-[0.5px] border-l-[0.5px] border-textPrimary sm:left-[1%] sm:right-[1%] sm:w-[98%] dxl:h-[47px]" />
            <div className="relative flex w-full items-center justify-center text-display-1 text-textPrimary dxl:text-display-17">
              Continue To Shipping
            </div>
          </section>
        </section>
      )}
    </section>
  )
}
export default ShippingAddress

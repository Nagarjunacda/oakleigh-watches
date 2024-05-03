// pages/signup.js

import { useState } from 'react'
import { useRouter } from 'next/router'
import { signupUrl } from '@/utils/urls'

const SignupForm = () => {
  const [firstNameError, setFirstNameError] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationError, setValidationError] = useState(false)
  const router = useRouter()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    username: '',
    subscribe_to_newsletter: false,
    roles: [],
  })
  const formNotValidated =
    firstNameError || lastNameError || emailError || passwordError

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name === 'confirmPassword') {
      setValidationError(false)
      setConfirmPassword(value)
      return
    }
    if (name === 'first_name') {
      if (!value) {
        setFirstNameError('First name is required')
      } else if (!/^[a-zA-Z]+$/.test(value)) {
        setFirstNameError('Please enter only alphabets')
      } else {
        setFirstNameError('')
      }
    }
    if (name === 'last_name') {
      if (!value) {
        setLastNameError('Last name is required')
      } else if (!/^[a-zA-Z]+$/.test(value)) {
        setLastNameError('Please enter only alphabets')
      } else {
        setLastNameError('')
      }
    }
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
      } else if (value.length < 8) {
        setPasswordError('Password must be at least 8 characters long')
      } else {
        setPasswordError('')
      }
      setValidationError(false)
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
      roles: ['customer'],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formNotValidated) {
      return
    }
    if (formData.password !== confirmPassword) {
      setValidationError(true)
      return
    }
    try {
      const username = 'oakleighcdadevel'
      const password = 'QsJY lkVy QxL8 3iFY NhhP Cto1'
      const response = await fetch(
        signupUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(username + ':' + password),
          },
          body: JSON.stringify(formData),
        },
      )

      if (response.ok) {
        router.push('/')
      } else {
        // Handle errors
        console.error('Signup failed')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="flex items-center justify-center font-sans">
      <form className="flex w-full flex-col gap-5" onSubmit={handleSubmit}>
        <div className="h-auto">
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            placeholder="First Name*"
            onChange={handleChange}
            className="focus:shadow-outline h-[50px] w-full appearance-none border px-3 py-2 font-sans text-display-6 leading-tight text-gray-700 shadow focus:outline-none"
          />
          {firstNameError && (
            <p className="mt-1 text-sm text-red-500">{firstNameError}</p>
          )}
        </div>
        <div className="h-auto">
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            placeholder="Last Name*"
            onChange={handleChange}
            className="focus:shadow-outline h-[50px] w-full appearance-none border px-3 py-2 text-display-6 leading-tight text-gray-700 shadow focus:outline-none"
          />
          {lastNameError && (
            <p className="mt-1 text-sm text-red-500">{lastNameError}</p>
          )}
        </div>
        <div className="h-auto">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email address*"
            value={formData.email}
            onChange={handleChange}
            className="focus:shadow-outline h-[50px] w-full appearance-none border px-3 py-2 text-display-6 leading-tight text-gray-700 shadow focus:outline-none"
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-500">{emailError}</p>
          )}
        </div>
        <div className="h-auto">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password*"
            value={formData.password}
            onChange={handleChange}
            className="focus:shadow-outline h-[50px] w-full appearance-none border px-3 py-2 text-display-6 leading-tight text-gray-700 shadow focus:outline-none"
          />
          {passwordError && (
            <p className="mt-1 text-sm text-red-500">{passwordError}</p>
          )}
        </div>
        <div className="h-[50px]">
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password*"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="focus:shadow-outline h-full w-full appearance-none border px-3 py-2 text-display-6 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>
        <div className="">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="subscribe_to_newsletter"
              checked={formData.subscribe_to_newsletter}
              onChange={handleChange}
              className="mr-2 leading-tight"
            />
            <span className="text-display-1 font-light sm:text-display-3 xl:text-display-6">
              Sign up to Oakleigh Watches updates
            </span>
          </label>
        </div>
        {validationError && (
          <p className="mt-1 text-sm text-red-500">
            Password and Confirm Password does not match
          </p>
        )}
        <div className="relative flex h-8 w-[120px] font-sans text-display-1 sm:h-[40px] sm:w-[150px] sm:text-display-4 xl:h-[53px] xl:w-[220px] xl:text-display-17">
          <div className="absolute bottom-0 h-[29px] w-[117px] border-[0.5px] border-textSecondary sm:h-[37px] sm:w-[147px] xl:h-[50px] xl:w-[217px]"></div>
          <div className="absolute right-0 h-[29px] w-[117px] border-[0.5px] border-textSecondary sm:h-[37px] sm:w-[147px] xl:h-[50px] xl:w-[217px]"></div>
          <button
            type="submit"
            className="relative flex w-full items-center justify-center"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  )
}

export default SignupForm

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Link from 'next/link'
import { priceFormatter } from '@/utils/formatPrice'
import { useMediaQuery } from 'react-responsive'
import { Country, State, City } from 'country-state-city'
import { removeCartItemUrl } from '@/utils/urls'
import { getCartUrl } from '@/utils/urls'
import { couponCodeUrl } from '@/utils/urls'
import { updateCusUrl } from '@/utils/urls'
import NextImage from '@/reuseComps/NextImage'
import ProgressiveImageComp from '@/reuseComps/ProgressiveImageComp'
import CountrySelector from '@/reuseComps/CountrySelector'
import StateSelector from '@/reuseComps/StateSelector'
import Toast from '@/reuseComps/ToastMessage'
import Spinner from '@/reuseComps/Spinner'
import Breadcrumbs from '@/components/BreadCrumbs'
import CheckBox from '@/reuseComps/CheckBox'
import { check } from 'prettier'

function BasketHead({ checkout, textFieldRef }) {
  const router = useRouter()
  const isDesktop = useMediaQuery({ query: '(min-width:900px)' })

  const handleCheckout = () => {
    if (!textFieldRef.current.value.trim()) {
      textFieldRef.current.focus()
      return
    }
    if (checkout) {
      router.push('/basket/checkout')
    }
  }
  return (
    <section className="flex h-auto w-full items-center justify-between gap-2">
      {isDesktop && <section className="h-auto w-full flex-1" />}
      <section className="flex-1 text-display-12 lg:flex lg:justify-center xl:text-display-14 dxl:text-display-15">
        YOUR BASKET
      </section>
      <section
        className={`flex h-auto w-full ${checkout
          ? 'cursor-pointer opacity-100'
          : 'cursor-not-allowed opacity-50'
          } flex-1 justify-end `}
        role="button"
      >
        <section
          className="relative flex h-[42px] w-full font-sans lg:max-w-[180px] dxl:h-[53px] dxl:max-w-[279px]"
          onClick={handleCheckout}
        >
          <div className="absolute bottom-0 h-[39px] w-[98.5%] border-[0.8px] border-textSecondary bg-textSecondary sm:w-[99%] dxl:h-[50px]" />
          <div className="absolute right-0 h-[39px] w-[98.5%] border-[0.8px] border-textSecondary sm:w-[99%] dxl:h-[50px]" />
          <div className="absolute bottom-[3px] left-[1.5%] right-[1.5%] h-[36px] w-[97%] border-b-[0.5px] border-l-[0.5px] border-textPrimary sm:left-[1%] sm:right-[1%] sm:w-[98%] dxl:h-[47px]" />
          <div className="relative flex w-full items-center justify-center text-display-4 text-textPrimary dxl:text-display-17">
            Checkout Securely
          </div>
        </section>
      </section>
    </section>
  )
}

function ProductDetail({ productData, setIsCartEmpty }) {
  const [removing, setRemoving] = useState(false)
  const [products, setProducts] = useState(productData)
  const [selectedItem, setSelectedItem] = useState(false)
  const isLargeScreen = useMediaQuery({ query: '(min-width:1280px)' })
  const router = useRouter()

  const handleRemoveItem = async (item) => {
    const loginToken = localStorage.getItem('loginToken')
    const nonce = localStorage.getItem('nonce')
    const itemKey = item?.key
    const headers = {
      'Content-Type': 'application/json',
      'X-Wc-Store-Api-Nonce': nonce,
    }

    // Check if loginToken is available
    if (loginToken) {
      headers['Authorization'] = `Bearer ${loginToken}`
    }

    try {
      setSelectedItem(item)
      setRemoving(true)
      //   const username = 'oakleighcdadevel'
      //   const password = 'QsJY lkVy QxL8 3iFY NhhP Cto1'
      // setLoadingToast(true)
      const response = await fetch(
        `${removeCartItemUrl}?key=${itemKey}`,
        {
          method: 'POST',
          headers,
          credentials: 'include',
        },
      )
      if (response.ok) {
        const filterRemovedItems = products.filter((e) => {
          return e.id !== item.id
        })
        if (!filterRemovedItems.length) {
          setIsCartEmpty(true)
        }
        setProducts(filterRemovedItems)
        setRemoving(false)
      } else {
        const errorData = await response.json()
      }
    } catch (error) { }
  }

  return (
    <section className="flex h-auto w-full flex-col gap-5 border-t-[1.2px] border-y-search pt-[30px] xl:gap-[30px] xl:pt-[20px]">
      {isLargeScreen && (
        <section className="flex h-auto w-full justify-between border-b-[1.2px] border-y-search pb-5 font-sans text-display-17">
          <p>Product</p>
        </section>
      )}
      <section className="flex h-auto w-full flex-col gap-[26px]">
        {products.map((item, index) => {
          return (
            <section key={index} className="flex h-auto w-full gap-2 xl:gap-10">
              <section className="h-auto w-full flex-1 xl:max-w-[134px]">
                <figure
                  key={index}
                  className="aspect-[3/4] max-h-[164px] min-w-[138px] max-w-[138px] sm:max-h-[270px] sm:max-w-[230px] xl:max-w-[138px]"
                >
                  <ProgressiveImageComp
                    src={item?.images[1]?.src}
                    alt={'productImage'}
                  />
                </figure>
              </section>
              <section className="flex flex-1 flex-col items-start gap-2 break-words xl:flex-row xl:items-center xl:justify-between">
                <p className="text-display-11 [overflow-wrap:anywhere] xl:max-w-[274px] dxl:text-display-12">
                  {item?.name}
                </p>
                <p className="relative font-sans text-display-16">
                  {item?.prices?.regular_price &&
                    priceFormatter(item?.prices?.regular_price, false)}
                  {isLargeScreen && index === 0 && (
                    <p className="absolute left-0 top-[-160px] text-display-17">
                      Total
                    </p>
                  )}
                </p>
                <section className="mt-4 cursor-pointer font-sans text-display-4 lg:mt-0 xl:text-display-17">
                  {removing && selectedItem?.id === item?.id ? (
                    <section className="flex gap-2">
                      <Spinner width={25} height={25} />
                      <p>Removing Item...</p>
                    </section>
                  ) : (
                    <u
                      onClick={() => {
                        handleRemoveItem(item)
                      }}
                    >
                      Remove Item
                    </u>
                  )}
                </section>
              </section>
            </section>
          )
        })}
        <Link
          href={'/shop-all'}
          className="flex h-auto w-full cursor-pointer items-center justify-start border-y-[1.2px] border-y-search py-[30px] font-sans text-display-4 xl:text-display-17"
        // onClick={() => {
        //   router.push('/shop-all')
        // }}
        >
          <u>Continue Shopping</u>
        </Link>
      </section>
    </section>
  )
}

function OrderSummary({ isPostcodeEntered, checkout, textFieldRef }) {
  const router = useRouter()
  const [coupon, setCoupon] = useState('')
  const [productData, setProductData] = useState({})
  const [promoToast, setPromoToast] = useState(false)
  const [promoToastMsg, setPromoToastMsg] = useState('')
  const [addingPromo, setAddingPromo] = useState(false)
  const [removingPromo, setRemovingPromo] = useState(false)
  const [addOrRemovePromo, setAddOrRemovePromo] = useState(false)
  const copyRightIcons = '/Images/copyRightImg.svg'
  const itemText = productData?.items?.length === 1 ? 'Item' : 'Items'
  const price = productData?.totals?.total_items
  const subTotal =
    price && priceFormatter(productData?.totals?.total_items, true)
  const totalPrice = productData?.totals?.total_price
  const orderTotal =
    totalPrice && priceFormatter(productData?.totals?.total_price, true)
  // const couponCode = productData?.coupons[0]?.code
  const isCouponAvailable = productData?.coupons?.length
  const couponDiscount = productData?.coupons?.length
    ? productData?.coupons[0]?.totals?.total_discount
    : '0'
  const deliveryRate = productData?.totals?.total_shipping

  useEffect(() => {
    const fetchData = async () => {
      const nonce = localStorage.getItem('nonce')
      const loginToken = localStorage.getItem('loginToken')
      const headers = { 'Content-Type': 'text/plain', Nonce: nonce }

      if (loginToken) {
        headers['Authorization'] = `Bearer ${loginToken}`
      }
      try {
        // setLoading(true)
        // const username = 'lejac53041@tanlanav.com'
        // const password = 'GPYM l0x4 kojE iW1e 2JhR Enj2'
        const response = await fetch(
          getCartUrl,
          {
            method: 'get',
            headers,
            credentials: 'include',
          },
        )
        const responseData = await response.json()
        if (responseData) {
          // setLoading(false)
          setProductData(responseData)
        }
      } catch (error) {
        // setLoading(false)
      }
    }
    fetchData()
  }, [addOrRemovePromo, isPostcodeEntered])

  const handleRemoveCoupon = async () => {
    const nonce = localStorage.getItem('nonce')
    const loginToken = localStorage.getItem('loginToken')
    const headers = { 'Content-Type': 'application/json', Nonce: nonce }

    if (loginToken) {
      headers['Authorization'] = `Bearer ${loginToken}`
    }
    try {
      setRemovingPromo(true)
      const response = await fetch(
        `${couponCodeUrl}?code=${coupon}`,
        {
          method: 'delete',
          headers,
          credentials: 'include',
        },
      )
      const responseData = await response.json()
      if (responseData) {
        setRemovingPromo(false)
        setAddOrRemovePromo(!addOrRemovePromo)
      }
    } catch (error) { }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!coupon) {
      setPromoToast(true)
      setPromoToastMsg('Please enter the Coupon code')
      return
    }
    const nonce = localStorage.getItem('nonce')
    const loginToken = localStorage.getItem('loginToken')
    const headers = { 'Content-Type': 'application/json', Nonce: nonce }

    // Check if loginToken is available
    if (loginToken) {
      headers['Authorization'] = `Bearer ${loginToken}`
    }
    try {
      setAddingPromo(true)
      const response = await fetch(
        `${couponCodeUrl}?code=${coupon}`,
        {
          method: 'post',
          headers,
          credentials: 'include',
        },
      )
      const responseData = await response.json()
      if (responseData) {
        setAddingPromo(false)
        setAddOrRemovePromo(!addOrRemovePromo)
        if (!responseData?.discount_type) {
          setPromoToast(true)
          setPromoToastMsg('Please enter a valid coupon code')
          return
        }
      }
    } catch (error) { }
  }

  const handleChange = (e) => {
    e.preventDefault()
    const { value } = e?.target
    setCoupon(value)
  }

  const handleCheckout = () => {
    if (!textFieldRef.current.value.trim()) {
      textFieldRef.current.focus()
      return
    }
    if (checkout) {
      router.push('/basket/checkout')
    }
  }

  return (
    <section className="mt-2 flex h-auto w-full flex-col gap-[30px] lg:mt-0 xl:max-w-[400px] dxl:min-w-[527px] dxl:max-w-[527px]">
      <section className="flex h-auto w-full flex-col bg-search p-[30px] text-footerBg dxl:p-[50px]">
        <p className="pb-[25px] text-display-11 dxl:pb-[30px] dxl:text-display-13">
          Order Summary
        </p>
        <section className="border-y-[1px] border-orderSummaryBorder pb-[25px] pt-[10px] font-sans dxl:pb-[30px] dxl:pt-5">
          <p className="text-display-5 dxl:pb-5 dxl:text-display-16">
            Promotion Code
          </p>
          <section className="h-auto w-full">
            <form className="flex h-auto w-full gap-5" onSubmit={handleSubmit}>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={coupon}
                placeholder="Enter Code"
                onChange={handleChange}
                className="h-[41px] w-full flex-1 appearance-none bg-textPrimary px-4 py-2 font-sans text-display-1 text-footerBg focus:outline-none sm:px-7 dxl:h-[53px] dxl:text-display-6"
              />
              <div className="relative flex h-[41px] w-[110px] cursor-pointer font-sans text-display-4 dxl:h-[53px] dxl:w-[150px] dxl:text-display-17">
                <div className="absolute bottom-0 h-[38px] w-[107px] border-[0.5px] border-textSecondary dxl:h-[50px] dxl:w-[147px]"></div>
                <div className="absolute right-0 h-[38px] w-[107px] border-[0.5px] border-textSecondary dxl:h-[50px] dxl:w-[147px]"></div>
                <button
                  type="submit"
                  className="relative flex w-full items-center justify-center"
                >
                  Submit
                </button>
              </div>
            </form>
            {promoToast && (
              <div className="mt-3 h-auto w-full">
                <Toast
                  message={promoToastMsg}
                  showToast={promoToast}
                  setShowToast={setPromoToast}
                />
              </div>
            )}
            {addingPromo && (
              <section className="mt-4 flex gap-2">
                <Spinner width={25} height={25} />
                <p>Adding Promo Code...</p>
              </section>
            )}
          </section>
        </section>
        <section className="flex h-auto w-full flex-col gap-[15px] py-[25px] font-sans">
          <section className="flex items-center justify-between text-display-5 leading-tight dxl:text-display-16">
            <p>
              Subtotal ({productData?.items?.length} {itemText})
            </p>
            <p>{subTotal}</p>
          </section>
          <section className="flex items-center justify-between text-display-3 leading-tight dxl:text-display-6">
            <p>Promotion Code</p>
            <section
              className="flex items-center gap-2 text-display-1 leading-tight"
              onClick={handleRemoveCoupon}
            >
              {isCouponAvailable ? (
                <p className="cursor-pointer text-[10px] sm:text-display-4 dxl:text-display-17">
                  <u>X Remove</u>
                </p>
              ) : null}
              <p className="text-display-3 dxl:text-display-6">
                -£{couponDiscount}.00
              </p>
            </section>
          </section>
          {removingPromo && (
            <section className="flex gap-2">
              <Spinner width={25} height={25} />
              <p>Removing Promo Code...</p>
            </section>
          )}
          <section className="flex items-center justify-between text-display-3 leading-tight dxl:text-display-6">
            <p>Delivery</p>
            <p>£{deliveryRate}.00</p>
          </section>
        </section>
        <section className="flex h-auto w-full items-center justify-between border-t-[1px] border-orderSummaryBorder pt-[25px] font-sans text-display-16 dxl:text-display-10">
          <p>Order Total</p>
          <p>{orderTotal}</p>
        </section>
      </section>
      <section
        className={`relative ${checkout
          ? 'cursor-pointer opacity-100'
          : 'cursor-not-allowed opacity-50'
          } flex h-[42px] font-sans
        lg:mx-auto lg:h-[53px] lg:w-[90%]`}
        role="button"
        onClick={handleCheckout}
      >
        <div className="absolute bottom-0 h-[39px] w-[99%] border-[0.5px] border-textSecondary bg-textSecondary sm:w-[99.5%] lg:h-[50px]" />
        <div className="absolute right-0 h-[39px] w-[99%] border-[0.5px] border-textSecondary sm:w-[99.5%] lg:h-[50px]" />
        <div className="absolute bottom-[3px] left-[1%] right-[1%] h-9 w-[98%] border-b-[0.5px] border-l-[0.5px] border-textPrimary sm:left-[0.5%] sm:right-[0.5%] sm:w-[99%] lg:h-[47px]" />
        <div className="relative flex w-full items-center justify-center text-display-4 text-textPrimary xl:text-display-17">
          Checkout Securely
        </div>
      </section>
      <section className="flex h-auto w-full items-center justify-center">
        <NextImage
          src={copyRightIcons}
          width="234"
          height="37"
          alt="copyRight"
        />
      </section>
    </section>
  )
}

function Delivery({
  productData,
  setIsPostcodeEntered,
  isPostcodeEntered,
  isCheckoutEnable,
  textFieldRef,
}) {
  const [countryCode, setCountryCode] = useState('')
  const [stateCode, setStateCode] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [formData, setFormData] = useState({})
  const [formError, setFormError] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [addingDeliveryInfo, setAddingDeliveryInfo] = useState(false)
  const [shippingAddress, setShippingAddress] = useState({
    address_1: productData?.shipping_address?.address_1 || '',
    address_2: productData?.shipping_address?.address_2 || '',
    address_3: productData?.shipping_address?.address_3 || '',
    city: productData?.shipping_address?.city || '',
  })
  const selectedCountry = productData?.shipping_address?.country
  const selectedState = productData?.shipping_address?.state
  const enteredPostalCode = productData?.shipping_address?.postcode
  const [postCode, setPostCode] = useState(
    enteredPostalCode ? enteredPostalCode : '',
  )
  // const selectedCountry = productData?.shipping_address?.country
  // const selectedState = productData?.shipping_address?.state
  const isStateSelected = stateCode || selectedState
  const isOrderFromUk =
    (selectedCountry === 'GB' && !countryCode) || countryCode === 'GB'

  const handleChange = (e) => {
    e.preventDefault()
    const { value, type, name } = e?.target
    if (name === 'postcode') {
      formData.postcode = value
      setPostCode(value)
      return
    }
    if (name === 'address_1') {
      // setShippingAddress({
      //   address_1: value,
      // })
      setShippingAddress((prev) => ({
        ...prev,
        [name]: value,
      }))
      return
    }
    if (name === 'address_2') {
      setShippingAddress((prev) => ({
        ...prev,
        [name]: value,
      }))
      return
    }
    if (name === 'address_3') {
      setShippingAddress((prev) => ({
        ...prev,
        [name]: value,
      }))
      return
    }
    if (name === 'city') {
      setShippingAddress((prev) => ({
        ...prev,
        [name]: value,
      }))
      return
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nonce = localStorage.getItem('nonce')
    const loginToken = localStorage.getItem('loginToken')
    const headers = { 'Content-Type': 'application/json', Nonce: nonce }
    if (isOrderFromUk) {
      if ((!countryCode && !selectedCountry) || !postCode) {
        {
          setShowToast(true)
          setToastMessage('Please enter/select required fields')
          return
        }
      }
      const postData = {
        shipping_address: {
          country: String(countryCode ? countryCode : selectedCountry),
          postcode: String(postCode),
        },
      }

      // Check if loginToken is available
      if (loginToken) {
        headers['Authorization'] = `Bearer ${loginToken}`
      }
      try {
        setAddingDeliveryInfo(true)
        const response = await fetch(
          updateCusUrl,
          {
            method: 'POST',
            headers,
            body: JSON.stringify(postData),
            credentials: 'include',
          },
        )
        const responseData = await response.json()

        if (responseData) {
          if (responseData?.data?.status === 400) {
            setAddingDeliveryInfo(false)
            setShowToast(true)
            setToastMessage(responseData?.data?.params?.shipping_address)
            setPostCode('')
            return
          }
          setAddingDeliveryInfo(false)
          setIsPostcodeEntered(true)
          setShowToast(true)
          setToastMessage(
            'Postcode added successfully, you can proceed to checkout',
          )
        }
      } catch (error) { }
      return
    }
    if (
      !shippingAddress.address_1 ||
      !shippingAddress.address_2 ||
      !isStateSelected ||
      !postCode
    ) {
      setShowToast(true)
      setToastMessage('Please enter/select all the required fields')
      return
    }
    if (!isChecked) {
      setShowToast(true)
      setToastMessage(
        'Please accept responsibility for any taxes and duties payable on import',
      )
      return
    }
    if (loginToken) {
      headers['Authorization'] = `Bearer ${loginToken}`
    }
    formData.state = stateCode || selectedState
    formData.country = countryCode || selectedCountry
    const shippingData = {
      shipping_address: {
        address_1: formData?.address_1,
        address_2: formData?.address_2,
        address_3: formData?.address_3,
        city: formData?.city,
        country: formData?.country,
        state: formData?.state,
        postcode: postCode,
      },
      billing_address: {
        address_1: formData?.address_1,
        address_2: formData?.address_2,
        address_3: formData?.address_3,
        city: formData?.city,
        country: formData?.country,
        state: formData?.state,
        postcode: postCode,
      },
    }
    try {
      setAddingDeliveryInfo(true)
      const response = await fetch(
        updateCusUrl,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(shippingData),
          credentials: 'include',
        },
      )
      const responseData = await response.json()

      if (responseData) {
        if (responseData?.data?.status === 400) {
          setAddingDeliveryInfo(false)
          setShowToast(true)
          setToastMessage(responseData?.data?.params?.shipping_address)
          return
        }
        setAddingDeliveryInfo(false)
        setShowToast(true)
        setToastMessage(
          'Shipping address added successfully, you can proceed to checkout',
        )
        // setIsPostcodeEntered(!isPostcodeEntered)
      }
    } catch (error) { }
    return
  }

  useEffect(() => {
    isCheckoutEnable(isChecked, isOrderFromUk)
  }, [isChecked, isOrderFromUk])

  return (
    <section className="flex h-auto w-full flex-col gap-5 lg:max-w-[526px]">
      <p className="text-display-11">Delivery</p>
      <CountrySelector
        setCountryCode={setCountryCode}
        selectedCountry={selectedCountry}
      />
      <section className="h-auto w-full">
        <form
          className={`flex ${isOrderFromUk ? 'flex-row' : 'flex-col'
            } h-auto w-full gap-4 dxl:gap-5`}
          onSubmit={handleSubmit}
        >
          {isOrderFromUk ? (
            <>
              <input
                type="text"
                id="postcode"
                name="postcode"
                value={postCode}
                placeholder="Enter Postcode"
                onChange={handleChange}
                ref={textFieldRef}
                className="h-[41px] w-full flex-1 appearance-none bg-search px-7 py-2 font-sans text-display-3 text-black dxl:h-[50px] dxl:text-display-6"
              />
              <div className="relative flex h-[41px] w-[110px] font-sans text-display-4 dxl:h-[50px] dxl:w-[150px] dxl:text-display-17">
                <div className="absolute bottom-0 h-[38px] w-[107px] border-[0.5px] border-textSecondary dxl:h-[47px] dxl:w-[147px]"></div>
                <div className="absolute right-0 h-[38px] w-[107px] border-[0.5px] border-textSecondary dxl:h-[47px] dxl:w-[147px]"></div>
                <button
                  type="submit"
                  className="relative flex w-full items-center justify-center"
                >
                  Submit
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="h-auto w-full font-sans text-display-5 leading-normal dxl:text-display-10">
                Shipping Address
              </p>
              <input
                type="text"
                id="address_1"
                name="address_1"
                value={shippingAddress.address_1}
                placeholder="Address Line 1*"
                onChange={handleChange}
                className="h-[41px] w-full flex-1 appearance-none bg-search px-7 py-2 font-sans text-display-3 text-black dxl:h-[50px] dxl:text-display-6"
              />
              <input
                type="text"
                id="address_2"
                name="address_2"
                value={shippingAddress.address_2}
                placeholder="Address Line 2*"
                onChange={handleChange}
                className="h-[41px] w-full flex-1 appearance-none bg-search px-7 py-2 font-sans text-display-3 text-black dxl:h-[50px] dxl:text-display-6"
              />
              <input
                type="text"
                id="address_3"
                name="address_3"
                value={shippingAddress.address_3}
                placeholder="Address Line 3"
                onChange={handleChange}
                className="h-[41px] w-full flex-1 appearance-none bg-search px-7 py-2 font-sans text-display-3 text-black dxl:h-[50px] dxl:text-display-6"
              />
              <input
                type="text"
                id="city"
                name="city"
                value={shippingAddress.city}
                placeholder="Village / City / Town"
                onChange={handleChange}
                className="h-[41px] w-full flex-1 appearance-none bg-search px-7 py-2 font-sans text-display-3 text-black dxl:h-[50px] dxl:text-display-6"
              />
              <input
                type="text"
                id="postcode"
                name="postcode"
                value={postCode}
                placeholder="Postcode"
                onChange={handleChange}
                ref={textFieldRef}
                className="h-[41px] w-full flex-1 appearance-none bg-search px-7 py-2 font-sans text-display-3 text-black dxl:h-[50px] dxl:text-display-6"
              />
              <StateSelector
                selectedCountry={countryCode ? countryCode : selectedCountry}
                selectedState={selectedState}
                setStateCode={setStateCode}
              />
              <section className="flex w-full gap-2 dxl:gap-4">
                <CheckBox isChecked={isChecked} setIsChecked={setIsChecked} />
                <p className="mt-[-6px] h-auto  w-full font-sans text-display-3 dxl:text-display-6">
                  I accept all responsibility for any taxes and duties payable
                  on import
                </p>
              </section>
              <div className="relative flex h-[41px] w-[110px] font-sans text-display-4 dxl:h-[50px] dxl:w-[150px] dxl:text-display-17">
                <div className="absolute bottom-0 h-[38px] w-[107px] border-[0.5px] border-textSecondary dxl:h-[47px] dxl:w-[147px]"></div>
                <div className="absolute right-0 h-[38px] w-[107px] border-[0.5px] border-textSecondary dxl:h-[47px] dxl:w-[147px]"></div>
                <button
                  type="submit"
                  className="relative flex w-full items-center justify-center"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </form>
      </section>
      {addingDeliveryInfo && (
        <section className="mt-4 flex gap-2">
          <Spinner width={25} height={25} />
          <p>Adding Delivery Info...</p>
        </section>
      )}
      {showToast && (
        <div className="h-auto w-full">
          <Toast
            message={toastMessage}
            showToast={showToast}
            setShowToast={setShowToast}
          />
        </div>
      )}
    </section>
  )
}

function YourBasket() {
  const [data, setData] = useState([])
  const textFieldRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [isCartEmpty, setIsCartEmpty] = useState(false)
  const [checkout, setCheckout] = useState(false)
  const [isPostcodeEntered, setIsPostcodeEntered] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const nonce = localStorage.getItem('nonce')
      const loginToken = localStorage.getItem('loginToken')
      const headers = { 'Content-Type': 'text/plain', Nonce: nonce }

      if (loginToken) {
        headers['Authorization'] = `Bearer ${loginToken}`
      }
      try {
        setLoading(true)
        // const username = 'lejac53041@tanlanav.com'
        // const password = 'GPYM l0x4 kojE iW1e 2JhR Enj2'
        const response = await fetch(
          getCartUrl,
          {
            method: 'get',
            headers,
            credentials: 'include',
          },
        )
        const responseData = await response.json()
        if (responseData) {
          setLoading(false)
        }
        setData(responseData)
      } catch (error) {
        setLoading(false)
      }
    }
    fetchData()
    window.scrollTo(0, 0)
  }, [])

  const isCheckoutEnable = (isCheckoutEnable, isOrderFromUk) => {
    const checkoutReady = isCheckoutEnable || isOrderFromUk
    return setCheckout(checkoutReady)
  }

  return (
    <main className="flex h-auto w-full flex-col gap-6 px-9 pt-[14px] xl:gap-10 xl:px-[64px] dxl:gap-14 dxl:px-[132px]">
      <Breadcrumbs />
      {loading ? (
        <section className="flex h-auto w-full items-center justify-center">
          <Spinner width={50} height={50} />
        </section>
      ) : !data?.items?.length || isCartEmpty ? (
        <div className="flex h-auto w-full items-center justify-center text-display-12">
          Your Cart is Empty
        </div>
      ) : (
        <section className="xl flex h-auto w-full flex-col gap-6 xl:gap-[50px]">
          {' '}
          <BasketHead checkout={checkout} textFieldRef={textFieldRef} />
          <section className="flex h-auto w-full flex-col gap-6 lg:flex-row">
            <section className="flex h-auto w-full flex-col gap-6">
              <ProductDetail
                productData={data?.items}
                setIsCartEmpty={setIsCartEmpty}
              />
              <Delivery
                productData={data}
                setIsPostcodeEntered={setIsPostcodeEntered}
                isPostcodeEntered={isPostcodeEntered}
                isCheckoutEnable={isCheckoutEnable}
                textFieldRef={textFieldRef}
              />
            </section>
            <OrderSummary
              productData={data}
              isPostcodeEntered={isPostcodeEntered}
              checkout={checkout}
              textFieldRef={textFieldRef}
            />
          </section>
        </section>
      )}
    </main>
  )
}
export default YourBasket

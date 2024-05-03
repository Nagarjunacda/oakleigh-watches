import { use, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'
import Toast from '@/reuseComps/ToastMessage'
import { useStripe } from '@stripe/react-stripe-js'
import { Base64 } from 'js-base64'
import { wpPaymentUpdateUrl } from '@/utils/urls'
import { getCartUrl } from '@/utils/urls'
import { checkoutUrl } from '@/utils/urls'
import ShippingAddress from '@/components/CheckOut/ShippingAddress'
import ProgressiveImageComp from '@/reuseComps/ProgressiveImageComp'
import PaymentSection from '@/components/CheckOut/PaymentSection'
import Breadcrumbs from '@/components/BreadCrumbs'
import CheckoutItems from '@/components/CheckOut/CheckoutItems'
import ShippingPage from '@/components/CheckOut/ShippingPage'
import CheckBox from '@/reuseComps/CheckBox'
import Spinner from '@/reuseComps/Spinner'
import OverlayWindow from '@/reuseComps/OverlayComp'
import { check } from 'prettier'

function BillingBlock({
  handlePayment,
  isPaymentProcessing,
  showToast,
  setShowToast,
  message,
  basketData,
  isPaynowClicked,
}) {
  const [isOverlayOpen, setIsOverlayOpen] = useState('')
  const [isShippingAddress, setIsShippingAddress] = useState(true)
  const [isBillingAddress, setIsBillingAddress] = useState(false)
  const leftIcon = '/Images/leftArrow.svg'

  const handleOverlay = (clickedLink) => {
    setIsOverlayOpen(clickedLink)
  }

  const handleAddress = () => {
    setIsShippingAddress(!isShippingAddress)
    setIsBillingAddress(!isBillingAddress)
  }

  return (
    <section className="flex h-auto w-full flex-col gap-6 font-sans ">
      <section className="flex h-auto w-full flex-col gap-3">
        <p className="font-cormorant text-display-11 dxl:text-display-12">
          Billing Address
        </p>
        <p className="text-display-3 dxl:text-display-6">
          Select the address that matches your card or payment method
        </p>
        <section className="flex flex-col gap-1 text-display-3 dxl:text-display-6">
          <section className="flex items-center gap-2">
            <section onClick={handleAddress}>
              <CheckBox
                isChecked={isShippingAddress}
              // setIsChecked={setIsShippingAddress}
              />
            </section>
            <p>Same as shipping address</p>
          </section>
          <section className="flex items-center gap-2">
            <section onClick={handleAddress}>
              <CheckBox
                isChecked={isBillingAddress}
              // setIsChecked={setIsBillingAddress}
              />
            </section>
            <p>Use a different billing address</p>
          </section>
          {isBillingAddress && (
            <ShippingAddress
              address={{}}
              basketData={basketData}
              email={''}
              emailError={''}
              isFromPayment
              isPaynowClicked={isPaynowClicked}
            />
          )}
        </section>
      </section>
      <section className="flex h-auto w-full flex-col gap-3">
        <p className="font-cormorant text-display-11 dxl:text-display-12">
          Remember Me
        </p>
        <section className="flex items-center gap-2 text-display-3 dxl:text-display-6">
          <CheckBox />
          <p>Save my information for a faster checkout</p>
        </section>
      </section>
      <p className="text-display-3 dxl:text-display-6">
        By clicking below and completing your order, you agree to purchase your
        item(s) from Oakleigh Watches as merchant of record for this
        transaction, on Oakleigh Watches{' '}
        <u
          onClick={() => {
            handleOverlay('terms')
          }}
          className="cursor-pointer"
        >
          Terms & Conditions
        </u>{' '}
        and{' '}
        <u
          onClick={() => {
            handleOverlay('privacy')
          }}
          className="cursor-pointer"
        >
          Privacy Policy
        </u>
        .
      </p>
      <OverlayWindow
        isOverlayOpen={isOverlayOpen}
        setIsOverlayOpen={setIsOverlayOpen}
      />
      {showToast && (
        <Toast
          showToast={showToast}
          setShowToast={setShowToast}
          message={message}
        />
      )}
      {isPaymentProcessing && (
        <section className="mt-4 flex gap-2">
          <Spinner width={25} height={25} />
          <p>Processing your payment...</p>
        </section>
      )}
      <section className="flex h-auto w-full items-center justify-between dxl:mt-[5px]">
        <section className="flex flex-1 items-center justify-start gap-1">
          <section className="h-3 w-3 dxl:mt-[3px] dxl:h-4 dxl:w-4">
            <ProgressiveImageComp src={leftIcon} alt="left" />
          </section>
          <p className="font-sans text-display-4 leading-4 dxl:text-display-17">
            <Link href={'/basket/checkout/shipping'}>
              <u>Return To Shipping</u>
            </Link>
          </p>
        </section>
        <section
          className="relative mt-1 flex h-[42px] w-full flex-1 font-sans lg:max-w-[180px] dxl:h-[53px] dxl:max-w-[279px]"
          onClick={() => {
            handlePayment()
          }}
          role="button"
        >
          <div className="absolute bottom-0 h-[39px] w-[98.5%] border-[0.8px] border-textSecondary bg-textSecondary sm:w-[99%] dxl:h-[50px]" />
          <div className="absolute right-0 h-[39px] w-[98.5%] border-[0.8px] border-textSecondary sm:w-[99%] dxl:h-[50px]" />
          <div className="absolute bottom-[3px] left-[1.5%] right-[1.5%] h-[36px] w-[97%] border-b-[0.5px] border-l-[0.5px] border-textPrimary sm:left-[1%] sm:right-[1%] sm:w-[98%] dxl:h-[47px]" />
          <div className="relative flex w-full items-center justify-center text-display-1 text-textPrimary sm:text-display-4 dxl:text-display-17">
            Pay Now
          </div>
        </section>
      </section>
    </section>
  )
}

function Payment() {
  const stripe = useStripe()
  const router = useRouter()
  const [stripeData, setStripeData] = useState({})
  const [basketData, setBasketData] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('stripe_cc')
  const [addOrRemovePromo, setAddOrRemovePromo] = useState(false)
  const [isPaynowClicked, setIsPaynowClicked] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [decodedJson, setDecodedJson] = useState({})
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)
  const [cardClear, setCardClear] = useState(false)
  const oakleighLogo = '/Images/oakleighLogo.svg'
  const leftIcon = '/Images/leftArrow.svg'

  const getStripeResponse = (data) => {
    setStripeData(data)
  }

  const handleStripeProcess = async (data) => {
    const redirect_url = data?.payment_result?.redirect_url
    function parseUrlHash(url) {
      const matches = url.match(/^#response=(.*)/)
      if (matches && matches[1]) {
        const decodedString = decodeURIComponent(
          Buffer.from(matches[1], 'base64').toString('utf-8'),
        )
        const stringWithoutSpaces = decodedString.replace(/[^ -~]/g, '')
        return JSON.parse(stringWithoutSpaces)
      } else {
        return null
      }
    }
    const stripeIntentData = parseUrlHash(redirect_url)
    const clientSecret = stripeIntentData?.client_secret
    const isSuccessful = function (paymentIntent) {
      if (paymentIntent.status == 'succeeded') {
        return true
      }
      if (paymentIntent.status == 'requires_capture') {
        return true
      }
      if (paymentIntent.status == 'requires_confirmation') {
        return true
      }
      return false
    }

    // const decodedString = atob(redirecUrl)
    // const decodedData = JSON.parse(decodedString)

    const processOrder = (result) => {
      //   setPaymentCompleted(false)
      // if (result.order_id && result.status == 'processing') {
      //   //setCreateOrderStatus(true)
      //   router.push('/checkout/order-received/' + result.data.order_id)
      //   // setSuccessMessage(true)
      //   // setOrderId(result.data.order_id)
      //   return
      // }
      if (
        result.order_id &&
        result.status == 'processing' &&
        result.payment_method == 'stripe_cc'
      ) {
        router.push('/order-received/' + result.order_id)
      }
      if (
        result.order_id &&
        result.status === 'pending' &&
        result.payment_method == 'stripe_cc'
      ) {
        // setSuccessMessage(true)
        // setCreateOrderStatus(true)
        // setOrderId(result.data.order_id)
        router.push('/order-received/' + result.order_id)
      } else {
        // setShowToast(true)
        // setToastMessage('Payment Failed Please Try Again')
      }
      setIsPaymentProcessing(false)
    }

    const stripeProcess = async (result) => {
      // let clientSecret = result?.payment_result?.payment_details?.[2]?.value
      // let verificationLink =
      //   result?.payment_result?.payment_details?.[4]?.value.replace(
      //     'cms/cms',
      //     'cms',
      //   )
      if (clientSecret) {
        // const { paymentIntent: retrievePayment } =
        //   await stripe.retrievePaymentIntent()
        if (stripeIntentData.status == 'requires_action') {
          const nextAction = await stripe.handleCardAction(clientSecret)
          if (nextAction && nextAction.paymentIntent) {
            if (isSuccessful(nextAction.paymentIntent)) {
              const url = `https://api.stripe.com/v1/payment_intents/${nextAction?.paymentIntent?.id}/confirm`
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer sk_test_51IdGbhGLGyyBwMWYvbPv68XECUNWoQMM1wu0lmzuOmhjqNyTLOV5V1WuoZEIjlBW5G4oTT2SOpWSmPcI4mCvqweO00ujxFotO7`,
                },
                // body: JSON.stringify(shippingData),
                // credentials: 'include',
              })
              const responseData = await response.json()
              if (responseData) {
                const loginToken = localStorage.getItem('loginToken')
                const nonce = localStorage.getItem('nonce')
                const headers = {
                  'Content-Type': 'application/json',
                  // Nonce: nonce,
                }
                if (loginToken) {
                  headers['Authorization'] = `Bearer ${loginToken}`
                }
                const postData = {
                  order_id: result?.order_id,
                  order_key: result?.order_key,
                  stripe_cc_save_source_key: false,
                  stripe_cc_token_key: nextAction?.paymentIntent?.id,
                }
                const url = `${wpPaymentUpdateUrl}/?order_id=${result?.order_id}&order_key=${result?.order_key}`

                const res = await fetch(url, {
                  method: 'get',
                  headers,
                  // headers: {
                  //   Authorization: `Bearer sk_test_51IdGbhGLGyyBwMWYvbPv68XECUNWoQMM1wu0lmzuOmhjqNyTLOV5V1WuoZEIjlBW5G4oTT2SOpWSmPcI4mCvqweO00ujxFotO7`,
                  // },
                  // body: JSON.stringify({ hello: 'hello' }),
                  // credentials: 'include',
                })
              }
              processOrder(result)
              // verificationLink && axios.get(verificationLink)
              // if (verificationLink) {
              //   const nonce = localStorage.getItem('nonce')
              //   const loginToken = localStorage.getItem('loginToken')
              //   const headers = { 'Content-Type': 'text/plain', Nonce: nonce }

              //   if (loginToken) {
              //     headers['Authorization'] = `Bearer ${loginToken}`
              //   }
              //   try {
              //     const response = await fetch(verificationLink, {
              //       method: 'get',
              //       headers,
              //       credentials: 'include',
              //     })
              //     const responseData = await response.json()
              //     if (responseData) {
              //     }
              //   } catch (error) {}
              // }
            } else {
              setShowToast(true)
              setToastMessage('Payment failed please try again')
              // toast.error("Payment failed, the PaymentIntent has a status of " + nextAction.paymentIntent.status);
              // dispatch(clearCardElement());
              // setBtnText('Place Order')
            }
          } else {
            setShowToast(true)
            setToastMessage('Payment failed please try again')
            if (nextAction && nextAction.error && nextAction.error.message) {
              setIsPaymentProcessing(false)
              // toast.error(nextAction.error.message);
              // dispatch(clearCardElement());
            } else {
              // dispatch(clearCardElement());
              // toast.error("failed");
              setBtnText('Place Order')
            }
          }
        }
        // else if (isSuccessful(retrievePayment)) {
        //   processOrder(result)
        //   verificationLink && axios.get(verificationLink)
        // } else {
        //   // dispatch(clearCardElement());
        //   // toast.error("Unhandled PaymentIntent status " + retrievePayment.status);
        // }
      }
    }
    if (data?.order_id) {
      let result = data
      // let clientSecret = result?.payment_result?.payment_details?.[2]?.value
      if (result.payment_method === 'stripe_cc' && clientSecret) {
        stripeProcess(result)
      } else {
        processOrder(result)
      }
    }
  }

  const formArr = {
    billing_address: basketData.billing_address,
    shipping_address: basketData.shipping_address,
    // create_account: values.create_account && values.create_account[0],
    create_account: false,
    customer_note: 'place order',
    payment_method: stripeData.payment_method,
    payment_data:
      stripeData.payment_method == 'stripe_cc' ? stripeData.payment_data : {},
    // 'terms-field': values.terms_field,
    // dpd_uk_delivery_instructions: values.dpd_uk_delivery_instructions,
    // currency: JSON.parse(localStorage.getItem('currentCurrency'))
    //   ? JSON.parse(localStorage.getItem('currentCurrency'))
    //   : 'GBP',
    currency: 'GBP',
  }

  const handlePayment = async () => {
    // Or handle the case where the hash parameter is missing    } }
    const nonce = localStorage.getItem('nonce')
    const loginToken = localStorage.getItem('loginToken')
    const headers = {
      'Content-Type': 'application/json',
      'X-Wc-Store-Api-Nonce': nonce,
    }
    if (!stripeData?.payment_method) {
      setShowToast(true)
      setToastMessage('Please enter required card details')
      return
    }
    setIsPaynowClicked(true)
    // Check if loginToken is available
    if (loginToken) {
      headers['Authorization'] = `Bearer ${loginToken}`
    }
    setCardClear(true)
    if (stripeData.payment_method == 'eh_klarna_stripe') {
      formArr['eh_klarna_token'] = stripeData.klarnaId
    }
    try {
      setIsPaymentProcessing(true)
      const response = await fetch(
        checkoutUrl,
        {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify(formArr),
        },
      )
      setCardClear(false)
      if (response.ok) {
        const data = await response.json()
        // setPaymentCompleted(true)
        handleStripeProcess(data)
      } else {
        setShowToast(true)
        setToastMessage('Payment failed please try again')
        setIsPaymentProcessing(false)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

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
          setBasketData(responseData)
        }
      } catch (error) {
        // setLoading(false)
      }
    }
    fetchData()
  }, [addOrRemovePromo])

  return (
    <main className="relative flex h-auto w-full flex-col items-start justify-start gap-5 px-9 py-[34px] lg:gap-8 lg:px-12 lg:pb-0 lg:pt-[50px] xl:px-16 dxl:px-[143px]">
      <figure className="max-h-[34px] max-w-[180px] dxl:min-h-[60px] dxl:min-w-[304px]">
        <Link href={'/'}>
          <ProgressiveImageComp src={oakleighLogo} alt={'oakleighlogo'} />
        </Link>
      </figure>
      <section>
        <Breadcrumbs />
      </section>
      <section className="flex h-auto w-full flex-col gap-8 lg:flex-row lg:justify-between lg:gap-10 xl:gap-16">
        <section className="self-stretch bg-search lg:order-2 lg:flex-1">
          <CheckoutItems
            basketData={basketData}
            setAddOrRemovePromo={setAddOrRemovePromo}
            addOrRemovePromo={addOrRemovePromo}
          />
        </section>
        <section className="flex flex-col gap-4 lg:flex-1 lg:pb-64 dxl:gap-[50px]">
          <ShippingPage basketData={basketData} />
          <PaymentSection
            basketData={basketData}
            getStripeResponse={getStripeResponse}
            cardClear={cardClear}
            setPaymentMethod={setPaymentMethod}
          />
          <BillingBlock
            handlePayment={handlePayment}
            showToast={showToast}
            message={toastMessage}
            setShowToast={setShowToast}
            isPaymentProcessing={isPaymentProcessing}
            basketData={basketData}
            isPaynowClicked={isPaynowClicked}
          />
        </section>
      </section>
    </main>
  )
}
export default Payment

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Breadcrumbs from '@/components/BreadCrumbs'
import ExpressCheckout from '@/components/CheckOut/ExpressCheckout'
import ShippingAddress from '@/components/CheckOut/ShippingAddress'
import CheckoutLogin from '@/components/CheckOut/CheckoutLogin'
import { checkoutUrl } from '@/utils/urls'
import { getCartUrl } from '@/utils/urls'
import axios from 'axios'
import ProgressiveImageComp from '@/reuseComps/ProgressiveImageComp'
import Toast from '@/reuseComps/ToastMessage'
import PaymentModes from '@/components/CheckOut/PaymentModes'
import { useStripe } from '@stripe/react-stripe-js'
import CheckoutItems from '@/components/CheckOut/CheckoutItems'
import LoginDropdown from '@/components/LoginDropdown'

function CheckoutPage() {
  const stripe = useStripe()
  const router = useRouter()
  const [stripeData, setStripeData] = useState({})
  const [orderData, setOrderData] = useState({})
  const [showToast, setShowToast] = useState(false)
  const [basketData, setBasketData] = useState([])
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [openLoginModal, setOpenLoginModal] = useState(false)
  const [addOrRemovePromo, setAddOrRemovePromo] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const oakleighLogo = '/Images/oakleighLogo.svg'
  const shippingAddress = basketData?.shipping_address

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
    // billing_vat_number: values.billing_address.vat_number,
    // dpd_uk_delivery_instructions: values.dpd_uk_delivery_instructions,
    // currency: JSON.parse(localStorage.getItem('currentCurrency'))
    //   ? JSON.parse(localStorage.getItem('currentCurrency'))
    //   : 'GBP',
    currency: 'GBP',
  }

  const getStripeResponse = (data) => {
    setStripeData(data)
  }

  const handleStripeProcess = (data) => {
    const isSuccessful = function (paymentIntent) {
      if (paymentIntent.status == 'succeeded') {
        return true
      }
      if (paymentIntent.status == 'requires_capture') {
        return true
      }
      return false
    }

    const processOrder = (result) => {
      setPaymentCompleted(false)
      // if (result.order_id && result.status == 'processing') {
      //   //setCreateOrderStatus(true)
      //   router.push('/checkout/order-received/' + result.data.order_id)
      //   // setSuccessMessage(true)
      //   // setOrderId(result.data.order_id)
      //   return
      // }
      if (
        result.order_id &&
        result.status == 'pending' &&
        result.payment_method == 'stripe'
      ) {
        //setSuccessMessage(true)
        //setCreateOrderStatus(true)
        //setOrderId(result.data.order_id)
        // router.push('/checkout/order-received/' + result.order_id)
      } else {
        setShowToast(true)
        setToastMessage('Payment Failed Please Try Again')
      }
    }

    const stripeProcess = async (result) => {
      let clientSecret = result?.payment_result?.payment_details?.[2]?.value
      let verificationLink =
        result?.payment_result?.payment_details?.[4]?.value.replace(
          'cms/cms',
          'cms',
        )
      if (clientSecret) {
        // const { stripe } = await paymentSuccessData

        const { paymentIntent: retrievePayment } =
          await stripe.retrievePaymentIntent(clientSecret)

        if (retrievePayment.status == 'requires_action') {
          const nextAction = await stripe.handleNextAction({
            clientSecret: clientSecret,
          })

          if (nextAction && nextAction.paymentIntent) {
            if (isSuccessful(nextAction.paymentIntent)) {
              processOrder(result)
              verificationLink && axios.get(verificationLink)
            } else {
              // toast.error("Payment failed, the PaymentIntent has a status of " + nextAction.paymentIntent.status);
              // dispatch(clearCardElement());
              setBtnText('Place Order')
            }
          } else {
            if (nextAction && nextAction.error && nextAction.error.message) {
              // toast.error(nextAction.error.message);
              // dispatch(clearCardElement());
            } else {
              // dispatch(clearCardElement());
              // toast.error("failed");
              setBtnText('Place Order')
            }
          }
        } else if (isSuccessful(retrievePayment)) {
          processOrder(result)
          verificationLink && axios.get(verificationLink)
        } else {
          // dispatch(clearCardElement());
          // toast.error("Unhandled PaymentIntent status " + retrievePayment.status);
        }
      }
    }
    if (data?.order_id) {
      let result = data
      let clientSecret = result?.payment_result?.payment_details?.[2]?.value
      if (result.payment_method === 'stripe' && clientSecret) {
        stripeProcess(result)
      } else {
        processOrder(result)
      }
    }
  }

  const handlePayment = async () => {
    const nonce = localStorage.getItem('nonce')
    const loginToken = localStorage.getItem('loginToken')
    const headers = {
      'Content-Type': 'application/json',
      'X-Wc-Store-Api-Nonce': nonce,
    }

    // Check if loginToken is available
    if (loginToken) {
      headers['Authorization'] = `Bearer ${loginToken}`
    }
    try {
      const response = await fetch(
        checkoutUrl,
        {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify(formArr),
        },
      )

      if (response.ok) {
        const data = await response.json()
        setPaymentCompleted(true)
        handleStripeProcess(data)
      } else {
        console.error(
          'Failed to add item to the basket. Status:',
          response.status,
        )
        const errorData = await response.json()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSuccessfulLogin = () => {
    setOpenLoginModal(!openLoginModal)
    document.body.classList.remove('no-scroll')
  }

  const handleCreateAcc = () => {
    router.push('/sign-up').then(() => {
      setOpenLoginModal(!openLoginModal)
      document.body.classList.remove('no-scroll')
    })
  }

  const handleLoginClick = () => {
    setOpenLoginModal(true)
    document.body.classList.add('no-scroll')
  }

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const nonce = localStorage.getItem('nonce')
  //     const loginToken = localStorage.getItem('loginToken')
  //     const headers = { 'Content-Type': 'text/plain', Nonce: nonce }

  //     // Check if loginToken is available
  //     if (loginToken) {
  //       headers['Authorization'] = `Bearer ${loginToken}`
  //     }
  //     try {
  //       // setLoading(true)
  //       // const username = 'lejac53041@tanlanav.com'
  //       // const password = 'GPYM l0x4 kojE iW1e 2JhR Enj2'
  //       const response = await fetch(
  //         checkoutUrl,
  //         {
  //           method: 'get',
  //           headers,
  //           credentials: 'include',
  //         },
  //       )
  //       const responseData = await response.json()
  //       if (responseData) {
  //         // setOrderData(responseData)
  //         // setData(responseData)
  //         // setLoading(false)
  //       }
  //       if (!responseData.ok) {
  //         // Handle non-successful responses (e.g., 404, 500)
  //         console.error(`API request failed with status ${response.status}`)
  //       }
  //     } catch (error) {
  //       // setLoading(false)
  //     }
  //   }
  //   fetchData()
  // }, [])

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
          setEmail(responseData?.billing_address?.email)
        }
      } catch (error) {
        // setLoading(false)
      }
    }
    fetchData()
  }, [openLoginModal, addOrRemovePromo])

  return (
    <>
      <main className="relative flex h-auto w-full flex-col items-start justify-start gap-5 px-9 py-[34px] lg:gap-8 lg:px-12 lg:py-[50px] xl:px-16 dxl:px-[143px] dxl:pb-[150px]">
        <figure
          className="max-h-[34px] max-w-[180px] cursor-pointer dxl:min-h-[60px] dxl:min-w-[304px]"
          onClick={() => {
            router.push('/')
          }}
        >
          <ProgressiveImageComp src={oakleighLogo} alt={'oakleighlogo'} />
        </figure>
        <section>
          <Breadcrumbs />
        </section>
        <section className="flex h-auto w-full flex-col gap-4 lg:flex-row lg:justify-between lg:gap-10 xl:gap-16">
          <section className="self-stretch bg-search lg:order-2 lg:flex-1">
            <CheckoutItems
              basketData={basketData}
              setAddOrRemovePromo={setAddOrRemovePromo}
              addOrRemovePromo={addOrRemovePromo}
            />
          </section>
          <section className="flex flex-col gap-6 lg:order-1 lg:flex-1">
            <ExpressCheckout />
            <section className="flex w-full items-center justify-between gap-4 font-sans text-orderSummaryBorder">
              <hr className="w-full text-orderSummaryBorder" />
              <p className="text-display-3">OR</p>
              <hr className="w-full text-orderSummaryBorder" />
            </section>
            <CheckoutLogin
              handleLoginClick={handleLoginClick}
              setEmail={setEmail}
              setEmailError={setEmailError}
              email={email}
              emailError={emailError}
              basketData={basketData}
            />
            <ShippingAddress
              address={shippingAddress}
              basketData={basketData}
              email={email}
              emailError={emailError}
            />
          </section>
        </section>
        {/* <PaymentModes getStripeResponse={getStripeResponse} />
      <button
        className="border-[1px] bg-orange-500 p-2"
        onClick={handlePayment}
      >
        Proceed To Payment
      </button>
      {showToast && (
        <div className="absolute left-[30%] top-0 h-auto w-full">
          <Toast
            message={toastMessage}
            showToast={showToast}
            setShowToast={setShowToast}
          />
        </div>
      )} */}
      </main>
      {openLoginModal && (
        <LoginDropdown
          handleSuccessfulLogin={handleSuccessfulLogin}
          handleCreateAcc={handleCreateAcc}
        />
      )}
    </>
  )
}
export default CheckoutPage

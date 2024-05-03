import ProgressiveImageComp from '@/reuseComps/ProgressiveImageComp'
import Spinner from '@/reuseComps/Spinner'
import Toast from '@/reuseComps/ToastMessage'
import { couponCodeUrl } from '@/utils/urls'
import { priceFormatter } from '@/utils/formatPrice'
import { useState } from 'react'

function CheckoutItems({ basketData, setAddOrRemovePromo, addOrRemovePromo }) {
  const [promoToast, setPromoToast] = useState(false)
  const [promoToastMsg, setPromoToastMsg] = useState('')
  const [addingPromo, setAddingPromo] = useState(false)
  const [removingPromo, setRemovingPromo] = useState(false)
  const initialCoupon = basketData?.coupons?.length
    ? basketData?.coupons[0]?.code
    : ''
  const [coupon, setCoupon] = useState(initialCoupon)
  const cartItems = basketData?.items
  const price = basketData?.totals?.total_items
  const deliveryValue = basketData?.totals?.total_shipping
  const deliveryFormatVal =
    deliveryValue && priceFormatter(basketData?.totals?.total_shipping, true)
  const imgSrc =
    'https://oakleigh.cda-development3.co.uk/cms/wp-content/uploads/2024/01/1x1-4158.jpg'
  const subTotal =
    price && priceFormatter(basketData?.totals?.total_items, true)
  const totalPrice = basketData?.totals?.total_price
  const orderTotal =
    totalPrice && priceFormatter(basketData?.totals?.total_price, true)
  const isCouponAvailable = basketData?.coupons?.length
  const couponDiscount = basketData?.coupons?.length
    ? basketData?.coupons[0]?.totals?.total_discount
    : '0'

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
          setPromoToastMsg('Please enter a valid Coupon code')
          return
        }
      }
    } catch (error) { }
  }

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

  const handleChange = (e) => {
    e.preventDefault()
    const { value } = e?.target
    setCoupon(value)
  }

  return (
    <section className="flex h-auto w-full flex-col gap-5 p-5 font-sans sm:p-8 lg:p-8 dxl:pl-[75px] dxl:pr-[120px]">
      <section className="flex h-auto w-full flex-col gap-3">
        {cartItems?.map((e, index) => {
          return (
            <section key={index} className="flex items-center justify-between">
              <section className="flex h-auto w-full items-center gap-2 sm:gap-4 lg:gap-2 dxl:gap-5">
                <figure
                  // key={index}
                  className="aspect-[3/4] max-h-[100px] min-w-[80px] max-w-[80px] xl:max-w-[138px] dxl:max-h-[135px] dxl:min-w-[113px]"
                >
                  <ProgressiveImageComp
                    src={e?.images[1]?.src}
                    alt={'productImage'}
                  />
                </figure>
                <p className="font-cormorant text-display-1 leading-normal sm:text-display-4 dxl:text-display-9">
                  {e?.name}
                </p>
              </section>
              <section className="text-display-extra dxl:text-display-16">
                {priceFormatter(e?.prices?.price, true)}
              </section>
            </section>
          )
        })}
      </section>
      <section>
        <form className="flex h-auto w-full gap-5" onSubmit={handleSubmit}>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={coupon}
            onChange={handleChange}
            placeholder="Enter Code"
            className="h-[41px] w-full flex-1 appearance-none border bg-textPrimary px-4 py-2 font-sans text-display-3 text-footerBg focus:border-none focus:outline-none focus:ring-0 sm:px-7 dxl:h-[53px] dxl:text-display-6"
          />
          <div className="relative flex h-[41px] w-[110px] cursor-pointer font-sans text-display-4 dxl:h-[53px] dxl:w-[150px] dxl:text-display-17">
            <div className="absolute bottom-0 h-[38px] w-[107px] border-[0.5px] border-textSecondary dxl:h-[50px] dxl:w-[147px]"></div>
            <div className="absolute right-0 h-[38px] w-[107px] border-[0.5px] border-textSecondary dxl:h-[50px] dxl:w-[147px]"></div>
            <button
              type="submit"
              className="relative flex w-full items-center justify-center"
            >
              Apply
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
      <section className="flex flex-col gap-3">
        <section className="flex items-center justify-between text-display-5 leading-tight dxl:text-display-16">
          <p>
            {/* Subtotal ({productData?.items?.length} {itemText}) */}
            Subtotal ({cartItems?.length} Item)
          </p>
          {/* <p>{price}.00</p> */}
          <p>{subTotal}</p>
        </section>
        <section className="flex items-center justify-between text-display-3 leading-tight dxl:text-display-6">
          <p>Promotion Code</p>
          <section
            className="flex items-center gap-2 text-display-1 leading-tight"
            onClick={handleRemoveCoupon}
          >
            {isCouponAvailable ? (
              <p className="cursor-pointer">
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
          {/* <p>£{deliveryRate}.00</p> */}
          {deliveryFormatVal ? (
            deliveryFormatVal
          ) : (
            <p>Calculated at next step</p>
          )}
        </section>
        <section className="flex h-auto w-full items-center justify-between font-sans text-display-16 leading-tight dxl:text-display-10">
          <p>Order Total</p>
          {/* <p>{totalPrice}.00</p> */}
          <p>{orderTotal}</p>
        </section>
      </section>
    </section>
  )
}
export default CheckoutItems

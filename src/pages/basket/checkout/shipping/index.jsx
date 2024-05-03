import { useEffect, useState } from 'react'
import ProgressiveImageComp from '@/reuseComps/ProgressiveImageComp'
import Breadcrumbs from '@/components/BreadCrumbs'
import { getCartUrl } from '@/utils/urls'
import CheckoutItems from '@/components/CheckOut/CheckoutItems'
import ShippingPage from '@/components/CheckOut/ShippingPage'
import CheckBox from '@/reuseComps/CheckBox'
import Link from 'next/link'

function Shipping() {
  const [basketData, setBasketData] = useState([])
  const [addOrRemovePromo, setAddOrRemovePromo] = useState(false)
  const oakleighLogo = '/Images/oakleighLogo.svg'
  const leftIcon = '/Images/leftArrow.svg'

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
      <figure
        className="max-h-[34px] max-w-[180px] dxl:min-h-[60px] dxl:min-w-[304px]"
        onClick={() => {
          router.push('/')
        }}
      >
        <ProgressiveImageComp src={oakleighLogo} alt={'oakleighlogo'} />
      </figure>
      <section>
        <Breadcrumbs />
      </section>
      <section className="flex h-auto w-full flex-col gap-8 lg:flex-row lg:justify-between lg:gap-10 xl:gap-16">
        <section className="self-stretch bg-search lg:order-2 lg:flex-1">
          <CheckoutItems
            basketData={basketData}
            addOrRemovePromo={addOrRemovePromo}
            setAddOrRemovePromo={setAddOrRemovePromo}
          />
        </section>
        <section className="flex flex-col gap-4 lg:flex-1 lg:pb-64 dxl:gap-[50px]">
          <ShippingPage basketData={basketData} isFromShipping />
          <section className="flex w-full flex-col gap-4 font-sans dxl:gap-[25px]">
            <p className="font-cormorant text-display-11 dxl:text-display-12">
              Shipping Method
            </p>
            <section className="flex items-start justify-between">
              <section className="flex items-start gap-[6px] dxl:gap-4">
                <section className="mt-[2px] flex-1">
                  {' '}
                  <CheckBox />
                </section>
                <p className="text-display-3 leading-4 dxl:mt-1 dxl:text-display-6 dxl:leading-4">
                  Royal Mail or other 24 hour courier (1–2 working days)
                </p>
              </section>
              <p className="text-display-5 leading-3 dxl:text-display-16">
                Free
              </p>
            </section>
            <section className="flex h-auto w-full items-center justify-between dxl:mt-[5px]">
              <section className="flex flex-1 items-center justify-start gap-1">
                <section className="h-3 w-3 dxl:mt-[3px] dxl:h-4 dxl:w-4">
                  <ProgressiveImageComp src={leftIcon} alt="left" />
                </section>
                <Link href={'/basket/checkout'}>
                  <p className="font-sans text-display-4 leading-4 dxl:text-display-17">
                    <u>Return To Contact Information</u>
                  </p>
                </Link>
              </section>
              <Link
                href={'/basket/checkout/shipping/payment'}
                className="relative mt-1 flex h-[42px] w-full flex-1 font-sans lg:max-w-[180px] dxl:h-[53px] dxl:max-w-[279px]"
              >
                <section className="relative mt-1 flex h-[42px] w-full flex-1 font-sans lg:max-w-[180px] dxl:h-[53px] dxl:max-w-[279px]">
                  <div className="absolute bottom-0 h-[39px] w-[98.5%] border-[0.8px] border-textSecondary bg-textSecondary sm:w-[99%] dxl:h-[50px]" />
                  <div className="absolute right-0 h-[39px] w-[98.5%] border-[0.8px] border-textSecondary sm:w-[99%] dxl:h-[50px]" />
                  <div className="absolute bottom-[3px] left-[1.5%] right-[1.5%] h-[36px] w-[97%] border-b-[0.5px] border-l-[0.5px] border-textPrimary sm:left-[1%] sm:right-[1%] sm:w-[98%] dxl:h-[47px]" />
                  <div className="relative flex w-full items-center justify-center text-display-1 text-textPrimary sm:text-display-4 dxl:text-display-17">
                    Continue To Payment
                  </div>
                </section>
              </Link>
            </section>
          </section>
        </section>
      </section>
    </main>
  )
}
export default Shipping

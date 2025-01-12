import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import AccountInfoBlock from '../AccountInfoBlock'
import MyOrders from '../MyOrders'
import MyAlerts from '../MyAlerts'
import BecomeVip from '../BecomeVip'
import ProgressiveImageComp from '@/reuseComps/ProgressiveImageComp'

function SummaryBlock({ handleLogout }) {
  const itemList = [
    'Account Information',
    'My Orders',
    'My Alerts',
    'Become a VIP',
    'Log Out',
  ]
  const leftIcon = '/Images/leftArrow.svg'
  const isDesktop = useMediaQuery({ query: '(min-width:900px)' })
  const [isItemClicked, setIsItemClicked] = useState(
    isDesktop ? 'Account Information' : '',
  )

  const handleItemClick = (item) => {
    setIsItemClicked(item)
  }

  const getBlock = () => {
    switch (isItemClicked) {
      case 'Account Information':
        return <AccountInfoBlock />
      case 'My Orders':
        return <MyOrders />
      case 'My Alerts':
        return <MyAlerts />
      case 'Become a VIP':
        return <BecomeVip />
    }
  }

  return (
    <section className="h-auto w-full px-9 lg:px-20 dxl:px-[140px]">
      {!isDesktop ? (
        <>
          {!isItemClicked && (
            <section className=" bg-search p-[30px] font-sans">
              {itemList.map((e, index) => {
                return (
                  <section
                    key={index}
                    className="border-y-[1px] border-orderSummaryBorder p-5 text-display-5 leading-none"
                    onClick={() => {
                      handleItemClick(e)
                    }}
                  >
                    {e !== 'Log Out' && <p>{e}</p>}
                    {e === 'Log Out' && (
                      <u>
                        <p className="text-display-4 leading-none">{e}</p>
                      </u>
                    )}
                  </section>
                )
              })}
            </section>
          )}
          {isItemClicked && (
            <section>
              <section
                className="mb-[30px] flex flex-1 items-center justify-start gap-1"
                onClick={() => {
                  setIsItemClicked('')
                }}
              >
                <section className="h-3 w-3 dxl:mt-[3px] dxl:h-4 dxl:w-4">
                  <ProgressiveImageComp src={leftIcon} alt="left" />
                </section>
                <p className="font-sans text-display-4 leading-4 dxl:text-display-17">
                  <u>Back To Account Home</u>
                </p>
              </section>
              {getBlock()}
            </section>
          )}
        </>
      ) : (
        <section className="flex h-auto w-full gap-4 xl:gap-6">
          <section className="max-h-[336px] min-w-[296px] bg-search p-[30px] font-sans dxl:max-h-[494px] dxl:min-w-[474px]">
            {itemList.map((e, index) => {
              return (
                <section
                  key={index}
                  className={`border-y-[1px] ${
                    e === isItemClicked ? 'bg-textPrimary' : 'bg-none'
                  } cursor-pointer border-orderSummaryBorder p-5 text-display-5 leading-none dxl:p-7 dxl:text-display-16`}
                  onClick={() => {
                    handleItemClick(e)
                  }}
                >
                  {e !== 'Log Out' && <p>{e}</p>}
                  {e === 'Log Out' && (
                    <u>
                      <p
                        className="text-display-4 leading-none"
                        onClick={handleLogout}
                      >
                        {e}
                      </p>
                    </u>
                  )}
                </section>
              )
            })}
          </section>
          <section className="h-auto w-full">{getBlock()}</section>
        </section>
      )}
    </section>
  )
}
export default SummaryBlock

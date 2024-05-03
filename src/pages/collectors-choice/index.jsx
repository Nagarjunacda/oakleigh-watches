import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import axios from 'axios'
import { shopAllUrl } from '@/utils/urls'
import { useMediaQuery } from 'react-responsive'
import { collectorsChoiceUrl } from '@/utils/urls'
import Filters from '@/reuseComps/Filters'
import FiltersMweb from '@/reuseComps/FiltersMweb'

const ProductListing = ({ data }) => {
  const router = useRouter()
  //   const [clientData, setClientData] = useState(data)
  //   const [page, setPage] = useState(2)
  //   const [loading, setLoading] = useState(false)
  const isDesktop = useMediaQuery({ query: '(min-width:900px)' })
  //   const loadButton = loading ? 'Loading Data...' : 'Load More Watches'

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setPage((prevPage) => prevPage + 1)
  //     setLoading(true)
  //     try {
  //       const username = 'ck_96e01d53953b1372491dc07807ed0f0bd896d3a3'
  //       const password = 'cs_e6dc67bafbc6907125843f189e2c377eb1a40606'
  //       const response = await axios.get(
  //         `${shopAllUrl}?page=${page}`,
  //         {
  //           headers: {
  //             'Content-Type': 'text/plain',
  //             Authorization: 'Basic ' + btoa(username + ':' + password),
  //           },
  //         },
  //       )
  //       const newData = response.data

  //       // Assuming the API response has a property called 'items' containing the data
  //       setClientData((prevData) => [...prevData, ...newData])
  //     } catch (error) {
  //       console.error('Error fetching data:', error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  // }, [page])

  const handleProductClick = (item) => {
    router.push(`product/${item.slug}/${item.id}`)
  }

  //   const handleLoadMore = () => {
  //     fetchData()
  //   }

  return (
    <div className="flex w-full flex-col text-footerBg">
      <div className="flex w-full flex-col items-start justify-center gap-6 p-[32px] lg:flex-row xl:gap-[48px] xl:p-[60px] dxl:p-[100px] txl:gap-[98px] txl:p-[140px]">
        {isDesktop ? <Filters /> : <FiltersMweb />}
        <div className="h-auto w-full flex-col items-center justify-center">
          <div className="grid h-auto w-full grid-cols-1 items-center gap-[18px] gap-y-[50px] lg:grid-cols-3 txl:gap-[50px]">
            {data?.map((item, index) => (
              <div
                key={index}
                className="flex grow-[1] flex-col items-center justify-center"
              >
                <div
                  className="relative h-[420px] w-full lg:h-[298px] lg:w-[195px] xl:h-[340px] xl:w-[260px] dxl:h-[400px] dxl:w-[320px] txl:h-[462px] txl:w-[389px]"
                  key={item.id}
                >
                  <Image
                    src={item.images[0]?.src}
                    layout="fill"
                    alt="AdBlock"
                    objectFit="cover"
                    quality={100}
                    style={{ objectPosition: 'center' }}
                  />
                </div>
                <div className="mt-6 flex flex-col items-center justify-center gap-[2px] xl:gap-1 dxl:gap-[6px] txl:gap-2">
                  <p className="line-clamp-1 max-w-[400px] text-display-4 xl:max-w-[260px] xl:text-display-17 dxl:max-w-[320px] txl:max-w-[389px] txl:text-display-12">
                    {item.name}
                  </p>
                  {/* <p>{item.stock_status}</p> */}
                  <p className="font-sans text-display-3 dxl:text-display-6">
                    2019, box and papers
                  </p>
                  <div className="font-sans text-display-5 xl:text-display-16 ">
                    {item?.prices?.currency_symbol}{' '}
                    {item?.prices?.regular_price}
                  </div>
                </div>
                <div className="relative flex h-[49px] w-[143px] xl:h-[53px] xl:w-[175px]">
                  <div className="absolute bottom-0 h-[46px] w-[140px] border-[0.5px] border-textSecondary xl:h-[50px] xl:w-[172px]"></div>
                  <div className="absolute right-0 h-[46px] w-[140px] border-[0.5px] border-textSecondary xl:h-[50px] xl:w-[172px]"></div>
                  <div
                    onClick={() => {
                      handleProductClick(item)
                    }}
                    className="relative flex w-full cursor-pointer items-center justify-center font-sans text-display-4 xl:text-display-17"
                  >
                    View Watch
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* <button
            className="mt-[48px] w-full font-sans text-display-9"
            onClick={handleLoadMore}
            disabled={loading}
          >
            <u>{loadButton}</u>
          </button> */}
        </div>
      </div>
    </div>
  )
}
export default ProductListing

export async function getServerSideProps(context) {
  try {
    const username = 'ck_96e01d53953b1372491dc07807ed0f0bd896d3a3'
    const password = 'cs_e6dc67bafbc6907125843f189e2c377eb1a40606'
    const response = await fetch(collectorsChoiceUrl, {
      method: 'get',
      // credentials: 'include',
      headers: {
        'Content-Type': 'text/plain',
        //   Authorization: 'Basic ' + btoa(username + ':' + password),
      },
    })
    if (!response.ok) {
      // Handle non-successful responses (e.g., 404, 500)
      console.error(`API request failed with status ${response.status}`)
      return {
        notFound: true,
      }
    }
    const data = await response.json()
    return {
      props: {
        data,
      },
    }
  } catch (error) {
    // Handle network errors or other exceptions
    console.error('Error fetching data from API:', error)
    return {
      props: {
        data: null,
      },
    }
  }
}

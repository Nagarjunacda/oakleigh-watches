import React, { useRef } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Image from 'next/image'
import { useMediaQuery } from 'react-responsive'

const SimpleSlider = ({ trayData, navButtons, slidesToShow }) => {
  const sliderRef = useRef(null)
  const isDesktop = useMediaQuery({ query: '(min-width:900px)' })

  const settings = {
    dots: isDesktop ? false : true,
    infinite: true,
    speed: 500,
    slidesToShow: isDesktop ? slidesToShow : 1,
    slidesToScroll: 1,
  }

  return (
    <div
      className={`relative mx-auto w-full px-0 ${
        navButtons ? 'lg:px-16' : 'lg:px-0'
      }`}
    >
      <Slider ref={sliderRef} {...settings}>
        {trayData.map((e, index) => {
          return (
            <div
              key={index}
              className="flex h-auto w-full flex-col px-0 lg:px-1"
            >
              <div className="relative flex h-[400px] w-full flex-col items-center justify-between dxl:h-[526px]">
                <Image
                  src={e.url}
                  layout="fill"
                  alt="AdBlock"
                  objectFit="cover"
                  quality={100}
                  style={{ objectPosition: 'center' }}
                />
              </div>
              <div className="mt-[30px] flex w-full flex-col items-center justify-center gap-[30px] dxl:items-start">
                <p className="w-full text-center text-display-11  lg:line-clamp-1 dxl:text-start dxl:text-display-12">
                  {e.title}
                </p>
                {e.description && (
                  <p className="w-full text-center font-sans text-display-3 text-footerBg">
                    {e.description}
                  </p>
                )}
                {e.price && (
                  <p className="w-full text-center font-sans">£{e.price}</p>
                )}
                {e.buttonTitle && (
                  <div className="relative flex h-12 w-[142px] items-center justify-center border-[1px] border-black">
                    <button
                      type="submit"
                      className="absolute right-[2px] top-[2px] h-full w-full border-[1px] border-black font-sans text-[14px]"
                    >
                      {e.buttonTitle}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </Slider>
      {isDesktop && navButtons && (
        <button
          className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-[310%] transform items-center justify-center rounded-[50%] border-[1px] border-black p-2 text-black"
          onClick={() => sliderRef.current.slickPrev()}
        >
          <img className="h-4 w-4" src="/Images/leftArrow.svg" alt="prev" />
        </button>
      )}
      {isDesktop && navButtons && (
        <button
          className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-[310%] transform items-center justify-center rounded-[50%] border-[1px] border-black p-2 text-black"
          onClick={() => sliderRef.current.slickNext()}
        >
          <img className="h-4 w-4" src="/Images/rightArrow.svg" alt="next" />
        </button>
      )}
    </div>
  )
}

export default SimpleSlider

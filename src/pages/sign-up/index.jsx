import SignupForm from '../../components/LoginAndSignup/SignUpForm'
import Breadcrumbs from '@/components/BreadCrumbs'

function SignupPage() {
  return (
    <div className="flex h-auto w-full flex-col items-center justify-between gap-2 px-6 pt-4 text-footerBg sm:gap-4 sm:px-12 xl:gap-8 xl:px-[92px] xl:pt-[25px] dxl:gap-[58px] dxl:px-[141px]">
      <div className="w-full font-sans text-[10px] sm:text-display-1 xl:text-[15px]">
        <Breadcrumbs />
      </div>
      <div className="flex h-auto w-full flex-col items-center justify-between gap-3 sm:gap-4 xl:gap-7 dxl:gap-10">
        <div className="text-display-9 sm:text-display-12 xl:text-display-14 dxl:text-display-15">
          LOGIN OR CREATE AN ACCOUNT
        </div>
        <div className="w-full text-center font-sans text-display-1 xl:text-display-3 dxl:text-display-6">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
          ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
          sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
          dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
          et justo duo dolores et ea rebum.
        </div>
        <div className="flex w-full flex-col items-start justify-between gap-4 lg:flex-row xl:gap-8">
          <div className="order-1 flex w-auto max-w-[803px] flex-1 flex-col gap-3 bg-search p-5 xl:gap-7 xl:p-9 dxl:p-[50px]">
            <p className="text-display-17 sm:text-display-11 xl:text-display-12 dxl:text-display-13">
              New Customers
            </p>
            <p className="h-auto w-full font-sans sm:text-display-1 xl:text-display-3 dxl:text-display-6">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua
            </p>
            <SignupForm />
          </div>
          <div className="flex w-auto max-w-[803px] flex-1 flex-col gap-3 bg-search p-5 lg:order-1 xl:gap-7 xl:p-9 dxl:p-[50px]">
            <div className="text-display-17 sm:text-display-11 xl:text-display-12 dxl:text-display-13">
              Already Have An Account?
            </div>
            <p className="font-sans sm:text-display-1 xl:text-display-3 dxl:text-display-6">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua.
            </p>
            <div className="relative flex h-8 w-[120px] cursor-pointer font-sans text-display-1 sm:h-[40px] sm:w-[150px] sm:text-display-4 xl:h-[53px] xl:w-[220px] xl:text-display-17">
              <div className="absolute bottom-0 h-[29px] w-[117px] border-[0.5px] border-textSecondary sm:h-[37px] sm:w-[147px] xl:h-[50px] xl:w-[217px]"></div>
              <div className="absolute right-0 h-[29px] w-[117px] border-[0.5px] border-textSecondary sm:h-[37px] sm:w-[147px] xl:h-[50px] xl:w-[217px]"></div>
              <div className="relative flex w-full items-center justify-center">
                Login
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SignupPage

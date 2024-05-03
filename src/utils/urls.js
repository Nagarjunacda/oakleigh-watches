const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
// https://oakleigh.cda-development3.co.uk/cms/wp-json

export const nonceUrl = `${baseUrl}/wp/v2/wc-nonce`;
export const loginTokenUrl = `${baseUrl}/wp/v2/wc-nonce`;
export const trayDataUrl = `${baseUrl}/wp/v2/pages/55?acf_format=standard`;
export const headerUrl = `${baseUrl}/wp/v2/menu-items?menus=18`;
export const footerUrl = `${baseUrl}/wp/v2/menu-items?menus=108`;
export const shopAllUrl = `${baseUrl}/wc/v3/products`;
export const newInUrl = `${baseUrl}/wc/store/v1/products?category=122`;
export const collectorsChoiceUrl = `${baseUrl}/wc/store/v1/products?category=123`;
export const vintageWatchesUrl = `${baseUrl}/wc/store/v1/products?category=124`;
export const onlineOnlyUrl = `${baseUrl}/wc/store/v1/products?category=125`;
export const couponCodeUrl = `${baseUrl}/wc/store/v1/cart/coupons`;
export const updateCusUrl = `${baseUrl}/wc/store/v1/cart/update-customer`;
export const signupUrl = `${baseUrl}/wp/v2/users`;
export const loginPostUrl = `${baseUrl}/jwt-auth/v1/token`;
export const getCartUrl = `${baseUrl}/wc/store/v1/cart`;
export const removeCartItemUrl = `${baseUrl}/wc/store/v1/cart/remove-item`;
export const checkoutUrl = `${baseUrl}/wc/store/v1/checkout`;
export const wpPaymentUpdateUrl = `${baseUrl}/custom/v1/trigger-ajax`;
export const addToCartUrl = `${baseUrl}/wc/store/v1/cart/add-item`;

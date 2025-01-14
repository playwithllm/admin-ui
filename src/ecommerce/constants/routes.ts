export const ECOMMERCE_BASE_PATH = '/ecommerce';

export const ECOMMERCE_ROUTES = {
  ROOT: ECOMMERCE_BASE_PATH,
  PRODUCTS: `${ECOMMERCE_BASE_PATH}/products`,
  PRODUCT_DETAIL: (id?: string) => `${ECOMMERCE_BASE_PATH}/products/${id || ':productId'}`,
  CART: `${ECOMMERCE_BASE_PATH}/cart`,
  CHECKOUT: `${ECOMMERCE_BASE_PATH}/checkout`,
  PROFILE: `${ECOMMERCE_BASE_PATH}/profile`,
  ORDER_HISTORY: `${ECOMMERCE_BASE_PATH}/order-history`,
  LOGIN: `/login`,
} as const; 

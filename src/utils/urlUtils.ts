const BASE_URL = "http://localhost:5001";
const IMAGES_BASE_URL = "http://localhost:5001/uploads";

const LOGIN_URL = BASE_URL + "/auth/login";
const REGISTER_URL = BASE_URL + "/auth/register";

const PRODUCTS_URL = BASE_URL + "/products";

const CART_URL = BASE_URL + "/cart";

const STORE_LOCATIONS_URL = BASE_URL + "/stores"; // Fetch store locations
const PLACE_ORDER_URL = BASE_URL + "/orders"; // Place an order
const ORDERS_URL = `${BASE_URL}/orders`; // For placing and fetching orders

// URL for getting the status of a specific order
const ORDER_STATUS_URL = `${BASE_URL}/orders/status`; // Use /status/:confirmation_number

const STATS_URL = ORDERS_URL + "/stats";

// URL for cancelling an order
const ORDER_CANCEL_URL = `${BASE_URL}/orders`;

const REVIEWS_URL = BASE_URL + "/review"
const FILTER_PRODUCTS_URL = PRODUCTS_URL + "/trending";

export {
  BASE_URL,
  LOGIN_URL,
  REGISTER_URL,
  PRODUCTS_URL,
  IMAGES_BASE_URL,
  CART_URL,
  STORE_LOCATIONS_URL,
  PLACE_ORDER_URL,
  ORDERS_URL,
  ORDER_STATUS_URL,
  ORDER_CANCEL_URL,
  REVIEWS_URL,
  FILTER_PRODUCTS_URL,
  STATS_URL
};

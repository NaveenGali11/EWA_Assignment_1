const BASE_URL = "http://localhost:5001";
const IMAGES_BASE_URL = "http://localhost:5001/uploads";

const LOGIN_URL = BASE_URL + "/auth/login";
const REGISTER_URL = BASE_URL + "/auth/register";

const PRODUCTS_URL = BASE_URL + "/products";

const INVENTORY_URL = PRODUCTS_URL + "/inventoryreport";

const CART_URL = BASE_URL + "/cart";

const STORE_LOCATIONS_URL = BASE_URL + "/stores"; // Fetch store locations
const PLACE_ORDER_URL = BASE_URL + "/orders"; // Place an order
const ORDERS_URL = `${BASE_URL}/orders`; // For placing and fetching orders

const SALES_REPORT_URL = ORDERS_URL + "/salesreport";

// URL for getting the status of a specific order
const ORDER_STATUS_URL = `${BASE_URL}/orders/status`; // Use /status/:confirmation_number

const STATS_URL = ORDERS_URL + "/stats";

// URL for cancelling an order
const ORDER_CANCEL_URL = `${BASE_URL}/orders`;

const REVIEWS_URL = BASE_URL + "/review";
const FILTER_PRODUCTS_URL = PRODUCTS_URL + "/trending";

const PROCESS_REVIEWS = REVIEWS_URL + "/processReviews";

const SEARCH_REVIEWS = REVIEWS_URL + "/searchReviews";

const AUTOCOMPLETE_PRODUCTS_URL = PRODUCTS_URL + "/autocomplete";

const CUSTOMER_SERVICE_URL = BASE_URL + "/tickets";

const GENERATE_NEW_DESCRIPTIONS = PRODUCTS_URL + "/generateNewDescriptions";

const RECOMMEND_PRODUCTS = PRODUCTS_URL + "/recommendproducts";

export {
  AUTOCOMPLETE_PRODUCTS_URL,
  BASE_URL,
  CART_URL,
  CUSTOMER_SERVICE_URL,
  FILTER_PRODUCTS_URL,
  GENERATE_NEW_DESCRIPTIONS,
  IMAGES_BASE_URL,
  INVENTORY_URL,
  LOGIN_URL,
  ORDERS_URL,
  ORDER_CANCEL_URL,
  ORDER_STATUS_URL,
  PLACE_ORDER_URL,
  PROCESS_REVIEWS,
  PRODUCTS_URL,
  RECOMMEND_PRODUCTS,
  REGISTER_URL,
  REVIEWS_URL,
  SALES_REPORT_URL,
  SEARCH_REVIEWS,
  STATS_URL,
  STORE_LOCATIONS_URL,
};

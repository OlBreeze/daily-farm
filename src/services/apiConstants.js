export const BASE_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const API_ROUTES = {
    REGISTER: `${BASE_API}/account/register`,
    LOGIN: `${BASE_API}/login`,
    LOGOUT: `${BASE_API}/logout`,
    REFRESH:`${BASE_API}/refresh`,
    AUTH_CHECK:`${BASE_API}/auth/check`,

    // 🔹 Products
    GET_ALL_PRODUCTS: `${BASE_API}/products`,
    GET_PRODUCT_ID:`${BASE_API}/products/id/`,
    ADD_PRODUCT:`${BASE_API}/products/add`,
    UPDATE_PRODUCT:`${BASE_API}/products/update/`,
    REMOVE_PRODUCT:`${BASE_API}/products/remove/`,
    GET_ALL_UNITS:`${BASE_API}/units`,
    GET_ALL_CATEGORIES:`${BASE_API}/categories`,

    // 🔹 Orders
    GET_ALL_ORDERS: `${BASE_API}/orders`,
    ADD_ORDER: `${BASE_API}/orders/add`,
    GET_ORDER_ID: `${BASE_API}/orders/id/`,
    UPDATE_ORDER: `${BASE_API}/orders/update/`,
    REMOVE_ORDER :`${BASE_API}/orders/remove/`,

    // **
    // String GET_ALL_ORDERS 	= "/orders";
    // String GET_ORDERS_USER 	= "/orders/user/{userId}";
    // String REMOVE_PRODUCT_FROM_ORDER 		= "/orders/remove_product/order/{orderId}/product/{productId}";
    //
    //...

};
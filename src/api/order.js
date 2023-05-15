
import { get, post } from "../utils/request";

export const createOrder = params => post('/h5/house/order/create', params)
export const orderDetail = params => get('/h5/house/order/detail', params)
export const orderList = params => get('/h5/house/order/list', params)
export const payment = params => post('/h5/house/order/payment', params)




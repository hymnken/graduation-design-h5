import { get, post } from "../utils/request";

export const houseList = params => get('/h5/house/list', params)
export const houseDetail = params => get('/h5/house/detail', params)







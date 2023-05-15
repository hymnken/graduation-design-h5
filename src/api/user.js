import { get, post } from "../utils/request";
export const login = params => post('/h5/login', params)
export const register = params => post('/h5/register', params)
export const logout = params => get('/h5/logout', params)
export const modify = params => post('/h5/user/modify', params)
export const message = params => post('/h5/user/message', params)
export const messageList = params => get('/h5/user/message/list', params)
export const messageDetail = params => get('/h5/user/message/detail', params)
export const matchMobile = params => post('/h5/forgot/mobile', params)
export const matchSecret = params => post('/h5/forgot/secret/check', params)
export const resetPassword = params => post('/h5/forgot/reset', params)






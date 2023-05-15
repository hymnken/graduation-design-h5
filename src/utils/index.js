import { showToast } from "vant";
import config from "@/config/index"
export const assetsUrl = src => {
    return new URL(`/src/assets/` + src, import.meta.url).href
}
export const getToken = () => {
    return localStorage.getItem(config.userTokenKey || 'token') || ''
}

export const uuid = () => {
    return Math.random().toString(36).substr(-8)
}
export const toast = {
    success: (message) => {
        return showToast({
            type: 'success',
            icon: 'success',
            message
        })
    },
    error: (message) => {
        return showToast({
            type: 'fail',
            icon: 'cross',
            message
        })
    },
    info: (message) => {
        return showToast({
            type: 'fail',
            icon: 'fail',
            message
        })
    },
}

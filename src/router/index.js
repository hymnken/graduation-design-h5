
import { createRouter, createWebHistory } from "vue-router"
import store from '../store'
import staticRoutes from "./routes"
import layout from "./../layouts/index.vue"
import config from "../config"
const routes = [
    {
        path: '/',
        name: 'root',
        component: layout,
        redirect: "home",
        children: staticRoutes
    },
    {
        path: '/order/:id',
        name: 'orderDetail',
        component: () => import('@/views/order/detail.vue'),
        meta: {
            title: '订单详情'
        },
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',
            auth: false
        },
        component: () => import('@/views/login.vue')
    },
    {
        path: '/register',
        name: 'register',
        meta: {
            title: '注册',
            auth: false
        },
        component: () => import('@/views/register.vue')
    },
    {
        path: '/forgot',
        name: 'forgot',
        meta: {
            title: '忘记密码',
            auth: false
        },
        component: () => import('@/views/forgot.vue')
    },
    {
        path: '/user/modify',
        name: 'userModify',
        meta: {
            title: '更改资料',
        },
        component: () => import('@/views/user/modify.vue')
    },
    {
        path: '/message',
        name: 'message',
        meta: {
            title: '在线留言',
        },
        component: () => import('@/views/message/index.vue')
    },
    {
        path: '/house/:id',
        name: 'house',
        meta: {
            title: '房屋',
        },
        component: () => import('@/views/house/index.vue')
    },
    {
        path: '/message/:id',
        name: 'messageDetail',
        meta: {
            title: '留言详情',
        },
        component: () => import('@/views/message/detail.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        meta: {
            title: '404',
            auth: false
        },
        component: () => import('@/views/404.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})


router.beforeEach((to, from, next) => {
    const { title } = to.meta
    const notNeedLogin = to.meta.auth === false
    document.title = [config.siteName, title].join(' - ')
    const userInfo = store.getters['user/userInfo']
    const isLogin = userInfo && userInfo.id

    if (notNeedLogin) {
        // 不需要登录的页面
        // 已经登录的的情况下 不允许 访问 登录/忘记密码/注册
        const needClear = to.name === 'login' || to.name === 'forgot' || to.name === 'register'
        if (needClear) {
            // 到登录页 先清除旧的 用户信息
            store.dispatch('user/clearUserInfo')
        }
        next()
    } else {
        if (!isLogin) {
            next({ name: 'login' })
        } else {
            next()
        }
    }
})

export default router
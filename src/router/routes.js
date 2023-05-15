export default [
    {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
            title: '首页'
        },
    },
    {
        path: 'reserve',
        name: 'reserve',
        component: () => import('@/views/reserve/index.vue'),
        meta: {
            title: '预定'
        },
    },
    {
        path: 'order',
        name: 'order',
        component: () => import('@/views/order/index.vue'),
        meta: {
            title: '我的订单'
        },
        children: [

        ]
    },
    {
        path: 'user',
        name: 'user',
        component: () => import('@/views/user/index.vue'),
        meta: {
            title: '个人中心'
        },
        children: [

        ]
    },
]
const config = {
    baseUrl: import.meta.env.VITE_SERVER_CLIENT_HOST,
    siteName: '民宿预定',
    secretColumns: [
        '你毕业于哪个初中？',
        '你最喜欢看的电影？',
        '你的生日是多久？',
        '对您影响最大的人名字是？',
    ],
    userInfoCacheKey: 'h5-userinfo',
    userTokenKey: 'h5-token'
}

export default config
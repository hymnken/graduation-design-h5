<template>
  <div class="layout">
    <van-config-provider :theme-vars="themeVars">
      <router-view />
      <van-tabbar route placeholder>
        <van-tabbar-item replace to="/home" icon="wap-home-o">首页</van-tabbar-item>
        <van-tabbar-item replace to="/reserve" icon="underway-o">预定</van-tabbar-item>
        <van-tabbar-item replace to="/order" icon="hotel-o">订单</van-tabbar-item>
        <van-tabbar-item replace to="/user" icon="user-o">我的</van-tabbar-item>
      </van-tabbar>
    </van-config-provider>
  </div>
</template>

<script setup>
import { reactive } from "vue";
const themeVars = reactive({});
</script>

<style lang="scss" scoped>
</style>
<template>
  <div>
    <div>
      <van-nav-bar title="我的订单" />
    </div>
    <van-tabs @click-tab="onClickTab">
      <van-tab title="全部订单"></van-tab>
      <van-tab title="近期订单"></van-tab>
      <van-tab title="待支付"></van-tab>
    </van-tabs>
    <!-- 列表 -->
    <div class="order-list">
      <van-empty
        v-if="!list.length"
        :image="assetsUrl(`img/empty.png`)"
        image-size="180"
        description="暂无数据"
      />
      <div class="item">
        <orderItem style="margin-bottom:20px" v-for="order in list" :info="order" :key="order.id" />
      </div>
    </div>
  </div>
</template>

<script setup>
import orderItem from "@/components/order-item.vue";
import { assetsUrl } from "@/utils/index";
import { useRouter, useRoute } from "vue-router";
import { orderList } from "@/api/order";
import { ref } from "vue";
const router = useRouter();
const list = ref([]);

const queryList = (type = 1) => {
  orderList({ type }).then((res) => {
    list.value = res || [];
  });
};
queryList();
const onClickTab = (e) => {
  queryList(e.name);
};
</script>

<style lang="scss" scoped>
.item {
  // background-color: #fff;
  margin: 10px 0;
  // padding: 10px 20px;
  padding: 10px;
  background-color: #f5f7f9;
  border-radius: 5px;
  overflow: hidden;
}
</style>
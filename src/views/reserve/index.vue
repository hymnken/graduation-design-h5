<template>
  <div class="container">
    <van-sticky>
      <div class="row">
        <van-search v-model="keyword" @search="onSearch" placeholder="请输入搜索关键词" />
      </div>
      <div class="row">
        <van-dropdown-menu>
          <van-dropdown-item @change="handleTypeChange" v-model="value1" :options="option1" />
          <van-dropdown-item @change="handleResetChange" v-model="value2" :options="option2" />
        </van-dropdown-menu>
      </div>
    </van-sticky>
    <div class="row margin-top padding" v-if="list.length">
      <houseCard class="margin-b" v-for="item in list" :key="item.id" :info="item" />
    </div>
    <div class="row margin-top padding" v-else>
      <van-empty
        v-if="!list.length"
        :image="assetsUrl(`img/empty.png`)"
        image-size="180"
        description="暂无数据"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import houseCard from "@/components/house-card.vue";
import { houseList } from "@/api/house";
import { assetsUrl } from "@/utils/index";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const { house_type } = route.query;
const list = ref([]);
const value1 = ref("");
const value2 = ref("");
const keyword = ref("");
const option1 = [
  { text: "全部类型", value: "" },
  { text: "新房特惠", value: "新房特惠" },
  { text: "品牌民宿", value: "品牌民宿" },
  { text: "整套出租", value: "整套出租" },
  { text: "做饭方便", value: "做饭方便" },
  { text: "LOFT", value: "LOFT" },
  { text: "客栈", value: "客栈" },
  { text: "别墅", value: "别墅" },
];
const option2 = [
  { text: "默认排序", value: "" },
  { text: "还有余房", value: "1" },
];

const queryParams = reactive({
  page: 1,
  limit: 10,
  enable: true,
  house_type: "",
});
if (house_type) {
  value1.value = house_type;
  queryParams.house_type = house_type;
}
const queryList = () => {
  houseList({
    ...queryParams,
    reset: value2.value,
    keyword: keyword.value,
  }).then((res) => {
    list.value = res.rows || [];
  });
};
queryList();
const handleTypeChange = (e) => {
  queryParams.house_type = e;
  queryList();
};
const handleResetChange = (e) => {
  queryList();
};
const onSearch = () => {
  queryList();
};
</script>

<style lang="scss" scoped>
.xx {
}
</style>
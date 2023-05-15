<template>
  <div class="house-card" @click="handleClick">
    <div class="house-pic">
      <van-swipe @change="handleSwiperChange" class="swiper-row" :show-indicators="false">
        <van-swipe-item v-for="(item) in info.house_images" :key="item.src">
          <img class="house-image" :src="item.src" alt />
        </van-swipe-item>
      </van-swipe>
      <div class="dot">{{activeImageIndex + 1}}/{{info.house_images.length}}</div>
    </div>
    <div class="flex">
      <div class="address">{{info.street}}</div>
      <div class="flex tag">2居·3床·1人</div>
    </div>
    <div class="title">
      <span style="color:red" v-if="info.surplus_rooms <= 0">【已售罄】</span>
      {{info.fullname}}
    </div>
    <div class="flex">
      <div class="price text-primary bold">￥{{(info.price / 100).toFixed(2)}}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps } from "vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const props = defineProps({
  info: {
    type: Object,
    default: () => {},
  },
});
const activeImageIndex = ref(0);
const images = reactive([
  "https://pic.tujia.com/upload/landlordunit/day_220812/thumb/202208121504518657_1050_701.jpg",
  "https://pic.tujia.com/upload/landlordunit/day_220812/thumb/202208121503097320_700_467.jpg",
  "https://pic.tujia.com/upload/landlordunit/day_220812/thumb/202208121504517690_700_467.jpg",
]);
const handleSwiperChange = (index) => {
  activeImageIndex.value = index;
};
const handleClick = () => {
  router.push("/house/" + props.info.id);
};
</script>

<style lang="scss" scoped>
.house-card {
  .swiper-row {
    border-radius: 8px;
    overflow: hidden;
  }
  .house-image {
    height: 220px;
    width: 100%;
    object-fit: cover;
  }
  .address {
    background: #3f4954;
    display: inline-block;
    border-radius: 2px;
    font-size: 11px;
    color: #fff;
    line-height: 14px;
    padding: 1px 2px;
    box-sizing: content-box;
  }
  .title {
    line-height: 22px;
    font-size: 18px;
    margin-top: 8px;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-weight: 500;
  }
  .tag {
    font-size: 12px;
    margin-left: 10px;
    color: #666;
  }
  .house-pic {
    position: relative;
    .dot {
      position: absolute;
      right: 10px;
      bottom: 10px;
      background: rgba(0, 0, 0, 0.3);
      -webkit-box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
      -webkit-border-radius: 10px;
      border-radius: 10px;
      font-family: PingFangSC-Medium;
      font-size: 11px;
      color: #fff;
      letter-spacing: -0.5px;
      line-height: 18px;
      padding: 0 8px;
    }
  }
}
</style>
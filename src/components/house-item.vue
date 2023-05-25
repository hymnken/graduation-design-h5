<template>
  <div class="house-item" @click="handleItemClick" :class="{ none: info.surplus_rooms <= 0 }">
    <img class="none" v-if="info.surplus_rooms <= 0" src="../assets/img/none.png" alt />
    <img :src="info.cover" alt />
    <div class="info text-white">
      <div class="info-top"></div>
      <div class="info-bottom">
        <div class="house-score flex flex-between">
          <div class="stars flex">
            <!-- <van-icon name="star-o" color="#fff" v-for="i in 5" :key="i" /> -->
          </div>
          <div class="price">￥{{ info.price }}</div>
        </div>
        <div class="house-intro text-ellipsis-2">{{ info.fullname }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
  info: {
    type: Object,
    default: () => {},
  },
})
const handleItemClick = (_) => {
  router.push('/house/' + props.info.id)
}
</script>

<style lang="scss" scoped>
.house-item {
  position: relative;
  height: 240px;
  border-radius: 6px;
  overflow: hidden;
  &.none {
    -webkit-filter: grayscale(20%); /* Chrome, Safari, Opera */
    filter: grayscale(20%);
  }
  .none {
    position: absolute;
    width: 60px;
    height: 60px;
    left: 50%;
    opacity: 0.5;
    top: 50%;
    background-color: #000;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
  img {
    width: 100%;
    height: 240px;
    object-fit: cover;
  }
  .info {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
    box-sizing: border-box;
  }
  .house-intro {
    font-size: 14px;
    color: #fff;
  }
}
</style>

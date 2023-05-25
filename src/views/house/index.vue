<template>
  <div>
    <van-nav-bar @click-left="handleLeftClick" title="房屋详情" left-text="返回" left-arrow></van-nav-bar>
    <div v-if="imageList.length > 0">
      <van-swipe class="swiper-row">
        <van-swipe-item v-for="item in imageList" :key="item">
          <img class="house-image" :src="item" alt />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div v-else>
      <img :src="houseData.cover" class="house-image" alt />
    </div>
    <div class="title">{{ houseData.fullname }}</div>
    <div class="address">
      <van-icon name="location-o" />
      <span>{{ houseData.street }}</span>
    </div>

    <div class="address rooms mobile">
      <van-icon name="phone-o" />
      <span>{{ houseData.mobile }}</span>
    </div>
    <div class="address rooms">
      <div class="flex flex-around times">
        <div><b>04月02日</b>入住</div>
        <div><b>04月03日</b>离开</div>
      </div>
      <div class="flex flex-between">
        <div>
          <van-icon name="wap-home-o" />
          <span>
            共 {{ houseData.rooms }} 间房，剩余 <i class="bold">{{ houseData.surplus_rooms }}</i> 间
          </span>
        </div>
        <div class="flex" v-if="houseData.surplus_rooms > 0">
          <van-stepper
            :min="1"
            :max="houseData.surplus_rooms"
            v-model="houseNumber"
            theme="round"
            button-size="22"
            disable-input
          />
          <span style="margin-left: 10px; font-size: 16px" class="text-primary bold">￥{{ totalPrice }}</span>
        </div>
      </div>
    </div>
    <img class="none" v-if="houseData.surplus_rooms <= 0" src="../../assets/img/none.png" alt />
    <van-submit-bar
      :disabled="houseData.surplus_rooms <= 0"
      :price="totalPrice * 0.4 * 100"
      button-text="立即预定"
      @submit="handleCreateOrder"
    >
      <template #tip>预定房屋需要支付总金额40%的押金，余下金额在离开时结算</template>
    </van-submit-bar>
  </div>
</template>

<script setup>
import { houseDetail } from '@/api/house'
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { createOrder } from '@/api/order'
const router = useRouter()
const route = useRoute()
const houseId = Number(route.params.id)
const imageList = ref([])
const houseData = ref({})
const houseNumber = ref(1)
const totalPrice = computed(() => {
  if (houseData.value.surplus_rooms <= 0) return 0
  return (houseData.value.price || 0) * houseNumber.value
})
houseDetail({ id: houseId }).then((res) => {
  houseData.value = res.house || {}
  imageList.value = (res.images || []).map((v) => v.src)
})
const handleLeftClick = (_) => {
  router.back()
}
const handleCreateOrder = (_) => {
  const id = `h5_create_order_` + houseId
  localStorage.setItem(
    id,
    JSON.stringify({
      house: houseData.value,
      images: imageList.value,
      order: {
        house_id: houseId,
        rooms: houseNumber.value,
      },
    })
  )
  router.push(`/order/` + id)
}
</script>

<style lang="scss" scoped>
.house-image {
  height: 220px;
  width: 100%;
  object-fit: cover;
}
.title {
  font-weight: 700;
  font-size: 20px;
  color: #333;
  text-align: justify;
  line-height: 24px;
  overflow: hidden;
  margin-bottom: 6px;
  padding: 6px 10px;
}
.address {
  margin: 10px 20px;
  background-color: #eee;

  padding: 6px 10px;
  &.rooms {
    .times {
      margin-bottom: 10px;
      > div {
        margin-right: 10px;
      }
      b {
        font-size: 14px;
        margin-right: 4px;
      }
      font-size: 12px;
    }
  }
  span {
    margin-left: 5px;
    font-size: 13px;
  }
  border-radius: 5px;
  &.mobile {
  }
}
.none {
  position: fixed;
  right: 20px;
  width: 60px;
  bottom: 100px;
}
</style>

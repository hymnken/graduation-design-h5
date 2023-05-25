<template>
  <div>
    <div class="order-item" @click="handleClick">
      <div class="order-base flex flex-between">
        <div class="title text-ellipsis">{{ info.house.fullname }}</div>
        <div class="status text-primary bold">{{ statusText }}</div>
      </div>
      <div class="order-image">
        <img :src="info.house.cover" alt />
        <div class="bottom">
          <div class="b-left">
            <template v-if="false">
              <div class="date">
                <p class="day">7月27日</p>
                <div class="week-time">
                  <span class="week">周三</span>
                  <span class="time">15:00</span>
                </div>
              </div>
              <img class="arrow" src="/src/assets/img/order/icon_right_orderlist.png" />
              <div class="date">
                <p class="day">7月28日</p>
                <div class="week-time">
                  <span class="week">周四</span>
                  <span class="time">12:00</span>
                </div>
              </div>
            </template>
          </div>
          <div class="b-right" v-if="info.status <= 2">
            <p class="name">定金</p>
            <span class="price">￥{{ info.earnest_money }}</span>
          </div>
          <div class="b-right" v-if="info.status == 3 || info.status == 4">
            <p class="name">尾款</p>
            <span class="price">￥{{ info.surplus_money }}</span>
          </div>
          <div class="b-right" v-if="info.status == 4">
            <p class="name">总金额</p>
            <span class="price">￥{{ info.total_money }}</span>
          </div>
        </div>
      </div>
      <div class="flex flex-between tips">
        <div class="left flex" v-if="info.status == 1 && showTimeStr">
          <van-icon name="clock-o" />
          <span class="text-primary">{{ expireTimeStr }}</span>
          后订单自动取消
        </div>
        <div v-else class="left"></div>
        <div class="flex">
          <van-button size="small" @click.stop="handleContact">联系房东</van-button>
          <van-button size="small" class="payment" type="primary" v-if="info.status == 1 || info.status == 2">{{
            info.status == 1 ? '去支付' : '支付尾款'
          }}</van-button>
        </div>
      </div>
    </div>
    <van-popup @click.stop v-model:show="show" position="bottom" :style="{ padding: '64px' }">
      <p>地址：{{ info.house.street }}</p>
      <p>联系电话：{{ info.house.mobile }}</p>
    </van-popup>
  </div>
</template>

<script setup>
import { defineProps, computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const props = defineProps({
  info: {
    type: Object,
    default: () => {},
  },
})
const show = ref(false)
const showTimeStr = ref(true)
const statusText = computed(() => {
  const code = {
    0: '已过期',
    1: '未支付',
    2: '待付尾款',
    3: '待入住',
    4: '入住中',
    5: '已完成',
  }
  return code[props.info.status]
})
const expireTimeStr = ref('')
let timer = 0
onMounted(() => {
  if (props.info.status == 1) {
    timer = setInterval(() => {
      let nowTime = new Date().getTime()
      let offsetTime = new Date(props.info.create_at).getTime() + 20 * 60 * 1000 - nowTime

      let second = Math.floor(offsetTime / 1000)
      if (second <= 1) {
        // queryOrderDetail();
        showTimeStr.value = false
        clearInterval(timer)
      }
      const min = Math.floor(second / 60)
      const sec = second - min * 60
      expireTimeStr.value = min + '分' + sec + '秒'
    }, 1000)
  }
})
const handleClick = () => {
  router.push({
    name: 'orderDetail',
    params: {
      id: props.info.id,
    },
  })
}
const handleContact = (e) => {
  show.value = true
}
</script>

<style lang="scss" scoped>
.order-item {
  background-color: #fff;
  padding: 10px;
}
.title {
  width: 204px;
  font-size: 12px;
  color: #333;
  line-height: 12px;
  word-break: keep-all;
}
.order-image {
  position: relative;
  height: 223px;
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  margin: 10px 0;
  img {
    width: 100%;
    height: 100%;
    border-radius: 6px;
  }
}
.bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  background: rgba(9, 10, 14, 0.7);
  border-radius: 0 0 6px 6px;
  .b-left {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: white;
    .date {
      padding: 0 20px;
      p {
        padding: 0;
        margin: 0;
        margin-bottom: 5px;
        font-size: 16px;
        line-height: 16px;
        margin-bottom: 6px;
      }
      .week-time {
        font-size: 12px;
        text-align: center;
        line-height: 12px;
        opacity: 0.8;
        span {
          font-size: 12px;
          text-align: center;
          line-height: 12px;
          opacity: 0.8;
        }
      }
    }
  }
  .arrow {
    width: 16px;
    height: 12px;
  }
  .b-right {
    position: relative;
    width: 105px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &::before {
      content: '';
      position: absolute;
      top: 10px;
      left: -25px;
      width: 1px;
      height: 40px;
      background-color: white;
    }
    .name {
      color: #fff;
      text-align: center;
      line-height: 12px;
      opacity: 0.8;
      margin: 0;
      transform: scale(0.9);
    }
    .price {
      margin-top: 5px;
      font-size: 16px;
      color: var(--van-blue);
      letter-spacing: 0;
      text-align: right;
      line-height: 16px;
    }
  }
}
.payment {
  margin-left: 20px;
}
.tips {
  font-size: 11px;
}
</style>

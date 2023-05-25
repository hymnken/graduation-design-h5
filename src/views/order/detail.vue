<template>
  <div>
    <van-nav-bar left-text="返回" @click-left="handleBack" left-arrow title="订单详情" />
    <div class="house-box padding">
      <span class="bold text-primary hold expired" v-if="baseOrderInfo && baseOrderInfo.status == 0">已过期</span>
      <span class="bold text-primary hold" v-if="baseOrderInfo && baseOrderInfo.status == 2">待付尾款</span>
      <span class="bold text-primary hold" v-if="baseOrderInfo && baseOrderInfo.status == 3">待入住</span>
      <span class="bold text-primary hold" v-if="baseOrderInfo && baseOrderInfo.status == 4">入住中</span>
      <span class="bold text-primary hold" v-if="baseOrderInfo && baseOrderInfo.status == 5">已完成</span>
      <div class="row flex">
        <img :src="houseData.cover" alt class="house-avatar" />
        <div class="flex flex-column house-base flex-start">
          <div class="text-ellipsis-2">{{ houseData.fullname }}</div>
          <!-- <div class="flex type">整套出租 | 1室0厅 | 1床 | 最多住2人</div> -->
          <div class="flex type">{{ houseData.street }}</div>
        </div>
      </div>
      <div class="timeline margin-t">
        <div class="flex flex-y-start">
          <div class="flex flex-column date">
            <span class="bold">{{ todayStr }}</span>
            <span>12:00后入住</span>
          </div>
          <div class="flex flex-column split">-</div>
          <div class="flex flex-column date">
            <span class="bold">{{ tomorrowStr }}</span>
            <span>14:00前离开</span>
          </div>
          <div class="arrow flex">
            <span class="text-primary">共{{ baseOrderInfo.days || 1 }}晚</span>
            <!-- <van-icon name="arrow" /> -->
          </div>
        </div>
      </div>
      <div class="house-tips flex margin-t">
        <div class="flex cancel">
          <van-icon name="success" />
          <span>可免费取消</span>
        </div>
        <div class="flex sure">
          <van-icon name="guide-o" />
          <span>闪电确认</span>
        </div>
        <div class="flex ticket">
          <van-icon name="notes-o" />
          <span>可开发票</span>
        </div>
      </div>
    </div>
    <div class="line">
      <img :src="assetsUrl('img/line.png')" alt />
    </div>

    <!-- 预定信息 -->
    <div class="row padding">
      <div class="card">
        <div class="title">入住信息</div>
        <div class="sub-title">房间数量</div>
        <div class="flex flex-between">
          <span v-if="editDisabled"></span>
          <span v-else class="small-text">共{{ houseData.rooms }}间房,剩余{{ houseData.surplus_rooms }}间可预订</span>
          <div>
            <van-stepper :disabled="editDisabled" :min="1" v-model="houseNumber" :max="houseData.surplus_rooms" />
            <span style="margin-left: 5px">套</span>
          </div>
        </div>
        <div class="sub-title">入住人</div>
        <div class="margin-t-s">
          <van-cell-group>
            <van-field
              v-model="consumerInfo.consumer_name"
              name="用户名"
              label="真实姓名"
              placeholder="用户名"
              :disabled="editDisabled"
              :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
              v-model="consumerInfo.consumer_ident"
              name="密码"
              label="身份证"
              placeholder="密码"
              :disabled="editDisabled"
              :rules="[{ required: true, message: '请填写密码' }]"
            />
            <van-field
              v-model="consumerInfo.consumer_mobile"
              type="tel"
              name="用户名"
              label="联系电话 +86"
              placeholder="用户名"
              :disabled="editDisabled"
              :rules="[{ required: true, message: '请填写用户名' }]"
            />
          </van-cell-group>
        </div>
      </div>
    </div>

    <div class="row padding">
      <div class="card">
        <div class="sub-title">入住提示</div>
        <div class="small-text">房东确认后，可使用在线聊天工具向房东索要入住指南，快速了解入住路线、入住方式等相关事宜。</div>
        <div class="small-text">入住期间如有疑问，可随时联系在线客服。</div>
        <div class="small-text">有未成年人入住时，需要将其监护人的联系方式告知房东。</div>
        <div class="sub-title">服务提供方</div>
        <div class="small-text">预订服务和住宿服务由民宿经营者（房东）提供</div>
      </div>
    </div>
    <div class="row padding">
      <div class="card">
        <div class="sub-title">费用说明</div>
        <div class="small-text"><span class="bold">押金说明：</span>入住时缴纳金额为总费用40%的押金，离店时补齐剩余费用。</div>
        <div class="small-text"><span class="bold">发票：</span>如需开票，请在离店时联系房东开票。</div>
      </div>
    </div>

    <div class="password-mask" v-if="showPaymentModal">
      <div>
        <div class="flex flex-between margin-b padding-x">
          <div class="sub-title">请输入支付密码</div>
          <van-icon @click="queryOrderDetail" name="cross" />
        </div>
        <van-password-input :value="paymentPassword" focused />
      </div>
      <div></div>
    </div>
    <van-number-keyboard
      @input="handleKeyboardInput"
      @delete="handleKeyboardDelete"
      @close="handleKeyboardClose"
      close-button-text="立即支付"
      theme="custom"
      :show="showPaymentModal"
    />
    <van-submit-bar
      v-if="mode == 'create' || (baseOrderInfo && baseOrderInfo.status == 1)"
      v-show="!showPaymentModal"
      placeholder
      :price="orderMoney * 100"
      label="缴纳定金:"
      :button-text="mode == 'create' ? '立即预定' : '立即支付'"
      @submit="handleCreateOrder"
    >
      <template #tip v-if="baseOrderInfo && baseOrderInfo.status == 1">
        <div class="flex flex-center">请尽快支付，订单将在{{ expireTimeStr }}后自动关闭</div>
      </template>
    </van-submit-bar>
    <van-submit-bar
      v-if="baseOrderInfo && baseOrderInfo.status == 2"
      v-show="!showPaymentModal"
      placeholder
      :price="baseOrderInfo.surplus_money * 100"
      label="支付尾款:"
      :button-text="mode == 'create' ? '立即预定' : '立即支付'"
      @submit="handleCreateOrder"
    >
      <template #tip v-if="baseOrderInfo && baseOrderInfo.status == 2">
        <div class="flex flex-center">总金额{{ baseOrderInfo.total_money }}, 已支付定金{{ baseOrderInfo.earnest_money }}</div>
      </template>
    </van-submit-bar>
  </div>
</template>

<script setup>
import { assetsUrl, toast } from '@/utils/index'
import { reactive, ref, computed, onBeforeMount } from 'vue'
import { showFailToast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { createOrder, orderDetail, payment } from '@/api/order'
import dayjs from 'dayjs'

const store = useStore()
const route = useRoute()
const router = useRouter()
const userInfo = store.getters['user/userInfo']
const baseOrderInfo = ref({ status: -1 })

const consumerInfo = reactive({
  consumer_ident: userInfo.ident,
  consumer_name: userInfo.realname,
  consumer_mobile: userInfo.mobile,
})
let orderId = ref('')
const houseNumber = ref(0)
const imageList = ref([])
const houseData = ref({})
const baseOrder = ref({})
const { id } = route.params
let mode = ref(id.startsWith(`h5_create_order`) ? 'create' : 'detail')
const padZero = (str) => {
  if ((str + '').length < 2) return '0' + str
  return str
}
let expireTimeStr = ref('')
let timer = 0

const editDisabled = computed(() => {
  return mode.value !== 'create'
})
const todayStr = computed(() => {
  let day
  if (mode.value === 'create') {
    day = new Date()
  } else {
    day = new Date(baseOrderInfo.value.create_at)
  }
  return padZero(day.getMonth() + 1) + '月' + padZero(day.getDate()) + '日'
})
const orderMoney = computed(() => {
  if (mode.value === 'create') {
    if (!houseData || !houseData.value.id) return 0
    return houseNumber.value * houseData.value.price * 0.4
  } else {
    if (baseOrderInfo.value.status == 1) {
      return baseOrderInfo.value.earnest_money
    }
    if (baseOrderInfo.value.status == 4) {
      return baseOrderInfo.value.surplus_money
    }
  }
})
const tomorrowStr = computed(() => {
  let day
  if (mode.value === 'create') {
    day = new Date()
  } else {
    day = new Date(baseOrderInfo.value.create_at)
  }
  let nextDay = new Date(day.setDate(day.getDate() + 1))
  return padZero(nextDay.getMonth() + 1) + '月' + padZero(nextDay.getDate()) + '日'
})

const showPaymentModal = ref(false)
const showPaymentSheet = ref(true)
const paymentPassword = ref('123')
const handleBack = (_) => {
  router.back()
}
const handleCreateOrder = () => {
  if (mode.value === 'create') {
    createOrder({
      house_id: houseData.value.id,
      rooms: houseNumber.value,
      consumer_ident: consumerInfo.consumer_ident,
      consumer_mobile: consumerInfo.consumer_mobile,
      consumer_name: consumerInfo.consumer_name,
    }).then((res) => {
      orderId.value = res.order_id
      showPaymentModal.value = true
    })
  } else {
    showPaymentModal.value = true
  }
}

const handleKeyboardInput = (key) => {
  if (paymentPassword.value.length >= 6) return
  paymentPassword.value = paymentPassword.value + key
}
const handleKeyboardClose = (key) => {
  if (paymentPassword.value.length !== 6) {
    return toast.error(`请输入6位数的支付密码`)
  }
  payment({ id: orderId.value }).then((res) => {
    showPaymentModal.value = false
    queryOrderDetail()
  })
}
const handleKeyboardDelete = (key) => {
  if (paymentPassword.value.length <= 0) return
  paymentPassword.value = paymentPassword.value.slice(0, -1)
}
const queryOrderDetail = (_) => {
  router.replace({
    params: {
      id: orderId.value,
    },
  })
  clearInterval(timer)
  mode.value = 'detail'
  showPaymentModal.value = false
  orderDetail({
    id: orderId.value,
  }).then((res) => {
    baseOrderInfo.value = res
    consumerInfo.consumer_ident = res.consumer_ident
    consumerInfo.consumer_mobile = res.consumer_mobile
    consumerInfo.consumer_name = res.consumer_name
    houseNumber.value = res.rooms
    houseData.value.cover = res.house.cover
    houseData.value.fullname = res.house.fullname
    houseData.value.street = res.house.street
    houseData.value.price = res.house.price
    if (res.status == 1) {
      timer = setInterval(() => {
        let nowTime = new Date().getTime()
        let offsetTime = new Date(baseOrderInfo.value.create_at).getTime() + 20 * 60 * 1000 - nowTime

        let second = Math.floor(offsetTime / 1000)

        if (second <= 1) {
          // queryOrderDetail();
          baseOrderInfo.value.status = 0
          clearInterval(timer)
        }
        const min = Math.floor(second / 60)

        const sec = second - min * 60
        expireTimeStr.value = min + '分' + sec + '秒'
      }, 1000)
    }
  })
}

if (mode.value === 'create') {
  const cacheInfo = JSON.parse(localStorage.getItem(id))
  imageList.value = cacheInfo.images
  houseData.value = cacheInfo.house
  baseOrder.value = cacheInfo.order
  houseNumber.value = baseOrder.value.rooms
} else {
  orderId.value = id
  queryOrderDetail()
}
</script>

<style lang="scss" scoped>
.house-box {
  background-color: #fff;
  position: relative;
  .hold {
    position: absolute;
    right: 10px;
    bottom: -40px;
    display: block;
    background-color: rgba($color: #fca838, $alpha: 0.2);
    border: 2px solid #fca838;
    border-radius: 50%;
    overflow: hidden;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    font-size: 20px;
    transform: rotate(-25deg);
    &.expired {
      color: #999;
      border-color: #999;
      background-color: rgba($color: #999, $alpha: 0.2);
    }
  }
}
.house-avatar {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  margin-right: 10px;
  background: #f3f3f3;
  overflow: hidden;
  flex-grow: 1;
  flex-shrink: 0;
}
.house-base {
  justify-content: space-between;
  align-items: flex-start;
  .type {
    font-size: 11px;
    line-height: 16px;
    color: #999;
  }
}
.arrow {
  margin-left: auto;
}
.timeline {
  .split {
    margin: 0 40px;
  }
  .date {
    .bold {
      font-size: 16px;
      color: #333;
      text-align: center;
      font-weight: 600;
    }
    span {
      font-size: 11px;
      color: #999;
    }
  }
}
.house-tips {
  font-size: 10px;
  border-bottom: 1px solid #e9e9e9;
  padding-bottom: 10px;
  > div {
    margin-right: 20px;
    color: rgb(23, 210, 188);
  }
  span {
    margin-left: 5px;
  }
}
.line {
  height: 18px;
  width: 100%;
  img {
    width: 100%;
    height: 100%;
  }
}

.small-text {
  color: #999;
  font-size: 11px;
  .bold {
    color: #333;
  }
}
.password-mask {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: rgba($color: #000000, $alpha: 0.3);
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  > div {
    width: 80vw;
    padding: 20px 10px;
    background-color: #fff;
    border-radius: 6px;
  }
}
</style>

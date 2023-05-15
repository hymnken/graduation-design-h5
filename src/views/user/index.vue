<template>
  <div class="user-center">
    <van-nav-bar title="个人中心" />
    <div class="padding">
      <div class="margin-t top">
        <div class="flex card" @click="handleItemClick('userModify')">
          <img
            class="avatar"
            src="https://himg.bdimg.com/sys/portraitn/item/public.1.18dc4392.5FmNQDVxOeRFCYwzRUkBDg"
            alt
          />
          <div class="info flex flex-column">
            <div class="username text-primary flex">{{userInfo.username}}</div>
            <div class="flex tag">
              <van-tag type="primary">
                <van-icon name="user-o" />
                <span style="margin-left:4px">已实名</span>
              </van-tag>
            </div>
          </div>
          <div class="flex arrow">
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
    </div>
    <div class="padding">
      <div class="card">
        <div class="sub-title">我的功能</div>
        <div class="flex">
          <div class="flex item flex-column" @click="handleItemClick('order')">
            <van-icon name="balance-list-o" />
            <div>订单</div>
          </div>
          <div class="flex item flex-column" @click="handleItemClick('message')">
            <van-icon name="comment-o" />
            <div>留言</div>
          </div>
        </div>
      </div>
    </div>
    <div class="margin-t padding">
      <van-button :loading="loading" @click="handleLogout" type="primary" block>退出登录</van-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useStore } from "vuex";
const store = useStore();
const router = useRouter();
const loading = ref(false);
const userInfo = store.getters["user/userInfo"];
const handleItemClick = (name) => {
  router.push({ name });
};
const handleLogout = (_) => {
  if (loading.value) return;
  loading.value = true;
  store
    .dispatch("user/logout")
    .then((res) => {
      router.push(`login`);
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
    });
};
</script>

<style lang="scss" scoped>
.user-center {
  box-sizing: border-box;
  // background: linear-gradient(
  //   0deg,
  //   rgba(255, 255, 255, 1) 0%,
  //   rgba(252, 168, 56, 0.4318977591036415) 100%
  // );
}
.arrow {
  margin-left: auto;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
}
.sub-title {
  border-bottom: 1px solid #fec;
  margin-bottom: 20px;
  padding-bottom: 20px !important;
}
.info {
  margin-left: 20px;
  height: 50px;
  justify-content: space-between;
  align-items: flex-start;
  div:last-child {
    font-size: 14px;
    color: #666;
  }
  .username {
    font-weight: bold;
    font-size: 20px;
  }
}
.item {
  font-size: 40px;
  margin-right: 20px;
  width: 80px;
  > div {
    font-size: 13px;
    margin-top: 4px;
    color: #555;
  }
}
</style>
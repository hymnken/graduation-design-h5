<template>
  <div>
    <van-nav-bar @click-left="handleLeftClick" title="找回密码" left-text="登录" left-arrow />
    <div class="margin-t">
      <div class="card">
        <div class="title">账号校验</div>
        <div>
          <van-cell-group>
            <van-field v-model="forgetData.mobile" label="手机号" placeholder="请输入手机号" />
            <van-field
              v-if="step>=2"
              v-model="forgetData.secret"
              label="密保问题"
              placeholder="密码"
              disabled
            />
            <van-field
              v-if="step>=2"
              v-model="forgetData.secret_answer"
              label="答案"
              placeholder="请输入答案"
            />
            <van-field
              type="password"
              v-if="step>=3"
              v-model="forgetData.password"
              label="新密码"
              placeholder="请输入6-20位不含特殊字符密码"
            />
            <van-field
              type="password"
              v-if="step>=3"
              v-model="forgetData.rePassword"
              label="确认密码"
              placeholder="请再次输入密码"
            />
          </van-cell-group>
        </div>
      </div>
      <div class="next-btn padding">
        <van-button :loading="loading" @click="handleNextStep" type="primary" block>下一步</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { showDialog } from "vant";
import { matchMobile, matchSecret, resetPassword } from "@/api/user";
import { useRouter } from "vue-router";
const router = useRouter();
const loading = ref(false);
const step = ref(1);
const forgetData = reactive({
  mobile: "",
  secret: "",
  secret_answer: "",
  password: "",
  rePassword: "",
  code: "",
});

const handleNextStep = () => {
  if (loading.value) return;
  loading.value = true;
  if (step.value == 1) {
    // 第一步，校验手机号
    matchMobile(forgetData)
      .then((res) => {
        forgetData.secret = res.secret;
        step.value++;
        loading.value = false;
      })
      .catch((err) => {
        loading.value = false;
      });
  }
  if (step.value == 2) {
    // 第二步，校验密保问题
    matchSecret(forgetData)
      .then((res) => {
        forgetData.code = res.code;
        step.value++;
        loading.value = false;
      })
      .catch((err) => {
        loading.value = false;
      });
  }
  if (step.value >= 3) {
    // 第二步，校验密保问题
    resetPassword(forgetData)
      .then((res) => {
        step.value++;
        loading.value = false;
        showDialog({
          message: "密码重置成功！前往登录",
        }).then((e) => {
          router.replace({ name: "login" });
        });
      })
      .catch((err) => {
        loading.value = false;
      });
  }
};
const handleLeftClick = (_) => {
  router.replace({ name: "login" });
};
</script>

<style lang="scss" scoped>
.next-btn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
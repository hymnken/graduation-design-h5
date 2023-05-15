<template>
  <div class="login padding">
    <h1 class="text-primary">欢迎回来！</h1>
    <div>
      <img class="banner" :src="assetsUrl(`img/banner.webp`)" alt />
    </div>
    <div class="login-form margin-t">
      <van-cell-group inset>
        <van-field
          v-model="loginFormData.mobile"
          maxlength="11"
          required
          label="手机号 +86"
          placeholder="请输入手机号"
        />
        <van-field
          v-model="loginFormData.password"
          maxlength="20"
          required
          type="password"
          label="密码"
          placeholder="请输入密码"
        />
        <van-field
          v-model="loginFormData.captcha"
          center
          maxlength="4"
          clearable
          label="验证码"
          placeholder="请输入验证码"
        >
          <template #button>
            <!-- <van-button size="small" type="primary">发送验证码</van-button> -->
            <img @click="refreshCaptcha" :src="captchaSrc" alt />
          </template>
        </van-field>
      </van-cell-group>
    </div>
    <div class="margin-t">
      <van-button :loading="loginSubmitLoading" @click="handleLoginSubmit" type="primary" block>登 录</van-button>
    </div>
    <div class="margin-t action flex flex-between">
      <router-link to="/register">立即注册</router-link>
      <router-link to="/forgot">忘记密码?</router-link>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { assetsUrl, toast, uuid } from "@/utils";
import { login } from "@/api/user";
import config from "@/config";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const router = useRouter();
const store = useStore();
const loginSubmitLoading = ref(false);
const loginFormData = reactive({
  mobile: "",
  password: "",
  captcha: "",
});
const captchaSrc = ref("");
const refreshCaptcha = () => {
  captchaSrc.value =
    config.baseUrl + "/h5/captcha?v=" + uuid() + "." + Math.random();
};
refreshCaptcha();
const handleLoginSubmit = () => {
  if (loginSubmitLoading.value) return;
  loginSubmitLoading.value = true;
  store
    .dispatch("user/login", loginFormData)
    .then((res) => {
      toast.success(`登录成功`);
      setTimeout(() => {
        loginSubmitLoading.value = false;
        router.replace("/");
      }, 2000);
      refreshCaptcha();
    })
    .catch((err) => {
      loginSubmitLoading.value = false;
    });
};
</script>

<style lang="scss" scoped>
.login {
  width: 100vw;
  min-height: 100vh;
  background-color: #fff;
  box-sizing: border-box;
}
.banner {
  border-radius: 6px;
  overflow: hidden;
  width: 100%;
}
.action {
  font-size: 13px;
  padding: 0 5px;
  color: #00a4ff;
}
</style>
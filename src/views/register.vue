<template>
  <div class="login padding">
    <h1 class="text-primary">注册新用户</h1>
    <div>
      <img class="banner" :src="assetsUrl(`img/banner.webp`)" alt />
    </div>
    <div class="login-form margin-t">
      <div class="sub-title">基本信息</div>
      <van-cell-group inset>
        <van-field
          v-model="registerForm.mobile"
          type="tel"
          required
          label="手机号 +86"
          placeholder="请输入手机号"
        />
        <van-field
          v-model="registerForm.password"
          required
          type="password"
          label="密码"
          placeholder="请输入密码"
        />
        <van-field
          v-model="registerForm.rePassword"
          required
          type="password"
          label="确认密码"
          placeholder="请再次输入密码"
        />
        <van-field
          required
          v-model="registerForm.secret"
          is-link
          readonly
          name="picker"
          label="密保"
          placeholder="选择密保问题"
          @click="showSecretPicker = true"
        />
        <van-field
          v-model="registerForm.secret_answer"
          required
          label="密保答案"
          placeholder="请输入密保答案"
        />
        <!-- <van-field v-model="sms" center clearable label="验证码" placeholder="请输入短信验证码">
          <template #button>
            <van-button size="small" type="primary">发送验证码</van-button>
          </template>
        </van-field>-->
      </van-cell-group>
      <div class="sub-title">实名认证</div>
      <van-cell-group inset>
        <van-field required v-model="registerForm.realname" label="真实姓名" placeholder="用户名" />
        <van-field required v-model="registerForm.ident" label="身份证" placeholder="请输入身份证号" />
      </van-cell-group>
    </div>
    <div class="margin-t">
      <van-button
        type="primary"
        :loading="registerLoading"
        loading-text="即将完成"
        block
        @click="handleSubmitRegister"
      >确 认</van-button>
    </div>
    <div class="margin-t action flex flex-between">
      <span></span>
      <router-link to="/login">已有账号?前往登录</router-link>
    </div>

    <!-- 密保问题弹窗 -->
    <van-popup v-model:show="showSecretPicker" position="bottom">
      <van-picker
        :columns-field-names="{value:'label',text:'label'}"
        :columns="secretColumns"
        @confirm="handleSecretPick"
        @cancel="showSecretPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { assetsUrl } from "@/utils";
import { ref, reactive } from "vue";
import { register } from "@/api/user";
import { showDialog } from "vant";
import { useRouter } from "vue-router";
import config from "@/config";
const secretColumns = (config.secretColumns || []).map((v) => {
  return {
    label: v,
  };
});

const router = useRouter();

const registerLoading = ref(false);
// 显示密保弹窗
const showSecretPicker = ref(false);
// 注册信息
const registerForm = reactive({
  username: "",
  mobile: "",
  avatar: "",
  password: "",
  rePassword: "",
  secret: "",
  secret_answer: "",
  realname: "",
  ident: "",
});

//选择密保
const handleSecretPick = (e, v) => {
  registerForm.secret = e.selectedValues[0] || "";
  showSecretPicker.value = false;
};
// 提交注册
const handleSubmitRegister = async () => {
  if (registerLoading.value) return;
  registerLoading.value = true;

  register(registerForm)
    .then((res) => {
      registerLoading.value = false;
      showDialog({
        message: "注册成功，前往登录",
      }).then((e) => {
        router.replace({ name: "login" });
      });
    })
    .catch((err) => {
      registerLoading.value = false;
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
.sub-title {
  color: #333;
  font-size: 13px;
  font-weight: bold;
  padding: 10px 18px;
}
</style>
<template>
  <div>
    <van-nav-bar @click-left="handleLeftClick" title="更改资料" left-text="返回" left-arrow />
    <div>
      <div class="card margin-t">
        <div class="sub-title">基本信息</div>
        <van-cell-group inset>
          <van-field v-model="registerForm.username" required label="昵称" placeholder="请输入用户昵称" />
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
            autocomplete="off"
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
        <div class="sub-title">账号校验</div>
        <van-cell-group inset>
          <van-field
            v-model="registerForm.oldPassword"
            required
            autocomplete="off"
            type="password"
            label="原密码"
            placeholder="请输入原密码"
          />
        </van-cell-group>
      </div>
    </div>
    <div class="next-btn padding">
      <van-button :loading="registerLoading" @click="handleSave" type="primary" block>保存</van-button>
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
import { useStore } from "vuex";
import { toast } from "@/utils";
import { modify } from "@/api/user";
const store = useStore();
const userInfo = store.getters["user/userInfo"];
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
  oldPassword: "",
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
Object.keys(userInfo).forEach((k) => {
  registerForm[k] = userInfo[k];
});
//选择密保
const handleSecretPick = (e, v) => {
  registerForm.secret = e.selectedValues[0] || "";
  showSecretPicker.value = false;
};
// 提交保存
const handleSave = (_) => {
  if (!registerForm.oldPassword) {
    return toast.error(`请输入原密码`);
  }
  if (registerLoading.value) return;
  registerLoading.value = true;
  modify(registerForm)
    .then((res) => {
      registerLoading.value = false;
      showDialog({
        message: "保存成功，重新登录",
      }).then((e) => {
        store.dispatch("user/clearUserInfo").then((res) => {
          router.replace({ name: "login" });
        });
      });
    })
    .catch((er) => {
      registerLoading.value = false;
    });
};
const handleLeftClick = (_) => {
  router.back();
};
</script>

<style lang="scss" scoped>
.a {
}
</style>
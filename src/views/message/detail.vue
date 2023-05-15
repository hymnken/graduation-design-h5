<template>
  <div>
    <van-nav-bar @click-left="handleLeftClick" title="留言详情" left-text="返回" left-arrow>
      <template #right>
        <div class="flex" @click="showModal = true">
          <van-icon name="edit" />
          <span class="text-primary" style="margin-left:4px">回复</span>
        </div>
      </template>
    </van-nav-bar>
    <div>
      <div
        class="row"
        :class="[ item.admin_id ?'sys':'']"
        v-for="item in msgData.list"
        :key="item.id"
      >
        <div class="flex">
          <img v-if="item.user_id" :src="assetsUrl('img/avatar.png')" class="avatar" alt />
          <img v-else :src="assetsUrl('img/robot.png')" class="avatar" alt />
          <div class="flex flex-column user">
            <span class="bold">{{item.user_id ? userInfo.username : '管理员'}}</span>
            <span>{{item.create_at}}</span>
          </div>
        </div>
        <div class="ctx">{{item.content}}</div>
      </div>
    </div>
    <div class="margin-t padding">
      <van-button type="primary" block @click="showModal = true">继续回复</van-button>
    </div>
    <!-- 留言弹窗 -->
    <van-dialog
      :before-close="beforeModalClose"
      @confirm="handleMessage"
      v-model:show="showModal"
      title="在线留言"
      show-cancel-button
    >
      <div class="message-box padding">
        <van-cell-group>
          <van-field
            v-model="content"
            rows="5"
            autofocus
            autosize
            type="textarea"
            maxlength="150"
            placeholder="请输入留言"
            show-word-limit
          />
        </van-cell-group>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { assetsUrl } from "@/utils/index";
import { ref, reactive } from "vue";
import { message, messageList, messageDetail } from "@/api/user";
import { toast } from "@/utils/index";
import { useStore } from "vuex";
const store = useStore();
const userInfo = store.getters["user/userInfo"];
const showModal = ref(false);
const router = useRouter();
const route = useRoute();
const parentId = route.params.id;
const content = ref("");
const msgData = reactive({
  count: 0,
  list: [],
});
const handleLeftClick = (_) => {
  router.back();
};
const beforeModalClose = (e) => {
  if (e === "confirm") return false;
  return true;
};
const queryMessageList = (_) => {
  messageList().then((res) => {
    msgData.count = res.count;
    msgData.list = res.rows;
  });
};
const queryMessageDetail = (_) => {
  messageDetail({ parent_id: parentId }).then((res) => {
    msgData.count = res.count;
    msgData.list = res.rows;
  });
};
queryMessageDetail();
const handleMessage = (_) => {
  const msg = content.value.trim();
  if (!msg) {
    return toast.error(`留言内容不能为空`);
  }
  message({ content: content.value, parent_id: parentId })
    .then((res) => {
      queryMessageDetail();
      showModal.value = false;
      content.value = "";
    })
    .catch((err) => {
      //   showModal.value = false;
    });
};
</script>

<style lang="scss" scoped>
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #eee;
  padding: 2px;
}
.user {
  align-items: flex-start;
  margin-left: 10px;
  font-size: 13px;
  height: 30px;
  justify-content: space-around;
  span:last-child {
    color: #ccc;
    font-size: 11px;
  }
}
.row {
  background-color: #fff;
  margin: 20px;
  padding: 20px;
  border-radius: 6px;
  overflow: hidden;
  width: 70vw;
  .ctx {
    margin-top: 20px;
  }
}
.sys {
  margin-left: auto;
  > .flex {
    justify-content: flex-start;
    flex-direction: row-reverse;
    .user {
      align-items: flex-end;
      margin-right: 10px;
    }
  }
}
</style>
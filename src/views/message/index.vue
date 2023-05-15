<template>
  <div>
    <van-nav-bar @click-left="handleLeftClick" title="在线留言" left-text="返回" left-arrow>
      <template #right>
        <div class="flex" @click="showModal = true">
          <van-icon name="edit" />
          <span class="text-primary" style="margin-left:4px">新留言</span>
        </div>
      </template>
    </van-nav-bar>
    <div>
      <div v-if="msgData.count <= 0">
        <van-empty :image="assetsUrl(`img/empty.png`)" image-size="180" description="暂无记录" />
        <div class="flex padding">
          <van-button type="primary" block @click="showModal = true">遇到问题？点击提交</van-button>
        </div>
      </div>
      <div class="padding" v-else>
        <div class="flex margin-b flex-center bold">
          共
          <span class="text-primary" style="margin:0 5px">{{msgData.count}}</span> 条留言
        </div>
        <div
          class="msg-item"
          @click="handleItemClick(item.id)"
          v-for="item in msgData.list"
          :key="item.id"
        >
          <van-icon name="chat-o" />
          <span class="ctx">{{item.content}}</span>
          <div class="flex time">
            <span
              :class="[item.status ==2 ? 'replied' : 'wait','tag']"
            >{{item.status == 2 ? '已回复':'待回复'}}</span>
            <span>{{item.create_at}}</span>
          </div>
        </div>
      </div>
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
import { useRouter } from "vue-router";
import { assetsUrl } from "@/utils/index";
import { ref, reactive } from "vue";
import { message, messageList } from "@/api/user";
import { toast } from "@/utils/index";
const showModal = ref(false);
const router = useRouter();
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
const handleItemClick = (id) => {
  router.push({
    path: "message/" + id,
  });
};
queryMessageList();
const handleMessage = (_) => {
  const msg = content.value.trim();
  if (!msg) {
    return toast.error(`留言内容不能为空`);
  }
  message({ content: content.value })
    .then((res) => {
      queryMessageList();
      showModal.value = false;
      content.value = "";
    })
    .catch((err) => {
      //   showModal.value = false;
    });
};
</script>

<style lang="scss" scoped>
.msg-item {
  //   border: 1px solid #ccc;
  box-shadow: rgba(99, 99, 99, 0.1) 0px 2px 8px 0px;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  .ctx {
    font-size: 14px;
    margin-left: 5px;
  }
  span.tag {
    font-size: 11px;
    padding: 2px 10px;
    color: #d46b08;
    background: #fff7e6;
    border-color: #ffd591;
    &.replied {
      color: #096dd9;
      background: #e6f7ff;
      border-color: #91d5ff;
    }
  }
  .time {
    border-top: 1px solid #eee;
    margin-top: 20px;
    padding-top: 10px;
    font-size: 10px;
    color: #666;
    justify-content: space-between;
    margin-bottom: -10px;
  }
}
</style>
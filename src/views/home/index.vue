<template>
  <div>
    <div class="top-background" v-if="activeSwiperImage">
      <img :src="activeSwiperImage" alt />
    </div>
    <div class="padding-x">
      <h1 class="text-primary">民宿预定</h1>
    </div>
    <div class="swiper-container padding-x">
      <van-swipe
        @change="handleSwiperChange"
        class="swiper-row"
        :autoplay="3000"
        indicator-color="white"
      >
        <van-swipe-item v-for="(item) in swiperImages" :key="item">
          <img class="banner-image" :src="item" alt />
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- type select -->
    <div class="row margin-t">
      <van-tabs class="category-list">
        <van-tab v-for="(item, index) in categories" :key="index">
          <template #title>
            <div class="category-item" @click="handleItemClick(item.label)">
              <img class="icon" :src="item.icon" alt />
              <div class="title">{{ item.label }}</div>
            </div>
          </template>
        </van-tab>
      </van-tabs>
    </div>
    <div class="margin-t house-list padding-x">
      <houseItem class="house" v-for="item in list" :key="item.id" :info="item" />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import houseItem from "@/components/house-item.vue";
import { houseList } from "@/api/house";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const swiperImages = reactive([
  "https://pic.tujia.com/upload/qualifiedpics/day_211130/thumb/202111301532177501_700_467.jpg",
  "https://pic.tujia.com/upload/qualifiedpics/day_191211/thumb/201912112344282763_700_467.jpg",
  "https://pic.tujia.com/upload/landlordunit/day_200527/thumb/202005271824504044_700_467.jpg",
]);
const activeSwiperImage = ref(
  "https://pic.tujia.com/upload/qualifiedpics/day_211130/thumb/202111301532177501_700_467.jpg"
);
const list = ref([]);
const categories = reactive([
  {
    id: 1,
    label: "新房特惠",
    icon: "https://pic.tujia.com/upload/resourcespic/day_201124/202011241609392352.png",
  },
  {
    label: "品牌民宿",
    icon: "https://pic.tujia.com/upload/resourcespic/day_201124/202011241609392352.png",
  },
  {
    label: "整套出租",
    icon: "https://pic.tujia.com/upload/resourcespic/day_201124/202011241610475893.png",
  },
  {
    label: "做饭方便",
    icon: "https://pic.tujia.com/upload/resourcespic/day_201124/202011241619599744.png",
  },
  {
    label: "LOFT",
    icon: "https://pic.tujia.com/upload/resourcespic/day_201124/202011241618017144.png",
  },

  {
    label: "客栈",
    icon: "https://pic.tujia.com/upload/resourcespic/day_201124/202011241616084091.png",
  },
  {
    label: "别墅",
    icon: "https://pic.tujia.com/upload/resourcespic/day_201124/202011241615137585.png",
  },
]);

const handleSwiperChange = (index) => {
  activeSwiperImage.value = swiperImages[index];
};
const queryParams = reactive({
  page: 1,
  limit: 10,
  enable: true,
});

const queryList = () => {
  houseList(queryParams).then((res) => {
    list.value = res.rows || [];
  });
};
queryList();

const handleItemClick = (type) => {
  router.push({
    name: "reserve",
    query: {
      house_type: type,
    },
  });
};
</script>

<style lang="scss" scoped>
.sitename {
  margin-top: -20px;
}
.swiper-container {
  .swiper-row {
    border-radius: 8px;
    overflow: hidden;
  }
  .banner-image {
    height: 150px;
    width: 100%;
    object-fit: cover;
  }
}
.category-list {
  --van-tabs-line-height: 80px;
  --van-tabs-bottom-bar-height: 0;

  .category-item {
    text-align: center;

    .icon {
      width: 32px;
      height: 32px;
    }

    .title {
      font-size: 12px;
    }
  }
}
.top-background {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: -1;
  //   background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
  // hsla(350, 6%, 42%, 0.3);
  filter: blur(20px) opacity(30%);
  img {
    width: 100vw;
  }
}
.house-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .house {
    width: calc((100% - 20px) / 2);
    margin-bottom: 10px;
  }
}
</style>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import router from "./router";
import { Tooltip,AnimationIcon,Card } from 'vue3-dxui'
router.push({
  path: '/ImageMj'
})

const about2Click = () => {
  //获取到子组件的 title 数据
  console.log('你点击了li元素2');
  window.document.getElementById("imageId").className="";
  window.document.getElementById("bookId").className="active";
  router.push({
    path: '/ImageQe'
  })
};

const aboutClick = () => {
  //获取到子组件的 title 数据
  console.log('你点击了li元素1');
  window.document.getElementById("imageId").className="active";
  window.document.getElementById("bookId").className="";
  router.push({
    path: '/ImageMj'
  })
};

import { ref, computed } from 'vue';
const contentStyle = computed(() => ({
  width: (window.innerWidth-98)+'px', // 使用 ref 的值计算样式
  padding: '8px'
}));

</script>

<template>
  <div class="home">
    <Card hover="boxShadow" style="width:70px">
    <div class="navigator">
      <div class="logo1">

        <AnimationIcon width="36px" height="36px" jsonDataName="GEAR" />
<!--        <el-image src="/images/logo.png" :width="50" :height="50"/>-->
        <div class="divider"></div>
      </div>
      <ul class="nav-items">
        <Tooltip title="AI化妆品" position="right">
        <li @click="aboutClick">
          <a id="imageId" class="active">
            <i class="iconfont icon-image-list"></i>
          </a>
        </li>
        </Tooltip>
        <Tooltip title="测试2" position="right">
        <li @click="about2Click">
          <a id="bookId">
            <i class="iconfont icon-book"></i>
          </a>
        </li>
        </Tooltip>
      </ul>

    </div>
    </Card>
    <div class="content" :style="contentStyle">
      <RouterView />
    </div>
  </div>
</template>


<style lang="stylus" scoped>
@import '@/assets/iconfont/iconfont.css';
.home {
  display: flex;
  background-color: #ffffff;
  height 100vh
  width 100%

  .navigator {
    display: flex
    flex-flow: column
    width: 70px
    padding: 10px 6px
    border-right: 1px solid #F6F6F6FF

    .logoTmp {

    }

    .logo1 {
      display flex
      flex-flow column
      align-items center
      .divider {
        border-bottom 1px solid #ffffff
        width 80%
        height 10px
      }
    }

    .nav-items {
      margin-top: 20px;
      padding-left: 10px;
      padding-right: 10px;

      li {
        margin-bottom: 15px

        a {
          color:#000000
          background-color:#FFFFFF
          border-radius: 10px
          width: 48px
          height: 48px
          display: flex
          justify-content: center
          align-items: center
          cursor: pointer

          .el-image {
            border-radius:10px
          }

          .iconfont {
            font-size:20px
          }
        }

        a:hover, a.active {
          background-color: #eaeaea
        }

        .title {
          font-size: 12px;
          padding-top: 5px;
          color: #e5e7eb;
          text-align: center;
        }

        /*.active {
          color:#FFFFFFFF
        }*/
      }
    }
  }

  .content {
    width: 170vh;
    height: 100vh;
    box-sizing: border-box;
  }

}
</style>

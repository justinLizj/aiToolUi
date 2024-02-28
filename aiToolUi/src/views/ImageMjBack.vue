<script>
import { ref } from 'vue';

import {reactive} from 'vue'
import {onMounted} from 'vue'
import img1 from '../images/mj/mj-v5.1.jpg';
import img2 from '../images/mj/mj-v5.2.png';
import img3 from '../images/mj/mj-niji.png';
import img4 from '../images/mj/mj-v4.jpg';
import imgResult1 from '../images/mj/mj-v5.jpg';
import imgResult2 from '../images/mj/mj-v6.png';
import imgResult3 from '../images/mj/nj1.jpg';

export default {
  setup() {
    const models = [
      {text: "写实模式", value: " --v 6", img: "/images/mj/mj-v6.png"},
      {text: "优质模式", value: " --v 5.2", img: "/images/mj/mj-v5.2.png"},
      {text: "优质模式", value: " --v 5.1", img: "/images/mj/mj-v5.1.jpg"},
      {text: "虚幻模式", value: " --v 5", img: "/images/mj/mj-v5.jpg"},
    ]

    let data = reactive({
      msg: "hell",
      photos: [{
        id: 1,
        title: "",
        path: img1,
        sort: 0
      },
        {
          id: 2,
          title: "",
          path: img2,
          sort: 0
        },
        {
          id: 3,
          title: "",
          path: img3,
          sort: 0
        },
        {
          id: 4,
          title: "",
          path: img4,
          sort: 0
        }
      ],
      resultPhotos: [{
        id: 1,
        title: "",
        path: imgResult1,
        sort: 0
      },
        {
          id: 2,
          title: "",
          path: imgResult2,
          sort: 0
        },
        {
          id: 3,
          title: "",
          path: imgResult3,
          sort: 0
        }
      ]

    })
    let funcs = reactive({
      drag: function(e) {
        e.target.classList.add("hover");
        e.dataTransfer.setData("text/plain", e.target.id)
        e.dataTransfer.dropEffect = "copy"; //拖曳时鼠标图标
      },
      dragend: function(e) {
        e.target.classList.remove("hover")
      },
      dragover: function(id, e) {
        document.getElementById(id)
            .classList.add("hover")
        e.preventDefault();
      },
      dragleave: function(id) {
        document.getElementById(id)
            .classList.remove("hover")
      },
      drop: function(id, e) {

        document.getElementById(id)
            .classList.remove("hover")
        let dragId = e.dataTransfer.getData('text/plain');
        this.sort(id, dragId);

      },
      sort: function(targetId, sourceId) {
        let target, source;
        data.photos.forEach(function(item) {
          if (item.id == targetId) {
            target = item;

          }
          if (item.id == sourceId) {
            source = item;
          }
        })
        //互换位置
        data.photos.forEach(function(item, index, arr) {

          if (item.id == target.id) {
            arr[index] = source;
          }
          if (item.id == source.id) {
            arr[index] = target;
          }
          arr[index].sort = (index + 1) * 10;
        })

      },
      uploadPhoto: function(event) {
        let r = new FileReader();
        r.readAsDataURL(event.target.files[0])
        r.onload = function(e) {

          data.photos.push({
            id: 9,
            title: "",
            path: this.result,
            sort: data.photos.length * 10
          })
          //上传至服务器代码...
        }
      },
      deletePhoto: function(id) {
        data.photos.forEach(function(item, index, arr) {
          if (item.id === id) {
            data.photos.splice(index, 1)

          }
        })
      }
    })

    onMounted(() => {

    })
    return {
      models,
      imageUrl:'',
      data,
      funcs,
    };
  },
  data() {
    return {
      imageUrl: '',
      imageWidth: 0,
      imageHeight: 0,
      crosshairVisible: false,
      mouseDownX: 0,
      mouseDownY: 0,
    };
  },
  methods: {
    handleDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target.result;
        this.imageWidth = file.width;
        this.imageHeight = file.height;
      };
      reader.readAsDataURL(file);
    },
    handleMouseDown(event) {
      this.mouseDownX = event.clientX;
      this.mouseDownY = event.clientY;
      this.crosshairVisible = true;
    },
    handleMouseMove(event) {
      if (!this.crosshairVisible) return;
      const dx = event.clientX - this.mouseDownX;
      const dy = event.clientY - this.mouseDownY;
      // 在这里可以根据需要对图片进行移动或缩放操作，这里仅作为示例，不做实际移动或缩放操作。
    },
    handleMouseUp() {
      this.crosshairVisible = false;
    },
  },
};

</script>

<template>
  <main>
  <div class="page-mj">
    <div class="inner custom-scroll">
      <div class="mj-box">
        <h2>创作中心</h2>

        <div class="mj-params" style="height: 570px">
          <el-form label-width="80px" label-position="left">

            <div class="param-line pt">
              <span>模型选择：</span>
              <el-tooltip effect="light" content="MJ: 偏真实通用模型 <br/>NIJI: 偏动漫风格、适用于二次元模型" raw-content
                          placement="right">
                <el-icon>
                  <InfoFilled/>
                </el-icon>
              </el-tooltip>
            </div>
            <div class="param-line pt">
              <el-row>
                <el-col :span="12" v-for="item in models" :key="item.value">
                  <div class="model">
                    <el-image :src="item.img" fit="cover" :width="100" :height="60"></el-image>
                    <div class="text">{{ item.text }}</div>
                  </div>
                </el-col>
              </el-row>
            </div>

          </el-form>
        </div>
        <el-button style="width:270px" color="#47fff1" :dark="false" @click="generate" round>立即生成</el-button>
      </div>
      <div class="task-list-box">
        <div class="task-list-inner" >
          <h2>AI绘画</h2>
                <div class="text">
                </div>
                    <div class="upload-wrapper">
                      <div class="item-wrapper landscape"
                           :id="item.id"
                           v-for="item in data.photos" :key="item.id"
                           draggable="true"
                           @dragstart.stop="funcs.drag($event)"
                           @dragend="funcs.dragend($event)"
                           @dragover="funcs.dragover(item.id,$event)"
                           @dragleave="funcs.dragleave(item.id)"
                           @drop="funcs.drop(item.id,$event)"
                           :style="'background-image: url('+item.path+')'"
                      ><div class="item"  ></div>

                        <div class="del" @click="funcs.deletePhoto(item.id)">X</div>
                      </div>

                    </div>
                    <div class="upload-btn"><input type="file" accept="image/*"  @change="funcs.uploadPhoto($event)">选 择 图 片</div>


          <h2>结果列表</h2>
          <div class="running-job-list">

            <div class="upload-wrapper">
              <div class="item-wrapper landscape"
                   :id="item.id"
                   v-for="item in data.resultPhotos" :key="item.id"
                   draggable="true"
                   :style="'background-image: url('+item.path+')'"
              ><div class="item"  ></div>

              </div>

            </div>
          </div>
        </div>
      </div><!-- end task list box -->
    </div>

  </div>
  </main>
</template>

<style lang="stylus">

  .image-container {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .image-container img {
    display: block;
    max-width: 100%;
    max-height: 100%;
  }
  .crosshair {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2px;
    height: 2px;
    background-color: red;
    transform-origin: 50% 50%;
  }

  .page-mj {
    background-color: #282c34;

    .inner {
      display: flex;

      .mj-box {
        margin 10px
        background-color #262626
        border 1px solid #454545
        min-width 300px
        max-width 300px
        padding 10px
        border-radius 10px
        color #ffffff;
        font-size 14px

        h2 {
          font-weight: bold;
          font-size 20px
          text-align center
          color #47fff1
        }


        ::-webkit-scrollbar {
          width: 0;
          height: 0;
          background-color: transparent;
        }

        .mj-params {
          margin-top 10px
          overflow auto


          .param-line {
            padding 0 10px

            .el-icon {
              position relative
            }

            .grid-content {
              background-color #383838
              border-radius 5px
              padding 8px 14px
              display flex
              cursor pointer
              margin-bottom: 10px;

              &:hover {
                background-color #585858
              }

              .icon {
                width 20px
                height 20px
                margin-bottom 5px
              }

              .shape {
                width 16px
                height 16px
                margin-bottom 5px
                border 1px solid #C4C4C4
                border-radius 3px
              }

              .shape.size9-16 {
                width 9px
                height 16px
              }

              .shape.size16-9 {
                height 9px
                width 16px
                position relative
                margin 4px 0 7px
              }

              .shape.size3-4 {
                width 12px
                height 16px
              }

              .shape.size4-3 {
                height 12px
                width 16px
                position relative
                margin 4px 0 4px
              }

              .shape.size2-3 {
                width 11px
                height 16px
              }

              .shape.size3-2 {
                height 11px
                width 16px
                position relative
                margin 4px 0 5px
              }

              .shape.size1-2 {
                width 8px
                height 16px
              }

              .shape.size2-1 {
                height 8px
                width 16px
                position relative
                margin 4px 0 8px
              }
            }


            .grid-content.active {
              color #47fff1
              background-color #585858

              .shape {
                border 1px solid #47fff1
              }
            }

            .model {
              background-color #383838
              border 1px solid #454545
              border-radius 5px
              padding 10px
              margin-bottom 10px
              display flex
              flex-flow column
              align-items center
              cursor pointer

              &:hover {
                background-color #585858
              }

              .el-image {
                height 60px
                width 100%
              }

              .text {
                margin-top 6px
              }

            }

            .model.active {
              color #47fff1
              background-color #585858
              border 1px solid #47fff1
            }

            .form-item-inner {
              display flex
              align-items: center

              .el-select {
                --el-select-input-focus-border-color: #47FFF1;
                --el-input-focus-border-color: #47FFF1;
              }

              .el-input__wrapper {
                background: #383838;
              }

              .el-input__inner {
                color: #fff
              }

              .el-icon {
                margin-left 10px
              }
            }

            .img-uploader {
              .el-upload {
                border: 1px dashed var(--el-border-color);
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                width 100%
                transition: var(--el-transition-duration-fast);

                &:hover {
                  border-color: var(--el-color-primary);
                }

                .el-icon.uploader-icon {
                  font-size: 28px
                  color: #8c939d
                  width 100%
                  height: 120px
                  text-align: center
                }
              }
            }

          }

          .param-line.pt {
            display: flex
            align-items: center
            padding-top 5px
            padding-bottom 5px
          }
        }
      }

      .el-form {
        .el-form-item__label {
          color #ffffff
        }

        .el-input, .el-slider {
          width 180px
        }
      }

      .task-list-box {
        width 100%
        padding 10px
        color #ffffff
        overflow-x hidden

        .task-list-inner {
          .el-tabs {
            --el-tabs-header-height: 55px;
          }

          .el-tabs__item {
            color: #fff;
            font-size: 18px;
          }

          .title-tabs .el-tabs__item.is-active {
            color: #47FFF1;
            font-size: 18px;
          }

          .title-tabs .el-tabs__active-bar {
            background-color: #47FFF1;
          }

          .title-tabs .el-tabs__content {
            padding: 10px 0;
          }

          .el-textarea {
            --el-input-focus-border-color: #47FFF1;
          }

          .el-textarea__inner {
            background: transparent;
            color: #fff;
          }

          .el-input__wrapper {
            background: transparent;
            padding 5px
          }

          .text {
            margin-bottom: 10px;
            color: #6b778c;
            font-size: 15px
          }

          .param-line.pt {
            padding-top 5px
            padding-bottom 5px
          }

          .form-item-inner {
            display flex
            align-items: center

            .el-icon {
              margin-left 10px
            }
          }

          .el-form-item__label {
            color #ffffff
          }

          .img-uploader {
            .el-upload {
              border: 1px dashed var(--el-border-color);
              border-radius: 6px;
              cursor: pointer;
              position: relative;
              overflow: hidden;
              width 300px;
              transition: var(--el-transition-duration-fast);
              margin-bottom: 20px;

              &:hover {
                border-color: var(--el-color-primary);
              }

              .el-icon.uploader-icon {
                font-size: 28px
                color: #8c939d
                width 100%
                height: 120px
                text-align: center
              }
            }
          }

          .submit-btn {
            display flex
            margin: 20px 0

            .el-button {
              width 200px
            }

            .text-info {
              width 100%
              display flex
              justify-content right
              align-items center
            }
          }


          .upload-wrapper{display: flex;flex-wrap:wrap;padding: 0.5%;}
          .upload-wrapper .item-wrapper{width: 24%; background-color: bisque;margin: 0.5%; position: relative;background-repeat: no-repeat;background-position: 50% 50%;}
          .upload-wrapper .item-wrapper,.landscape{background-size: 100% auto;}
          .upload-wrapper .item-wrapper .del{position: absolute; right: 0; top: 0; width: 20px; height: 20px; background-color: black;color: #fff;line-height: 20px;cursor: pointer}
          .upload-wrapper .item-wrapper .item{padding: 100% 50% 0% 0%;}
          .upload-wrapper .hover{opacity: 0.3;}

          .upload-btn{overflow: hidden;background-color: #42b983;position: relative; height: 30px;border-radius: 10px;  font-family: Arial, sans-serif; /* 修改字体 */
            text-align: center; /* 居中文本 */
            display: flex; /* 使用Flexbox布局 */
            justify-content: center; /* 水平居中 */
            align-items: center; /* 垂直居中 */}
          .upload-btn input{opacity: 0.01;width: 100%; height: 100%;position: absolute;}

        }

        .running-job-list {
          .job-item {
            //border: 1px solid #454545;
            width: 100%;
            padding 2px
            background-color #555555

            .job-item-inner {
              position relative
              height 100%
              overflow hidden

              .progress {
                position absolute
                width 100%
                height 100%
                top 0
                left 0
                display flex
                justify-content center
                align-items center

                span {
                  font-size 20px
                  color #ffffff
                }
              }
            }
          }
        }


        .finish-job-list {
          .job-item {
            width 100%
            height 100%
            border 1px solid #666666
            padding 6px
            overflow hidden
            border-radius 6px
            transition: all 0.3s ease; /* 添加过渡效果 */
            position relative

            .opt {
              .opt-line {
                margin 6px 0

                ul {
                  display flex
                  flex-flow row

                  li {
                    margin-right 6px

                    a {
                      padding 3px 0
                      width 40px
                      text-align center
                      border-radius 5px
                      display block
                      cursor pointer
                      background-color #4E5058
                      color #ffffff

                      &:hover {
                        background-color #6D6F78
                      }
                    }
                  }

                  .show-prompt {
                    font-size 20px
                    cursor pointer
                  }
                }
              }
            }

            .remove {
              display none
              position absolute
              right 10px
              top 10px
            }

            &:hover{
              .remove {
                display block
              }
            }
          }


          .animate {
            &:hover {
              box-shadow: 0 0 10px rgba(71, 255, 241, 0.6); /* 添加阴影效果 */
              transform: translateY(-10px); /* 向上移动10像素 */
            }
          }

        }

        .el-image {
          width 100%
          height 100%
          overflow visible

          img {
            height 240px
          }

          .el-image-viewer__wrapper {
            img {
              width auto
              height auto
            }
          }

          .image-slot {
            display flex
            flex-flow column
            justify-content center
            align-items center
            height 100%
            min-height 200px
            color #ffffff
            height 240px

            .iconfont {
              font-size 50px
              margin-bottom 10px
            }
          }
        }

        .el-image.upscale {
          max-height 310px

          img {
            height 310px
          }

          .el-image-viewer__wrapper {
            img {
              width auto
              height auto
            }
          }
        }
      }
    }

  }

  .mj-list-item-prompt {
    .el-icon {
      margin-left 10px
      cursor pointer
      position relative
    }
  }

  .custom-scroll {
    /* 修改滚动条的颜色 */

    ::-webkit-scrollbar {
      width: 8px; /* 滚动条宽度 */
    }

    /* 修改滚动条轨道的背景颜色 */

    ::-webkit-scrollbar-track {
      background-color: #282C34;
    }

    /* 修改滚动条的滑块颜色 */

    ::-webkit-scrollbar-thumb {
      background-color: #444444;
      border-radius 8px
    }

    /* 修改滚动条的滑块的悬停颜色 */

    ::-webkit-scrollbar-thumb:hover {
      background-color: #666666;
    }
  }

</style>

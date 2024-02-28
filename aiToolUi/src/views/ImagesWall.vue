<template>
  <div class="page-images-wall">
    <div class="inner custom-scroll">
      <div class="header">
        <h2>AI 绘画作品墙</h2>
        <div class="settings">
          <el-radio-group >
            <el-radio label="mj" size="large">MidJourney</el-radio>
            <el-radio label="sd" size="large">Stable Diffusion</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="waterfall" id="waterfall-box">
        <v3-waterfall >
          <template #default="slotProp">
            <div class="list-item">
              <div class="image">
                <el-image >
                  <template #placeholder>
                    <div class="image-slot">
                      正在加载图片
                    </div>
                  </template>

                  <template #error>
                    <div class="image-slot">
                      <el-icon>
                        <Picture/>
                      </el-icon>
                    </div>
                  </template>
                </el-image>
              </div>
              <div class="prompt">
                <span></span>
                <el-icon class="copy-prompt">
                  <DocumentCopy/>
                </el-icon>
              </div>
            </div>
          </template>
        </v3-waterfall>

        <div class="footer" v-if="isOver">
          <span>没有更多数据了</span>
          <i class="iconfont icon-face"></i>
        </div>

      </div>
    </div>
    <!-- 任务详情弹框 -->
    <el-dialog v-model="showTaskDialog" title="绘画任务详情">
      <el-row >
        <el-col >
          <div class="img-container">
            <el-image fit="contain">
              <template #placeholder>
                <div class="image-slot">
                  正在加载图片
                </div>
              </template>

              <template #error>
                <div class="image-slot">
                  <el-icon>
                    <Picture/>
                  </el-icon>
                </div>
              </template>
            </el-image>
          </div>
        </el-col>
      </el-row>

    </el-dialog>
  </div>
</template>


<style lang="stylus">

.page-images-wall {
  display: flex;
  background-color: #282c34;

  .inner {
    width 100%
    color #ffffff
    overflow hidden

    .header {
      display flex
      padding 0 40px

      h2 {
        width 300px
      }

      .settings {
        width 100%
        display flex
        justify-content right

        .el-radio-group {
          font-size 16px

          .el-radio {
            color #ffffff
          }

        }
      }
    }

    .waterfall {
      position: relative;
      margin: 0 auto;
      overflow-y auto
      overflow-x hidden

      .list-item {

        .image {
          overflow hidden

          .el-image {
            transition: transform 0.3s;
            cursor pointer
          }
        }

        .prompt {
          display none
          position absolute
          width 180px
          bottom 0
          left 0
          color #ffffff
          padding 10px 10px 20px 10px
          line-height 1.2
          border-top-right-radius 10px
          background-color rgba(10, 10, 10, 0.7)

          span {
            word-break break-all
          }

          .el-icon {
            position absolute
            bottom 10px
            right 10px
            cursor pointer
            border 1px solid #ffffff
            border-radius 5px
            padding 2px
            font-size 12px;

            &:hover {
              background-color #999999
            }
          }
        }

        &:hover {
          .prompt {
            display block
            animation: expandUp 0.3s ease-in-out forwards;
            transform-origin: bottom center;
            transform: scaleY(0); /* 初始状态，元素高度为0 */
          }

          .image {
            .el-image {
              transform: scale(1.2); /* 放大图像到1.2倍大小 */
            }
          }
        }
      }

    }


    .footer {
      display flex
      padding 20px
      align-items center
      justify-content center

      .iconfont {
        margin-left 6px
      }
    }
  }

.el-overlay-dialog {
  .el-dialog {
    background-color #1a1b1e

    .el-dialog__header {
      .el-dialog__title {
        color #F5F5F5
      }
    }

    .el-dialog__body {
      padding 0 0 0 15px !important
      display flex
      height 100%

      .el-row {
        width 100%

        .img-container {
          display flex
          justify-content center

          .image-slot {
            display flex
            height 100vh
            align-items center
            justify-content center

            .el-icon {
              font-size 60px
            }
          }
        }

        .task-info {
          background-color #25262b
          padding 1rem 1.5rem

          .info-line {
            width 100%

            .prompt {
              background-color #35363b
              padding 10px
              color #999999
              overflow auto
              max-height 100px
              min-height 50px

              position relative

              .el-icon {
                position absolute
                right 10px
                bottom 10px
                cursor pointer
              }
            }

            .wrapper {
              margin-top 10px
              display flex

              label {
                display flex
                width 100px
                color #a5a5a5
              }

              .item-value {
                display flex
                width 100%
                background-color #35363b
                padding 2px 5px
                border-radius 5px
                color #F5F5F5
              }
            }

          }

          .copy-params {
            padding 20px 0 10px 0

            .el-button {
              width 100%
            }
          }
        }
      }

      // end el-row

    }
  }
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

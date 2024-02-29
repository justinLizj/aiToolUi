<script>
import { ref } from 'vue';

import {reactive} from 'vue'
import {onMounted} from 'vue'
import axios from 'axios'
import { MessageApi,Card,Dialog,Icon  } from 'vue3-dxui'

export default {
  components: {
    Card,
    Dialog,
    Icon
  },
  setup() {
    debugger;
    const models = [
      {text: "补水模式", value: " --v 6", img: "/images/mj/hzp_mx2.png"},
    ]
    let isLoading = ref(false);
    let normalViaible = ref(false);
    let buttonViaible = false;
    let imageUrl = ref(null);

    const params = ref({
      model: models[0].value,
      count:2,
      quality:2,
      windowImage:""
    })


    let data = reactive({
      msg: "hell",
      urlImages: [
      ],
      photos: [
      //         {
      //   id: 1,
      //   title: "",
      //   path: img1,
      //   sort: 0
      // }
      ],
      resultPhotos: [
      // {
      //   id: 1,
      //   title: "",
      //   path: imgResult1,
      //   sort: 0
      // }
      ],
      resultUrlImages: [
      ],

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
        // data.photos.forEach(function(item, index, arr) {
        //
        //   if (item.id == target.id) {
        //     arr[index] = source;
        //   }
        //   if (item.id == source.id) {
        //     arr[index] = target;
        //   }
        //   arr[index].sort = (index + 1) * 10;
        // })

      },
      uploadPhoto: function(event) {

        let formData = new FormData()   //将文件转为FormData格式
        let file = event.target.files[0]
        formData.append('file', file)

        let me = this;

        /*let r = new FileReader();
        r.readAsDataURL(event.target.files[0]);
        r.onload = function(e) {
          let len = data.photos.length + 1;
          if(len > 5){
            MessageApi.open({
              type:'error',
              duration: 3000,
              content: '图片不能超过5个!'
            })
          } else {
            data.photos.push({
              id: len,
              title: "",
              path: this.result,
              sort: len
            });
            data.urlImages.push(response.data.file)
          }
          //上传至服务器代码...
        }*/


        axios({
          url: 'http://127.0.0.1:8000/api/comfyui/fileList', //后端提供的接口
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          console.log(response.data.file); // 处理返回的数据

          let r = new FileReader();
          r.readAsDataURL(event.target.files[0]);
          r.onload = function(e) {
            let len = data.photos.length + 1;
            if(len > 5){
              MessageApi.open({
                type:'error',
                duration: 3000,
                content: '图片不能超过5个!'
              })
            } else {
              debugger;
              data.photos.push({
                id: len,
                title: "",
                path: this.result,
                sort: len
              });
              data.urlImages.push(response.data.file)
              // debugger;
              // imageUrl.value = response.data.file;
              // me.handleClickCloseButton();
            }
            //上传至服务器代码...
          }
        }).catch(error => {
          console.error(error); // 处理错误信息
        });
      },
      deletePhoto: function(id) {
        data.photos.forEach(function(item, index, arr) {
          if (item.id === id) {
            data.photos.splice(index, 1);
            data.urlImages.splice(index, 1);
          }
        })
        normalViaible.value = !normalViaible.value;
      },
      changeModel : function(item){
        params.value.model = item.value
      },
      replaceMaquillageToBackground(){
        // debugger;
        MessageApi.open({
          type:'success',
          duration: 3000,
          content: '开始执行绘画任务!'
        })
        isLoading.value = true;
        data.resultPhotos = [];

        this.replaceMaquillageToBackgroundSingle(0,data.urlImages.length)

      },
      replaceMaquillageToBackgroundSingle(index,lenImage){
        let me = this;

        if(lenImage > index){

        } else {
          console.log("else-replaceMaquillageToBackgroundSingle");
          MessageApi.open({
            type:'success',
            duration: 3000,
            content: '任务执行完毕!'
          });
          isLoading.value = false;
          return;
        }

        // urlImage = data.urlImages[index]
        axios.get("http://127.0.0.1:8000/api/comfyui/replaceMaquillageToBackground", {
          params: {
            imageUrl: data.urlImages[index]
          }
        }).then((response) => {
          console.log(response.data);
          const imagePath = '../../public/filelist/'+response.data; // 替换为实际的图片路径

          let len = data.resultPhotos.length + 1;
          data.resultPhotos.push({
            id: len,
            title: "",
            path: imagePath,
            sort: len
          });
          if(lenImage > index){
            console.log("if-replaceMaquillageToBackgroundSingle");
            me.replaceMaquillageToBackgroundSingle(index+1,lenImage);
          } else {

          }
        }).catch(function (response) {
          console.log(response)
          MessageApi.open({
            type:'error',
            duration: 3000,
            content: '任务执行失败!'
          })
        });
      },
      handleClickCloseButton(){
        debugger;
        normalViaible.value = !normalViaible.value;
      },
      showImage(id){
        imageUrl.value =data.urlImages[id-1];
        this.handleClickCloseButton();
      },
      showResultImage(id){
        imageUrl.value =data.resultPhotos[id-1].path;
        this.handleClickCloseButton();
      }

    })

    onMounted(() => {
      window.document.getElementById("appId").style.height=(window.innerHeight-140) + "px";
      window.document.getElementById("uploadId").style.height=(window.innerHeight/2-70) + "px";
      window.document.getElementById("resultId").style.height=(window.innerHeight/2-70) + "px";
      window.document.getElementById("wrapperId").style.width=(window.innerWidth-450) + "px";
      window.document.getElementById("runId").style.width=(window.innerWidth-450) + "px";
    });

    return {
      models,
      imageUrl,
      data,
      funcs,
      params,
      isLoading,
      normalViaible,
      buttonViaible
    };
  },
};

</script>

<template>
  <div class="page-mj">
    <div class="inner">
      <Card hover="boxShadow" style="width:350px;background-color: #D5D5D5FF">
      <div class="mj-box">
        <h2>创作中心</h2>

        <div class="app" id="appId" style="height: 500px">
          <div class="mj-params" style="height: 100%;width:280px">
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
                  <el-col :span="24" v-for="item in models" :key="item.value">
                      <div :class="item.value === params.model ? 'model active' : 'model'" @click="funcs.changeModel(item)">
                        <el-image :src="item.img" fit="cover" :width="100" :height="60"></el-image>
                        <div class="text">{{ item.text }}</div>
                      </div>
                  </el-col>
                </el-row>
              </div>


              <div class="param-line" style="padding-top: 10px">
                <el-form-item label="生成数量" >
                  <template #default>
                    <div class="form-item-inner">
                      <el-slider v-model.number="params.count" :min="1" :max="5" :step="1"
                                 style="width: 180px;--el-slider-main-bg-color:#4e6df8"/>
                      <el-tooltip effect="light"
                                  content="参数用法："
                                  raw-content placement="right">
                        <el-icon>
                          <InfoFilled/>
                        </el-icon>
                      </el-tooltip>
                    </div>
                  </template>
                </el-form-item>
              </div>

              <div class="param-line" style="padding-top: 10px">
                <el-form-item label="图片倍率" label-color="black">
                  <template #default>
                    <div class="form-item-inner">
                      <el-slider v-model.number="params.quality" :min="1" :max="3" :step="0.1"
                                 style="width: 180px;--el-slider-main-bg-color:#4e6df8"/>
                      <el-tooltip effect="light"
                                  content="参数用法：--chaos 或--c，取值范围: 0-100 <br/> 取值越高结果越发散，反之则稳定收敛<br /> 默认值0最为精准稳定"
                                  raw-content placement="right">
                        <el-icon>
                          <InfoFilled/>
                        </el-icon>
                      </el-tooltip>
                    </div>
                  </template>
                </el-form-item>
              </div>

            </el-form>
          </div>
        </div>
        <div class="divider"></div>
        <div class="dividerKong"></div>

        <el-button style="width:270px; color: #ffffff; font-weight: bold;" color="#4e6df8" :dark="false" @click="funcs.replaceMaquillageToBackground()" round>立即生成</el-button>
      </div>

      </Card>

      <div class="task-list-box">
        <div class="task-list-inner" >
          <h2>AI绘画</h2>
                <div class="text">
                </div>
          <Card hover="boxShadow">
                <div class="app" id="uploadId" style="height: 200px">
                    <div class="upload-wrapper" id="wrapperId">
                      <div class="item-wrapper landscape"
                           v-for="item in data.photos"
                           :id="item.id"
                           :key="item.id"
                           draggable="true"
                           @dragstart.stop="funcs.drag($event)"
                           @dragend="funcs.dragend($event)"
                           @dragover="funcs.dragover(item.id,$event)"
                           @dragleave="funcs.dragleave(item.id)"
                           @drop="funcs.drop(item.id,$event)"
                           @click="funcs.showImage(item.id)"
                           :style="'background-image: url('+item.path+')'"
                      >
                        <Card hover='enlarge boxShadow' style="background-color:rgba(255,0,0,0)">
                          <div class="item"  ></div>

                          <div class="del" @click="funcs.deletePhoto(item.id)">
                            <Icon iconName='x-circle' style="color:black"/>
                          </div>
                        </Card>
                      </div>
                    </div>
                </div>
          </Card>

          <div class="text">
          </div>
                <div class="upload-btn"><input type="file" accept="image/*"  @change="funcs.uploadPhoto($event)">选 择 图 片</div>


          <h2>结果列表</h2>
          <Card hover="boxShadow">
          <div v-loading="isLoading" element-loading-background="rgba(0, 0, 0, 0.3)">
            <div class="app" id="resultId" style="height: 200px">
              <div class="running-job-list" id="runId">
                <div class="upload-wrapper">
                  <div class="item-wrapper landscape"
                       :id="item.id"
                       v-for="item in data.resultPhotos" :key="item.id"
                       draggable="true"
                       :style="'background-image: url('+item.path+')'"
                       @click="funcs.showResultImage(item.id)"
                  >
                    <Card hover='enlarge boxShadow' style="background-color:rgba(255,0,0,0)">
                      <div class="item"  ></div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </Card>


        </div>
      </div>
    </div>

  </div>


  <Dialog
      :visible="normalViaible"
      title=""
      @cancel="funcs.handleClickCloseButton"
      :showConfirmButton="buttonViaible"
      :showCancelButton="buttonViaible"
      width="auto">
      <div class="image-container">
        <img :src="imageUrl" alt="Your Image"> <!-- 这里替换为你的图片路径 -->
      </div>
  </Dialog>
</template>

<style lang="stylus">
  .image-container {
    width: 100%; /* 设置容器宽度为100% */
    height: auto; /* 高度根据宽度进行自适应调整 */
    overflow: hidden; /* 超出部分隐藏 */
  }

  .image-container img {
    max-width: 100%; /* 最大宽度不能超过容器宽度 */
    max-height: 100%; /* 最大高度不能超过容器高度 */
    object-fit: contain; /* 保持原始比例并居中显示 */
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
    background-color: #F6F6F6FF;

    .inner {
      display: flex;

      .mj-box {
        /*margin:10px*/
        background-color: #D5D5D5FF
        border:1px solid #D5D5D5FF
        min-width:300px
        max-width:300px
        padding:10px
        border-radius:10px
        color:#000000;
        font-size:14px

        h2 {
          font-weight: bold;
          font-size: 20px
          text-align: center
          color: #000000
        }

        .divider {
          border-bottom: 1px solid #FFFFFF
          width: 100%
          height: 10px
        }
        .dividerKong {
          border-bottom: 0px solid #FFFFFF
          width: 80%
          height: 10px
        }

        ::-webkit-scrollbar {
          width: 0;
          height: 0;
          background-color: transparent;
        }

        .mj-params {
          margin-top:10px
          overflow:auto


          .param-line {
            padding: 0 10px

            .el-icon {
              position: relative
            }

            .grid-content {
              background-color: #383838
              border-radius: 5px
              padding: 8px 14px
              display: flex
              cursor: pointer
              margin-bottom: 10px;

              &:hover {
                background-color: #585858
              }

              .icon {
                width: 20px
                height: 20px
                margin-bottom: 5px
              }

              .shape {
                width: 16px
                height: 16px
                margin-bottom: 5px
                border: 1px solid #C4C4C4
                border-radius: 3px
              }

              .shape.size9-16 {
                width: 9px
                height: 16px
              }

              .shape.size16-9 {
                height: 9px
                width: 16px
                position: relative
                margin: 4px 0 7px
              }

              .shape.size3-4 {
                width: 12px
                height: 16px
              }

              .shape.size4-3 {
                height: 12px
                width: 16px
                position: relative
                margin: 4px 0 4px
              }

              .shape.size2-3 {
                width: 11px
                height: 16px
              }

              .shape.size3-2 {
                height: 11px
                width: 16px
                position: relative
                margin: 4px 0 5px
              }

              .shape.size1-2 {
                width: 8px
                height: 16px
              }

              .shape.size2-1 {
                height: 8px
                width: 16px
                position: relative
                margin: 4px 0 8px
              }
            }


            .grid-content.active {
              color: #4e6df8
              background-color: #585858

              .shape {
                border: 1px solid #4e6df8
              }
            }

            .model {
              background-color:#383838;
              border:1px solid #454545;
              border-radius:5px;
              padding:10px;
              margin-bottom:10px;
              margin-right:10px;
              display:flex;
              flex-flow:column;
              align-items:center;
              cursor:pointer;


              .el-image {
                height:60px;
                width:100%;
              }

              .text {
                margin-top:6px
              }

            }

            .model.active {
              color:#000000;
              background-color: #D0D0D0FF;
              border:1px solid #000000;
            }

            .form-item-inner {
              display: flex
              align-items: center

              .el-select {
                --el-select-input-focus-border-color: #4e6df8;
                --el-input-focus-border-color: #4e6df8;
              }

              .el-input__wrapper {
                background: #383838;
              }

              .el-input__inner {
                color: #fff
              }

              .el-icon {
                margin-left: 10px
              }
            }

            .img-uploader {
              .el-upload {
                border: 1px dashed var(--el-border-color);
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                width: 100%
                transition: var(--el-transition-duration-fast);

                &:hover {
                  border-color: var(--el-color-primary);
                }

                .el-icon.uploader-icon {
                  font-size: 28px;
                  color: #8c939d;
                  width: 100%;
                  height: 120px;
                  text-align: center;
                }
              }
            }

          }

          .param-line.pt {
            display: flex;
            align-items: center;
            padding-top:5px;
            padding-bottom:5px;
          }
        }



          .app{
            overflow: scroll;
          }
          /* 滚动条样式 */
          .app::-webkit-scrollbar {
            width: 0px; /*  设置纵轴（y轴）轴滚动条 */
            height: 0px; /*  设置横轴（x轴）轴滚动条 */
          }
          /* 滚动条滑块（里面小方块） */
          .app::-webkit-scrollbar-thumb {
            border-radius: 10px;
            box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: rgba(0,0,0,0.2);
          }
          /* 滚动条轨道 */
          .app::-webkit-scrollbar-track {
            border-radius: 0;
            box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: rgba(0,0,0,0.1);
          }

          /* hover时显色 */
          .app:hover::-webkit-scrollbar {
            width: 4px;
            height: 0px;
          }
      }

      .el-form {
        .el-form-item__label {
          color: #000000
        }

        .el-input, .el-slider {
          width: 180px
        }
      }

      .task-list-box {
        width: 100%
        padding: 10px
        color: #ffffff
        overflow-x: hidden

        h2 {
           font-weight: bold;
           font-size: 20px;
           color: #000000;
        }
        .task-list-inner {
          .el-tabs {
            --el-tabs-header-height: 55px;
          }


          .el-tabs__item {
            color: #fff;
            font-size: 18px;
          }

          .title-tabs .el-tabs__item.is-active {
            color: #4e6df8;
            font-size: 18px;
          }

          .title-tabs .el-tabs__active-bar {
            background-color: #4e6df8;
          }

          .title-tabs .el-tabs__content {
            padding: 10px 0;
          }

          .el-textarea {
            --el-input-focus-border-color: #4e6df8;
          }

          .el-textarea__inner {
            background: transparent;
            color: #fff;
          }

          .el-input__wrapper {
            background: transparent;
            padding: 5px
          }

          .text {
            margin-bottom: 10px;
            color: #6b778c;
            font-size: 15px
          }

          .param-line.pt {
            padding-top: 5px
            padding-bottom: 5px
          }

          .form-item-inner {
            display: flex
            align-items: center

            .el-icon {
              margin-left: 10px
            }
          }

          .el-form-item__label {
            color: #ffffff
          }

          .img-uploader {
            .el-upload {
              border: 1px dashed var(--el-border-color);
              border-radius: 6px;
              cursor: pointer;
              position: relative;
              overflow: hidden;
              width: 300px;
              transition: var(--el-transition-duration-fast);
              margin-bottom: 20px;

              &:hover {
                border-color: var(--el-color-primary);
              }

              .el-icon.uploader-icon {
                font-size: 28px
                color: #8c939d
                width: 100%
                height: 120px
                text-align: center
              }
            }
          }

          .submit-btn {
            display: flex
            margin: 20px 0

            .el-button {
              width: 200px
            }

            .text-info {
              width: 100%
              display: flex
              justify-content: right
              align-items: center
            }
          }


          .upload-wrapper{display: flex;flex-wrap:wrap;padding: 0.5%;}
          .upload-wrapper .item-wrapper{width: 19%; background-color: bisque;margin: 0.5%; position: relative;background-repeat: no-repeat;background-position: 50% 50%;}
          .upload-wrapper .item-wrapper,.landscape{background-size: 100% auto;}
          .upload-wrapper .item-wrapper .del{position: absolute; right: 0; top: 0; width: 20px; height: 20px;color: #fff;line-height: 20px;cursor: pointer}
          .upload-wrapper .item-wrapper .item{padding: 100% 50% 0% 0%;}
          .upload-wrapper .hover{opacity: 0.3;}

          .upload-btn{overflow: hidden;background-color: #4e6df8;position: relative; height: 30px;border-radius: 10px;  font-family: Arial, sans-serif; /* 修改字体 */
            text-align: center; /* 居中文本 */
            display: flex; /* 使用Flexbox布局 */
            justify-content: center; /* 水平居中 */
            align-items: center; /* 垂直居中 */}
          .upload-btn input{opacity: 0.01;width: 100%; height: 100%;position: absolute;}

          .app{
            height: 500px;
            overflow: scroll;
          }
          /* 滚动条样式 */
          .app::-webkit-scrollbar {
            width: 0px; /*  设置纵轴（y轴）轴滚动条 */
            height: 0px; /*  设置横轴（x轴）轴滚动条 */
          }
          /* 滚动条滑块（里面小方块） */
          .app::-webkit-scrollbar-thumb {
            border-radius: 10px;
            box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: rgba(0,0,0,0.2);
          }
          /* 滚动条轨道 */
          .app::-webkit-scrollbar-track {
            border-radius: 0;
            box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
            background: rgba(0,0,0,0.1);
          }

          /* hover时显色 */
          .app:hover::-webkit-scrollbar {
            width: 4px;
            height: 0px;
          }
        }

        .running-job-list {
          .job-item {
            //border: 1px solid #454545;
            width: 100%;
            padding: 2px
            background-color: #555555

            .job-item-inner {
              position: relative
              height: 100%
              overflow: hidden

              .progress {
                position: absolute
                width: 100%
                height: 100%
                top: 0
                left: 0
                display: flex
                justify-content: center
                align-items: center

                span {
                  font-size: 20px
                  color: #ffffff
                }
              }
            }
          }
        }


        .finish-job-list {
          .job-item {
            width: 100%
            height: 100%
            border: 1px solid #666666
            padding: 6px
            overflow: hidden
            border-radius: 6px
            transition: all 0.3s ease; /* 添加过渡效果 */
            position: relative

            .opt {
              .opt-line {
                margin: 6px 0

                ul {
                  display: flex
                  flex-flow: row

                  li {
                    margin-right: 6px

                    a {
                      padding: 3px 0
                      width: 40px
                      text-align: center
                      border-radius: 5px
                      display: block
                      cursor: pointer
                      background-color: #4E5058
                      color: #ffffff

                      &:hover {
                        background-color: #6D6F78
                      }
                    }
                  }

                  .show-prompt {
                    font-size: 20px
                    cursor: pointer
                  }
                }
              }
            }

            .remove {
              display: none
              position: absolute
              right: 10px
              top: 10px
            }

            &:hover{
              .remove {
                display: block
              }
            }
          }


          .animate {
            &:hover {
              box-shadow: 0 0 10px rgb(9, 40, 248); /* 添加阴影效果 */
              transform: translateY(-10px); /* 向上移动10像素 */
            }
          }

        }

        .el-image {
          width: 100%
          height: 100%
          overflow: visible

          img {
            height: 240px
          }

          .el-image-viewer__wrapper {
            img {
              width: auto
              height: auto
            }
          }

          .image-slot {
            display: flex
            flex-flow: column
            justify-content: center
            align-items: center
            height: 100%
            min-height: 200px
            color: #ffffff
            height: 240px

            .iconfont {
              font-size: 50px
              margin-bottom: 10px
            }
          }
        }

        .el-image.upscale {
          max-height: 310px

          img {
            height: 310px
          }

          .el-image-viewer__wrapper {
            img {
              width: auto
              height: auto
            }
          }
        }
      }
    }

  }

  .mj-list-item-prompt {
    .el-icon {
      margin-left: 10px
      cursor: pointer
      position: relative
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
      border-radius: 8px
    }

    /* 修改滚动条的滑块的悬停颜色 */

    ::-webkit-scrollbar-thumb:hover {
      background-color: #666666;
    }
  }
  .dx-card-warpper .dx-card-content {
    padding: 0px;
  }
</style>

<template>
  <div class="system-config" v-loading="loading">

    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="基本设置" name="basic">
        <div class="container">
          <el-form :model="system" label-width="150px" label-position="right" ref="systemFormRef" :rules="rules">
            <el-form-item label="网站标题" prop="title">
              <el-input v-model="system['title']"/>
            </el-form-item>
            <el-form-item label="控制台标题" prop="admin_title">
              <el-input v-model="system['admin_title']"/>
            </el-form-item>
            <el-form-item label="注册赠送对话次数" prop="user_init_calls">
              <el-input v-model.number="system['init_chat_calls']" placeholder="新用户注册赠送对话次数"/>
            </el-form-item>
            <el-form-item label="注册赠送绘图次数" prop="init_img_calls">
              <el-input v-model.number="system['init_img_calls']" placeholder="新用户注册赠送绘图次数"/>
            </el-form-item>
            <el-form-item label="邀请赠送对话次数" prop="invite_chat_calls">
              <el-input v-model.number="system['invite_chat_calls']" placeholder="邀请新用户注册赠送对话次数"/>
            </el-form-item>
            <el-form-item label="邀请赠送绘图次数" prop="invite_img_calls">
              <el-input v-model.number="system['invite_img_calls']" placeholder="邀请新用户注册赠送绘图次数"/>
            </el-form-item>
            <el-form-item label="VIP每月对话次数" prop="vip_month_calls">
              <el-input v-model.number="system['vip_month_calls']" placeholder="VIP用户每月赠送对话次数"/>
            </el-form-item>
            <el-form-item label="VIP每月绘图次数" prop="vip_month_img_calls">
              <el-input v-model.number="system['vip_month_img_calls']" placeholder="VIP用户每月赠送绘图次数"/>
            </el-form-item>

            <el-form-item label="开放注册" prop="enabled_register">
              <el-switch v-model="system['enabled_register']"/>
              <el-tooltip
                  effect="dark"
                  content="关闭注册之后只能通过管理后台添加用户"
                  raw-content
                  placement="right"
              >
                <el-icon>
                  <InfoFilled/>
                </el-icon>
              </el-tooltip>
            </el-form-item>

            <el-form-item label="注册方式" prop="register_ways">
              <el-checkbox-group v-model="system['register_ways']">
                <el-checkbox label="mobile">手机注册</el-checkbox>
                <el-checkbox label="email">邮箱注册</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="启用众筹功能" prop="enabled_reward">
              <el-switch v-model="system['enabled_reward']"/>
              <el-tooltip
                  effect="dark"
                  content="如果关闭次功能将不在用户菜单显示众筹二维码"
                  raw-content
                  placement="right"
              >
                <el-icon>
                  <InfoFilled/>
                </el-icon>
              </el-tooltip>
            </el-form-item>

            <div v-if="system['enabled_reward']">
              <el-form-item label="单次对话价格" prop="chat_call_price">
                <el-input v-model="system['chat_call_price']" placeholder="众筹金额跟对话次数的兑换比例"/>
              </el-form-item>
              <el-form-item label="单次绘图价格" prop="img_call_price">
                <el-input v-model="system['img_call_price']" placeholder="众筹金额跟绘图次数的兑换比例"/>
              </el-form-item>
              <el-form-item label="收款二维码" prop="reward_img">
                <el-input v-model="system['reward_img']" placeholder="众筹收款二维码地址">
                  <template #append>
                    <el-upload
                        :auto-upload="true"
                        :show-file-list="false"
                        @click="beforeUpload('reward_img')"
                        :http-request="uploadImg"
                    >
                      <el-icon class="uploader-icon">
                        <UploadFilled/>
                      </el-icon>
                    </el-upload>
                  </template>
                </el-input>
              </el-form-item>
            </div>

            <el-form-item label="微信客服二维码" prop="wechat_card_url">
              <el-input v-model="system['wechat_card_url']" placeholder="微信客服二维码">
                <template #append>
                  <el-upload
                      :auto-upload="true"
                      :show-file-list="false"
                      @click="beforeUpload('wechat_card_url')"
                      :http-request="uploadImg"
                  >
                    <el-icon class="uploader-icon">
                      <UploadFilled/>
                    </el-icon>
                  </el-upload>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="订单超时时间" prop="order_pay_timeout">
              <div class="tip-input">
                <el-input v-model.number="system['order_pay_timeout']" placeholder="单位：秒"/>
                <div class="info">
                  <el-tooltip
                      effect="dark"
                      content="系统会定期清理超时未支付的订单<br/>默认值：900秒"
                      raw-content
                      placement="right"
                  >
                    <el-icon>
                      <InfoFilled/>
                    </el-icon>
                  </el-tooltip>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="会员充值说明" prop="order_pay_info_text">
              <el-input
                  v-model="system['order_pay_info_text']"
                  :autosize="{ minRows: 3, maxRows: 10 }"
                  type="textarea"
                  placeholder="请输入会员充值说明文字，比如介绍会员计划"
              />
            </el-form-item>

            <el-form-item label="默认AI模型" prop="default_models">
              <template #default>
                <div class="tip-input">
                  <el-select
                      v-model="system['default_models']"
                      multiple
                      :filterable="true"
                      placeholder="选择AI模型，多选"
                      style="width: 100%"
                  >
                    <el-option
                        v-for="item in models"
                        :key="item.id"
                        :label="item.name"
                        :value="item.value"
                    />
                  </el-select>
                  <div class="info">
                    <el-tooltip
                        class="box-item"
                        effect="dark"
                        content="新用户注册默认开通的 AI 模型"
                        placement="right"
                    >
                      <el-icon>
                        <InfoFilled/>
                      </el-icon>
                    </el-tooltip>
                  </div>
                </div>
              </template>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="save('system')">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="模型配置" name="chat">
        <div class="container">
          <el-form :model="chat" label-position="right" label-width="150px" ref="chatFormRef" :rules="rules">
            <el-form-item label="开启聊天上下文">
              <el-switch v-model="chat['enable_context']"/>
            </el-form-item>
            <el-form-item label="保存聊天记录">
              <el-switch v-model="chat['enable_history']"/>
            </el-form-item>
            <el-form-item label="会话上下文深度">
              <div style="width:100%">
                <el-input-number v-model="chat['context_deep']" :min="0" :max="10"/>
              </div>
              <div class="tip" style="margin-top: 10px; ">会话上下文深度：在老会话中继续会话，默认加载多少条聊天记录作为上下文。如果设置为
                0
                则不加载聊天记录，仅仅使用当前角色的上下文。该配置参数最好设置需要为偶数，否则将无法兼容百度的 API。
              </div>
            </el-form-item>

            <el-divider content-position="center">OpenAI</el-divider>
            <el-form-item label="模型创意度">
              <el-slider v-model="chat['open_ai']['temperature']" :max="2" :step="0.1"/>
              <div class="tip">值越大 AI 回答越发散，值越小回答越保守，建议保持默认值</div>
            </el-form-item>
            <el-form-item label="最大响应长度">
              <el-input v-model.number="chat['open_ai']['max_tokens']" placeholder="回复的最大字数，最大4096"/>
            </el-form-item>

            <el-divider content-position="center">Azure</el-divider>
            <el-form-item label="模型创意度">
              <el-slider v-model="chat['azure']['temperature']" :max="2" :step="0.1"/>
              <div class="tip">值越大 AI 回答越发散，值越小回答越保守，建议保持默认值</div>
            </el-form-item>
            <el-form-item label="最大响应长度">
              <el-input v-model.number="chat['azure']['max_tokens']" placeholder="回复的最大字数，最大4096"/>
            </el-form-item>

            <el-divider content-position="center">ChatGLM</el-divider>
            <el-form-item label="模型创意度">
              <el-slider v-model="chat['chat_gml']['temperature']" :max="1" :step="0.01"/>
              <div class="tip">值越大 AI 回答越发散，值越小回答越保守，建议保持默认值</div>
            </el-form-item>
            <el-form-item label="最大响应长度">
              <el-input v-model.number="chat['chat_gml']['max_tokens']" placeholder="回复的最大字数，最大4096"/>
            </el-form-item>

            <el-divider content-position="center">文心一言</el-divider>
            <el-form-item label="模型创意度">
              <el-slider v-model="chat['baidu']['temperature']" :max="1" :step="0.01"/>
              <div class="tip">值越大 AI 回答越发散，值越小回答越保守，建议保持默认值</div>
            </el-form-item>
            <el-form-item label="最大响应长度">
              <el-input v-model.number="chat['baidu']['max_tokens']" placeholder="回复的最大字数，最大4096"/>
            </el-form-item>

            <el-divider content-position="center">讯飞星火</el-divider>
            <el-form-item label="模型创意度">
              <el-slider v-model="chat['xun_fei']['temperature']" :max="1" :step="0.1"/>
              <div class="tip">值越大 AI 回答越发散，值越小回答越保守，建议保持默认值</div>
            </el-form-item>
            <el-form-item label="最大响应长度">
              <el-input v-model.number="chat['xun_fei']['max_tokens']" placeholder="回复的最大字数，最大4096"/>
            </el-form-item>

            <el-divider content-position="center">AI绘图</el-divider>
            <el-form-item label="DALL-E3出图数量">
              <el-input v-model.number="chat['dall_img_num']" placeholder="调用 DALL E3 API 传入的出图数量"/>
            </el-form-item>
            <el-form-item style="text-align: right">
              <el-button type="primary" @click="save('chat')">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="公告配置" name="notice">
        <md-editor class="mgb20" v-model="notice" @on-upload-img="onUploadImg"/>
        <el-form-item>
          <el-button type="primary" @click="save('notice')">保存</el-button>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {httpGet, httpPost} from "@/utils/http";
import Compressor from "compressorjs";
import {ElMessage} from "element-plus";
import {InfoFilled, UploadFilled} from "@element-plus/icons-vue";
import MdEditor from "md-editor-v3";
import 'md-editor-v3/lib/style.css';

const activeName = ref('basic')
const system = ref({models: []})
const chat = ref({
  open_ai: {temperature: 1, max_tokens: 1024},
  azure: {temperature: 1, max_tokens: 1024},
  chat_gml: {temperature: 0.95, max_tokens: 1024},
  baidu: {temperature: 0.95, max_tokens: 1024},
  xun_fei: {temperature: 0.5, max_tokens: 1024},
  context_deep: 0,
  enable_context: true,
  enable_history: true,
  dall_api_url: "",
})
const loading = ref(true)
const systemFormRef = ref(null)
const chatFormRef = ref(null)
const models = ref([])
const notice = ref("")

onMounted(() => {
  // 加载系统配置
  httpGet('/api/admin/config/get?key=system').then(res => {
    system.value = res.data
  }).catch(e => {
    ElMessage.error("加载系统配置失败: " + e.message)
  })

  // 加载聊天配置
  httpGet('/api/admin/config/get?key=chat').then(res => {
    chat.value = res.data
  }).catch(e => {
    ElMessage.error("加载聊天配置失败: " + e.message)
  })

  // 加载聊天配置
  httpGet('/api/admin/config/get?key=notice').then(res => {
    notice.value = res.data['content']
  }).catch(e => {
    ElMessage.error("公告信息失败: " + e.message)
  })

  httpGet('/api/admin/model/list').then(res => {
    models.value = res.data
    loading.value = false
  }).catch(e => {
    ElMessage.error("获取模型失败：" + e.message)
  })

})

const rules = reactive({
  title: [{required: true, message: '请输入网站标题', trigger: 'blur',}],
  admin_title: [{required: true, message: '请输入控制台标题', trigger: 'blur',}],
  init_chat_calls: [{required: true, message: '请输入赠送对话次数', trigger: 'blur'}],
  user_img_calls: [{required: true, message: '请输入赠送绘图次数', trigger: 'blur'}],
})
const save = function (key) {
  if (key === 'system') {
    systemFormRef.value.validate((valid) => {
      if (valid) {
        system.value['img_call_price'] = parseFloat(system.value['img_call_price']) ?? 0
        system.value['chat_call_price'] = parseFloat(system.value['chat_call_price']) ?? 0
        httpPost('/api/admin/config/update', {key: key, config: system.value}).then(() => {
          ElMessage.success("操作成功！")
        }).catch(e => {
          ElMessage.error("操作失败：" + e.message)
        })
      }
    })
  } else if (key === 'chat') {
    if (chat.value.context_deep % 2 !== 0) {
      return ElMessage.error("会话上下文深度必须为偶数！")
    }
    chatFormRef.value.validate((valid) => {
      if (valid) {
        httpPost('/api/admin/config/update', {key: key, config: chat.value}).then(() => {
          ElMessage.success("操作成功！")
        }).catch(e => {
          ElMessage.error("操作失败：" + e.message)
        })
      }
    })
  } else if (key === 'notice') {
    httpPost('/api/admin/config/update', {key: key, config: {content: notice.value, updated: true}}).then(() => {
      ElMessage.success("操作成功！")
    }).catch(e => {
      ElMessage.error("操作失败：" + e.message)
    })
  }
}

const configKey = ref("")
const beforeUpload = (key) => {
  configKey.value = key
}

// 图片上传
const uploadImg = (file) => {
  // 压缩图片并上传
  new Compressor(file.file, {
    quality: 0.6,
    success(result) {
      const formData = new FormData();
      formData.append('file', result, result.name);
      // 执行上传操作
      httpPost('/api/upload', formData).then((res) => {
        system.value[configKey.value] = res.data.url
        ElMessage.success('上传成功')
      }).catch((e) => {
        ElMessage.error('上传失败:' + e.message)
      })
    },
    error(e) {
      ElMessage.error('上传失败:' + e.message)
    },
  });
};

// 编辑期文件上传处理
const onUploadImg = (files, callback) => {
  Promise.all(
      files.map((file) => {
        return new Promise((rev, rej) => {
          const formData = new FormData();
          formData.append('file', file, file.name);
          // 执行上传操作
          httpPost('/api/upload', formData).then((res) => rev(res)).catch((error) => rej(error));
        });
      })
  ).then(res => {
    ElMessage.success({message: "上传成功", duration: 500})
    callback(res.map((item) => item.data.url));
  }).catch(e => {
    ElMessage.error('图片上传失败:' + e.message)
  })


};

</script>

<style lang="stylus" scoped>
@import "@/assets/css/admin/form.styl"
.system-config {
  display flex
  justify-content center

  .el-tabs {
    width 100%
    background-color #ffffff
    padding 10px 20px 40px 20px
    border: 1px solid #ddd;
    border-radius: 5px

    .container {
      .el-form {
        .el-form-item__content {

          .tip-text {
            padding-left 10px;
          }

          .tip {
            color #c1c1c1
            font-size 12px;
            line-height 1.5;
          }

          .el-icon {
            font-size 16px
            margin-left 10px
            cursor pointer
          }

          .uploader-icon {
            font-size 24px
            position relative
            top 3px
          }
        }
      }

      .el-alert {
        margin-bottom 15px;
      }
    }

  }
}
</style>
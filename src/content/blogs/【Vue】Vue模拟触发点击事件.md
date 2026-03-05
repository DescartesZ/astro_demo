---
title: "Vue模拟触发点击事件"
description: "这是一个关于如何使用 Vue 模拟触发点击事件的指南。"
author: "DescartesZ"
pubDate: 2024-12-31
tags:
  ["Vue","模拟点击","前端", "upload"]
---

模拟点击el upload 的上传
``` javascript
// 在Vue2中使用
this.$refs["upload"].$children[0].$el.click();
// 在Vue3中使用
document.querySelector(".upload-resource .el-upload").click();
```
以下以Vue3为例：
``` html
<ElButton type="primary" @click="importAction">上传</ElButton> 
 <el-upload
    ref="uploadRef"
    action="#"
    :on-change="uploadChange"
    :show-file-list="false"
    accept=".xlsx,.xls"
    style="display: none"
    :before-upload="beforeUpload"
  >
    <template #trigger>
      <el-button type="primary" ref="triggerRef">上传文件</el-button>
    </template>
 </el-upload>
```

以上是页面代码在点击ElButton后调用importAction来达到选择文件的目的，选择文件后会触发事件调用beforUpload 和uploadChange来调用api上传文件,由于vue2和vue3的ref使用不一样，经过控制台打印等一系列操作最终寻找到可以利用  triggerRef.value?.$.vnode.el?.click()这句来模拟点击，下面是实现上传功能的部分
```js
let theUploadFile: UploadRawFile
const triggerRef = ref<InstanceType<typeof ElButton>>()
const uploadRef = ref<InstanceType<typeof ElUpload>>()
const importAction = () => {
  //模拟点击上传按钮
  triggerRef.value?.$.vnode.el?.click()
}
 
 
 
const beforeUpload = (file: UploadRawFile) => {
  const isXlsx = file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
  if (!isXlsx) {
    ElMessage.error('导入失败,只能上传xlsx或xls文件!')
    return false
  }
  return true
}
 const importData=async (file: UploadRawFile) => {
      tableObject.loading = true
      const formData = new FormData()
      formData.append('files[]', file)
      formData.append('model', JSON.stringify({}))
      const res = await (config?.importApi && config?.importApi(formData))
      if (res?.Suceess) {
        ElMessage({
          message: '导入成功',
          type: 'success'
        })
      }
      tableObject.loading = false
    }
const uploadChange: UploadProps['onChange'] = async (file: UploadFile) => {
  if (file.raw) {
    theUploadFile = file.raw
    await importData(theUploadFile)
    getList()
  }
}
```

​
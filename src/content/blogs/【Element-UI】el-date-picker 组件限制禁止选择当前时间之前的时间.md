---
title: "【Element-UI】el-date-picker 组件限制禁止选择当前时间之前的时间"
description: "这是一个关于如何使用 Element-UI 中的 el-date-picker 组件限制禁止选择当前时间之前的时间的指南。"
author: "DescartesZ"
pubDate: 2025-02-24
tags:
  ["Element-UI", "时间选择器", "Vue", "前端"]
---
### 页面代码
```html
<el-date-picker
            v-model="xxx.startTime"
            type="datetime"
            placeholder="请选择开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            clearable
            :disabledDate="disabledDateFn"
            :disabled-hours="disabledHours"
            :disabled-minutes="disabledMinutes"
            :disabled-seconds="disabledSeconds"
            :default-value="new Date()"
          >
</el-date-picker>
```
### 核心逻辑
主要对日期与时分秒逐级分离限制，其中分秒需要注意时、分选择的变化，当分钟大于当前分时应放开所有秒的选择，分钟选择限制同理。
```javascript
const disabledDateFn = (time) => {
  //比当前时间小的时间禁用（返回false则禁用）
  return time.getTime() < Date.now() - 24 * 3600 * 1000;
};

const disabledHours = () => {
  const a = [];
  for (let i = 0; i < 24; i++) {
    // 限制 之前 < / 之后 >
    if (new Date().getHours() <= i) continue;
    a.push(i);
  }
  return a;
};
const disabledMinutes = (hour) => {
  // 选择时大于当前时，所有分均可选择
  if (hour > new Date().getHours()) {
    return [];
  }
  const a = [];
  for (let i = 0; i < 60; i++) {
    // 限制 之前 < / 之后 > 
    if (new Date().getMinutes() <= i) continue;
    a.push(i);
  }
  return a;
};
const disabledSeconds = (hour, mins) => {
  // 选择时分大于当前时分时，所有秒均可选择
  if (hour > new Date().getHours()) {
    return [];
  } else if (hour == new Date().getHours() && mins > new Date().getMinutes()) {
    return [];
  }
  
  const a = [];
  for (let i = 0; i < 60; i++) {
    // 限制 之前 < / 之后 > 
    if (new Date().getSeconds() <= i) continue;
    a.push(i);
  }
  return a;
};
```
---
title: "el-tree组件过滤时，不展示筛选目标的子节点"
description: "这是一个关于如何使用 el-tree 组件实现过滤时，不展示筛选目标的子节点的指南。"
author: "DescartesZ"
pubDate: 2025-04-16
tags:
  ["Element-UI", "Vue", "前端", "组件"]
---

### 1.el官方示例过滤方法
```javascript
const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}
```
### 2.修改后的过滤方法
```javascript
/**
 * 树节点过滤
 */
const filterNode = (value, data, node) => {
  if (!value) return true;
  let parentNode = node.parent;
  let labels = [node.label];
  let level = 1;
  while (level < node.level) {
    labels = [...labels, parentNode.label];
    parentNode = parentNode.parent;
    level++;
  }
  return labels.some((label) => label.indexOf(value) !== -1);
};
```

### 参考地址
https://blog.csdn.net/weixin_44072916/article/details/112370398
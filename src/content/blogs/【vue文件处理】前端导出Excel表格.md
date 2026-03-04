---
title: "前端导出Excel表格"
description: "这是一个关于如何在前端导出Excel表格的指南。"
author: "DescartesZ"
pubDate: 2025-02-05
tags:
  ["Excel", "xlsx", "file-saver", "Vue", "前端", "导出Excel"]
---
## 1.主要依赖
`xlsx`+`file-saver`
## 2.核心代码
```javascript
import * as XLSX from 'xlsx';
import FileSaver from "file-saver";
// 导出excel表格
const exportExcel= (table, name = null) => {
  console.log("获取表格", unref(table))
  try {
    let tableDom = unref(table).$el.cloneNode(true);
    let tableHeader = tableDom.querySelector('.el-table__header-wrapper');
    let tableBody = tableDom.querySelector('.el-table__body');

    // 移除左侧checkbox的节点
    let headerDom = tableHeader.childNodes[0].querySelectorAll('th');
    if (headerDom[0].querySelectorAll('.el-checkbox').length > 0) {
      headerDom[0].remove();
    }
    for (let key in headerDom) {
      if (headerDom[key].innerText === '操作') {
        headerDom[key].remove();
      }
    }

    // 清理掉checkbox 和操作的button（如果有）
    let tableList = tableBody.querySelectorAll('td');
    for (let key = 0; key < tableList.length; key++) {
      if (tableList[key].querySelectorAll('.el-checkbox').length > 0 || tableList[key].querySelectorAll('.el-button').length > 0) {
        tableList[key].remove();
      }
    }

    // 处理表头和表体，将其合并成一个完整的表格
    let clonedTable = document.createElement('table');
    clonedTable.appendChild(tableHeader.cloneNode(true));  // 表头
    clonedTable.appendChild(tableBody.cloneNode(true));    // 表体

    // 使用 xlsx 库的 utils.table_to_book 方法将完整的 HTML 表格转换为工作簿（workbook）
    let webBook = XLSX.utils.table_to_book(clonedTable, { raw: true });

    // 将工作簿写入 XLSX 格式
    let webOut = XLSX.write(webBook, { bookType: 'xlsx', bookSST: true, type: 'array' });
    let exportName = name ? name + '_' + Date.now() : Date.now()

    try {
      FileSaver.saveAs(new Blob([webOut], { type: 'application/octet-stream' }), exportName + '.xlsx');
    } catch (e) {
      if (typeof console !== 'undefined') {
        console.error("导出表格失败", err, webOut)
        ElMessage.error("导出失败，请重试")
      }
    }
  } catch (err) {
    console.error("导出表格失败", err)
    ElMessage.error("导出失败，请重试")
  }
}

export default {
  exportExcel
}

```

## 3.前端代码
```html
<el-button @click="exportExcel(tableRef, '数据导出')">导出</el-button>
<el-table ref="tableRef">
···
</el-table>
```
```javascript
const tableRef = ref(null);
```

## 4.注意要素
- 1.在Vue3环境下接收ref需要使用 `unref(table)`将绑定数据进行解构方可使用；
- 2.使用xlsx导出表格时间显示不全，会在Excel中显示###且导出的时间数据与原数据存在43秒的偏差，此时需要在转化代码` let webBook = XLSX.utils.table_to_book(clonedTable);`中加入`, { raw: true }`
```javascript
// 使用 xlsx 库的 utils.table_to_book 方法将完整的 HTML 表格转换为工作簿（workbook）
let webBook = XLSX.utils.table_to_book(clonedTable, { raw: true });
```
### 5.参考文章
1.https://blog.csdn.net/gentleman_hua/article/details/124126635
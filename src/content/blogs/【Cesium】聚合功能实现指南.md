---
title: "Cesium 聚合功能实现指南"
description: "这是一个关于如何使用 Cesium 实现聚合功能的指南。"
author: "DescartesZ"
pubDate: 2025-11-18
tags:
  ["Cesium", "Vue", "前端", "地图"]
---


我将为您介绍如何在 Vue 地图组件中实现 Cesium 的聚合功能。

## 1. 创建聚合功能方法

首先创建一个专门处理聚合功能的 JavaScript 文件：

```javascript
// cesiumEntityCluster.js
export function setupEntityClustering(viewer, entities, options = {}) {
  // 启用实体聚类
  viewer.entities.clustering.enabled = true;
  
  // 设置聚类选项
  const clustering = viewer.entities.clustering;
  clustering.pixelRange = options.pixelRange || 50; // 聚合像素范围
  clustering.minimumClusterSize = options.minimumClusterSize || 3; // 最小聚类数量
  clustering.enabled = options.enabled !== false; // 是否启用聚类
  
  // 自定义聚类标签样式
  clustering.clusterEvent.addEventListener((clusteredEntities, cluster) => {
    // 设置聚合点的样式
    cluster.label.showBackground = true;
    cluster.label.backgroundColor = Cesium.Color.WHITE.withAlpha(0.7);
    cluster.label.font = '14px sans-serif';
    cluster.label.horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
    cluster.label.verticalOrigin = Cesium.VerticalOrigin.CENTER;
    cluster.label.fillColor = Cesium.Color.BLACK;
    cluster.label.disableDepthTestDistance = Number.POSITIVE_INFINITY;
    
    // 设置聚合点的点样式
    cluster.point.color = Cesium.Color.fromCssColorString('#3399ff');
    cluster.point.outlineWidth = 2;
    cluster.point.outlineColor = Cesium.Color.WHITE;
    cluster.point.pixelSize = 20;
    cluster.point.scaleByDistance = new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5);
  });
  
  // 添加实体到聚类中
  entities.forEach(entity => {
    viewer.entities.add(entity);
  });
  
  return viewer.entities.clustering;
}
```

## 2. 在 Vue 地图组件中使用聚合功能

```vue
<template>
  <div class="cesium-map-container">
    <div ref="cesiumContainer" class="cesium-container"></div>
  </div>
</template>

<script>
import { setupEntityClustering } from './cesiumEntityCluster.js';

export default {
  name: 'CesiumMap',
  data() {
    return {
      viewer: null,
      clusteredEntities: []
    };
  },
  mounted() {
    this.initCesium();
  },
  methods: {
    initCesium() {
      // 初始化 Cesium Viewer
      this.viewer = new Cesium.Viewer(this.$refs.cesiumContainer, {
        // 基础配置
        terrainProvider: Cesium.createWorldTerrain(),
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        vrButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        scene3DOnly: true
      });
      
      // 加载完成后设置聚合
      this.$nextTick(() => {
        this.setupClusteringExample();
      });
    },
    
    setupClusteringExample() {
      // 创建示例数据 - 多个实体用于聚合演示
      const entities = [];
      const locations = [
        { longitude: -75.1641667, latitude: 39.9522222 }, // 费城
        { longitude: -75.1741667, latitude: 39.9622222 },
        { longitude: -75.1841667, latitude: 39.9722222 },
        { longitude: -75.1941667, latitude: 39.9822222 },
        { longitude: -74.1641667, latitude: 39.8522222 },
        { longitude: -74.1741667, latitude: 39.8622222 },
        { longitude: -74.1841667, latitude: 39.8722222 }
      ];
      
      // 创建多个实体
      for (let i = 0; i < 50; i++) {
        const location = locations[Math.floor(Math.random() * locations.length)];
        const offset = (Math.random() - 0.5) * 0.1;
        
        const entity = new Cesium.Entity({
          position: Cesium.Cartesian3.fromDegrees(
            location.longitude + offset,
            location.latitude + offset
          ),
          point: {
            pixelSize: 10,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2
          },
          label: {
            text: `Point ${i + 1}`,
            font: '12px sans-serif',
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -15),
            showBackground: true,
            backgroundColor: Cesium.Color.WHITE.withAlpha(0.7)
          },
          description: `<p>这是第 ${i + 1} 个点</p>`
        });
        
        entities.push(entity);
      }
      
      // 应用聚类
      const clusteringOptions = {
        pixelRange: 40,
        minimumClusterSize: 3,
        enabled: true
      };
      
      setupEntityClustering(this.viewer, entities, clusteringOptions);
      
      // 保存引用以便后续操作
      this.clusteredEntities = entities;
      
      // 飞行到数据区域
      this.viewer.flyTo(entities);
    },
    
    // 动态控制聚类开关的方法
    toggleClustering(enabled) {
      if (this.viewer && this.viewer.entities.clustering) {
        this.viewer.entities.clustering.enabled = enabled;
      }
    },
    
    // 更新聚类参数
    updateClusteringOptions(options) {
      if (this.viewer && this.viewer.entities.clustering) {
        const clustering = this.viewer.entities.clustering;
        if (options.pixelRange !== undefined) {
          clustering.pixelRange = options.pixelRange;
        }
        if (options.minimumClusterSize !== undefined) {
          clustering.minimumClusterSize = options.minimumClusterSize;
        }
      }
    }
  },
  
  beforeDestroy() {
    if (this.viewer) {
      this.viewer.destroy();
    }
  }
};
</script>

<style scoped>
.cesium-map-container {
  width: 100%;
  height: 100%;
}

.cesium-container {
  width: 100%;
  height: 100%;
}
</style>
```

## 3. 高级聚合自定义示例

如果需要更高级的聚合定制，可以使用以下方法：

```javascript
// advancedClustering.js
export function setupAdvancedClustering(viewer, customOptions = {}) {
  viewer.entities.clustering.enabled = true;
  viewer.entities.clustering.pixelRange = customOptions.pixelRange || 100;
  viewer.entities.clustering.minimumClusterSize = customOptions.minimumClusterSize || 2;
  
  // 自定义聚合显示
  viewer.entities.clustering.clusterEvent.addEventListener((clusteredEntities, cluster) => {
    // 根据聚合数量改变颜色
    const count = clusteredEntities.length;
    let color;
    
    if (count < 10) {
      color = Cesium.Color.GREEN;
    } else if (count < 20) {
      color = Cesium.Color.YELLOW;
    } else {
      color = Cesium.Color.RED;
    }
    
    // 设置聚合点样式
    cluster.point.color = color;
    cluster.point.outlineColor = Cesium.Color.WHITE;
    cluster.point.outlineWidth = 2;
    cluster.point.pixelSize = 25;
    
    // 自定义标签文本
    cluster.label.text = `${count}`;
    cluster.label.font = 'bold 16px sans-serif';
    cluster.label.fillColor = Cesium.Color.BLACK;
    cluster.label.horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
    cluster.label.verticalOrigin = Cesium.VerticalOrigin.CENTER;
  });
  
  return viewer.entities.clustering;
}
```

## 使用说明

1. **基本聚合**：使用 `setupEntityClustering` 方法可以快速为实体添加聚合功能
2. **参数配置**：
   - `pixelRange`: 聚合的像素范围，默认50
   - `minimumClusterSize`: 最少聚合数量，默认3
   - `enabled`: 是否启用聚合，默认true
3. **动态控制**：可以通过组件方法动态开启/关闭聚合或调整参数
4. **自定义样式**：可以在聚合事件中自定义聚合点和标签的样式

这个实现提供了完整的 Cesium 聚合功能，您可以根据实际需求调整参数和样式。
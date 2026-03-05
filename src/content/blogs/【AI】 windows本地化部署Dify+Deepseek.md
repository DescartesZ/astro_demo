---
title: "Windows本地化部署Dify+Deepseek"
description: "这是一个关于如何在Windows上本地化部署Dify+Deepseek的指南。"
author: "DescartesZ"
pubDate: 2025-03-01
tags:
  ["Dify", "Deepseek", "AI", "本地化部署","长文"]
---

## 一、下载Docker
前往 [Docker 官网](https://www.docker.com/products/docker-desktop/) 下载 Docker Desktop，按序安装。

### 1.1启用WSL
打开本机的```控制面板```=>```程序```=>```启用或关闭 Windows 功能```,勾选:
- Linux 的 Windows 子系统
- 虚拟机平台（若无该选择则勾选 Hyper-V ）
- 远程差分压缩 API 支持。
![windows功能](https://i-blog.csdnimg.cn/direct/92ba65ec3bb948b4839a752d5f13fa9e.png)
点击确定后进行重启。


### 1.2 迁移Docker位置
Docker的安装位置与下载位置都默认在C盘中，因此要手动进行迁移，防止C盘爆满；
- 导出docker-desktop
```
wsl --export docker-desktop E:\[你的路径]\docker-desktop.tar
```
- 注销docker-desktop
```
wsl --unregister docker-desktop
```
- 新路径中重新导入docker-desktop
```
wsl --import docker-desktop E:\[你的路径]\docker-desktop E:\docker_data\docker-desktop.tar
```

- docker-desktop中修改镜像存储路径
![变更镜像路径](https://i-blog.csdnimg.cn/direct/499e0dae9dfc45eb8a7114c6457e22f6.png)
## 二、Dify的下载与环境配置
### 2.1 Dify项目下载
使用git拉取[Dify项目](https://github.com/langgenius/dify)或下载项目压缩包
```
git clone https://github.com/langgenius/dify.git
```
### 2.2 Dify项目环境配置
1.在2.1 中下载的项目文件中，找到docker文件夹，双击进入后找到`.env.example`文件，将其重命名为`.env`；
2.在docker文件夹中打开cmd终端，运行docker环境；
```
docker compose up -d
```
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/89227f2ffff84dac8f805956a1a780d7.png)
>在此过程中可能会出现请求超时`docker:Error reponse from deamon:Get "registry-1.docker.io/v2...":net/http:request canceled while waiting for connection...`的报错，可能是镜像请求失败的问题，此时需要替换docker的相关镜像地址。
>
进入docker桌面端后点击右上角设置，进入`Docker Engine`进行配置修改。配置如下：
 ```javascript
 {
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false,
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.imgdb.de",
    "https://docker-0.unsee.tech",
    "https://docker.hlmirror.com",
    "https://docker.1ms.run",
    "https://func.ink",
    "https://lispy.org",
    "https://docker.xiaogenban1993.com"
  ]
}
```
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/2cffd9d77cc14f2ab044d8b4ea8f7fda.png)此时点击`Apply & restart`，等待重启后重新运行docker环境即可正常拉取。
拉取完毕后，在docker桌面端中可以看到相关环境已启动，如下：
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/4feae924269a4ce49fbf5dc0de3df291.png)
### 2.3 Dify安装
在浏览器中访问地址`http://[本机IP]:[端口号]/install`即可。
>此处的本机IP，即局域网可访问本机的地址。端口号则可以在**2.2Dify项目环境配置**中，打开`.env`文件对`NGINX_PORT`与`EXPOSE_NGINX_PORT`进行修改，例如改为8081，则可以访问Dify的地址为：http://192.168.0.1:8081/install。

此时进入Dify应用后，需要先设置一个管理账户。
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/a0d455b2daf24005a3ab426b46aa5af6.png)
设置完毕后登录即可进入Dify。
## 三、Dify关联本机运行的deepseek
### 3.1 配置Ollama服务开放局域网访问
Ollama是一个本地 AI 服务工具，默认情况下它只能在本地访问。如果想要在局域网中共享 Ollama 服务，需要配置防火墙以开放对应的端口。
#### 3.1.1 配置 Ollama 服务的监听地址
>Ollama 服务使用环境变量 OLLAMA_HOST 来指定监听的地址，默认情况下，它只监听localhost，即只能本地访问。如果要让局域网内其他设备访问 Ollama 服务，需要将 `OLLAMA_HOST`设为 `0.0.0.0`。
>
在 Windows 中环境变量中新建变量名`OLLAMA_HOST`，变量值`0.0.0.0`。 
#### 3.1.2 开放防火墙端口
使用管理员身份运行命令提示符，按以下命令依次执行。
1. 为 Ollama 服务开放 11434 端口（TCP 协议）：
```
netsh advfirewall firewall add rule name="Allow Port 11434" dir=in action=allow protocol=TCP localport=11434
```
2. 如果 Ollama 使用的是 UDP 协议，可以将命令中的 TCP 改为 UDP：
```
netsh advfirewall firewall add rule name="Allow Port 11434" dir=in action=allow protocol=UDP localport=11434
```
3. 通过以下命令确认规则是否正确添加：
```
netsh advfirewall firewall show rule name="Allow Port 11434"
```
完成上述操作后，在本机或同局域网中的设备对地址：`http://[本机地址IP]:11434`进行访问，若访问后页面显示Ollama API相关的信息，则端口已开放成功。

### 3.2 修改Dify运行配置文件
在**2.2Dify项目环境配置**中，打开`.env`文件，末尾新增配置如下：
```
# 启用自定义模型
CUSTOM_MODEL_ENABLED=true
# 指定 Ollama 的 API 地址（根据部署环境调整 IP）
OLLAMA_API_BASE_URL=http://[本机IP]:11434
```
其中的`OLLAMA_API_BASE_URL`配置的地址即开放后的Ollama服务地址。

### 3.3 配置Dify大模型
1. 点击Dify中右上角的头像后点击设置；
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/c5f59d5e3c4d4d01a022fbb7a17a18e5.png)
2. 点击`模型供应商`在右侧选项卡中找到**Ollama**，鼠标悬停后点击`添加模型`，填写模型名称与基础URL点击保存即可。
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/749cec2b25b341a891c85497cdcca2d7.png)
### 3.4 新建第一个Dify应用
在Dify主页中的`创建应用`中点击`创建空白应用`，弹出创建弹窗后，选择`聊天助手`，输入应用名称与描述后点击`创建`即可。
首次创建的应用，使用的模型不是我们想要的本地deepseek，此时点击右上角发布按钮左侧的模型选择框，点击后将有下来框可以选择本地Ollama中运行的deepseek（图例为已添加deepseek后的状态，可对模型相关参数进行调整）。
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/db2dd83063164a6388577d09d950715b.png)
此时，可以在聊天输入框中输入 你是谁？ 进行测试，若能够回答，则Dify对接本地deepseek成功。
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/7b2419c5286e41e897d4f1f1ad252dff.png)

## 参考文档
1. [从零开始！在 Windows 上安装与配置 Dify](https://blog.csdn.net/qq_49035156/article/details/143264534);
2. [DeepSeek + Dify ：零成本搭建企业级本地私有化知识库保姆级教程](https://blog.csdn.net/python1222_/article/details/145629203);
3. [在 Windows 上配置 Ollama 服务并开放局域网访问](https://blog.csdn.net/weixin_46759000/article/details/142175930);
4. [Dify官方文档](https://docs.dify.ai/zh-hans/guides/workflow/publish).

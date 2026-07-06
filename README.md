# Focus Studio 专注学习工作室

这是一个面向 8–10 岁孩子的学习型专注力训练 Web App。它不再是低龄小游戏合集，而是围绕真实学习能力设计：阅读专注、听指令、任务计划、错误检查、安静完成、分心回归。

## 主要功能

- 纯前端训练系统，所有训练记录保存在浏览器本地 `localStorage`
- 支持 iPad / 手机触屏使用
- 轻量、标准、挑战三种训练计划
- 6 个训练模块：阅读专注、听指令、错误检查、任务计划、安静完成、分心回归
- 自动难度升降级
- 家长中心，默认 PIN：`2580`
- 数据导出、重置难度、清除数据
- PWA 支持，可添加到 iPad / 手机主屏幕
- Railway 部署优化：使用 Dockerfile，不需要 `npm install`，避免 npm ci 卡住

## Railway 部署

1. 解压 ZIP。
2. 把所有文件上传到 GitHub 仓库根目录。
3. 在 Railway 选择该 GitHub 仓库部署。
4. Railway 会自动识别根目录的 `Dockerfile`。
5. 部署成功后直接使用 Railway 域名访问。

Railway 设置建议：

- Build Command：留空
- Start Command：留空
- Root Directory：留空

本项目的 `railway.json` 已指定 Dockerfile 构建和 `node server.js` 启动。

## 本地运行

本项目没有第三方依赖。电脑安装 Node.js 20+ 后，在项目根目录运行：

```bash
npm start
```

然后打开：

```text
http://localhost:8080
```

也可以指定端口：

```bash
PORT=3000 npm start
```

## 文件结构

```text
index.html
server.js
Dockerfile
railway.json
package.json
public/
  icon.svg
  manifest.webmanifest
  service-worker.js
src/
  app.js
  styles.css
```

## 注意

这个 App 是家庭辅助训练工具，不是医学诊断或治疗工具。如果孩子的专注力问题明显影响学习、情绪或社交，建议同时咨询专业人士。

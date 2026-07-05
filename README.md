# 专注花园 Focus Garden Ultimate

这是一个给儿童使用的触屏专注力训练 Web App，适合 iPad 和手机浏览器访问，也可以添加到主屏幕作为 PWA 使用。

## 功能

- 今日训练：轻松、标准、挑战 3 种训练计划
- 专注实验室：8 个单项训练
  - 找目标
  - 记忆花园
  - 红绿灯反应
  - 1-Back / 2-Back 记忆反应
  - 多步指令
  - 慢动作控制
  - 等待金鱼
  - 颜色干扰
- 呼吸准备动画
- 自适应难度：根据正确率自动升级或降级
- 家长中心：本地记录、7天趋势、单项表现、设置
- 家长 PIN：默认 `2580`
- PWA：支持添加到 iPad / 手机主屏幕
- 纯前端本地保存：不需要数据库，不上传孩子数据

## 本地运行

```bash
npm install
npm run dev
```

打开终端显示的本地地址即可。

## Railway 部署

1. 把整个项目上传到 GitHub 仓库。
2. 在 Railway 新建项目，选择 Deploy from GitHub Repo。
3. Railway 通常会自动识别 Node 项目。
4. Build command 使用：

```bash
npm run build
```

5. Start command 使用：

```bash
npm start
```

部署成功后，直接使用 Railway 生成的域名访问即可。

## 重要提醒

这个 App 是亲子训练和习惯辅助工具，不是医学诊断工具。如果孩子的注意力问题明显影响学习、情绪或社交，建议咨询专业医生或儿童发展相关专业人士。

## 数据说明

所有训练记录都保存在当前浏览器的 `localStorage` 中：

- 换设备不会自动同步
- 清理浏览器数据会删除记录
- 不会上传到服务器

如果未来需要多设备同步，可以再增加数据库和账号系统。

## Railway 部署失败修复说明

如果 Railway 日志里出现 `npm error Exit handler never called!` 或 `npm ci did not complete successfully`，请使用本修复版。

本版本新增：

- `Dockerfile`：让 Railway 用固定的 Node 20.19.0 构建，绕开 Railpack 默认 Node/npm 环境问题。
- `.nvmrc` / `.node-version`：固定 Node 版本。
- `railway.json`：固定 Railway 构建与启动设置。

Railway 设置建议：

- Build Command：留空
- Start Command：留空，或填 `npm start`
- Root Directory：留空，保持 `/`

上传 GitHub 后 Railway 会自动识别根目录的 Dockerfile 并构建。

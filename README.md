# 齐佳一的空间

一个用 React + Vite 写的个人网站雏形。当前版本包含中文首页、页面级 tab 切换，以及一个放在“玩具”页里的霓虹风贪吃蛇小游戏。

线上地址：

- Production: https://frontend-mlvpfxe34-qijiayi950217-5219s-projects.vercel.app
- Alias: https://frontend-qijiayi950217-5219s-projects.vercel.app

## 功能

- `首页`：个人站入口和当前建设方向。
- `玩具`：小应用展示区，第一版包含贪吃蛇。
- `笔记`：预留给部署记录、开发日志和想法整理。

## 技术栈

- React 19
- TypeScript
- Vite
- CSS Modules-free plain CSS
- Vercel 部署

## 本地开发

```bash
npm install
npm run dev
```

默认本地地址是 Vite 输出的 localhost 地址，通常为：

```text
http://localhost:5173/
```

## 常用命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 类型检查并构建生产产物
npm run preview  # 本地预览 dist
npm run lint     # 运行 ESLint
```

## 部署

项目已包含 [vercel.json](./vercel.json)，Vercel 会使用：

- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: `vite`

使用 CLI 部署：

```bash
vercel --prod
```

也可以把仓库导入 Vercel，让每次 push 后自动部署。

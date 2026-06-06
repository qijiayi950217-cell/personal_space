# 齐佳一的空间

一个用 React + Vite 写的个人项目启动台。当前版本包含中文首页、路由驱动的 tab 导航，以及一个独立页面里的霓虹风贪吃蛇小游戏。

线上地址：

- https://frontend-ashen-seven-1suizrxn8k.vercel.app

## 功能

- `首页`：项目启动台和项目卡片入口。
- `贪吃蛇`：小应用展示区，第一版包含可玩的 Snake。
- `笔记`：预留给部署记录、开发日志和想法整理。

## 技术栈

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Plain CSS for the custom visual system and game board
- Vercel 部署

## 项目结构

```text
src/
  components/       # 通用组件预留
  config/           # 路由和导航配置
  games/snake/      # 贪吃蛇页面逻辑、组件和类型
  hooks/            # 通用 hook 预留
  layouts/          # App layout 和导航
  pages/            # 独立页面
  utils/            # localStorage 等工具函数
```

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

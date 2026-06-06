import type { ComponentType } from 'react'
import { HomePage } from '../pages/HomePage'
import { SnakePage } from '../pages/SnakePage'
import { NotesPage } from '../pages/NotesPage'

export type AppRoute = {
  Component: ComponentType
  description: string
  index?: boolean
  label: string
  path?: string
}

export const routes: AppRoute[] = [
  {
    Component: HomePage,
    description: '项目启动台',
    index: true,
    label: '首页',
  },
  {
    Component: SnakePage,
    description: '霓虹贪吃蛇小游戏',
    label: '贪吃蛇',
    path: 'snake',
  },
  {
    Component: NotesPage,
    description: '开发日志与想法',
    label: '笔记',
    path: 'notes',
  },
]

export const navRoutes = routes.map((route) => ({
  href: route.index ? '/' : `/${route.path}`,
  label: route.label,
}))

import { SnakeGame } from '../games/snake/SnakeGame'

export function SnakePage() {
  return (
    <div className="page-view apps-page">
      <section className="page-heading">
        <p className="eyebrow">小游戏</p>
        <h1>霓虹贪吃蛇</h1>
        <p>手动挑战，或开启自动模式，看 AI 每一步实时评估路径和生存空间。</p>
      </section>
      <SnakeGame />
    </div>
  )
}

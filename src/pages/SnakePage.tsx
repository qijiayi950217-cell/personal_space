import { SnakeGame } from '../games/snake/SnakeGame'

export function SnakePage() {
  return (
    <div className="page-view apps-page">
      <section className="page-heading">
        <p className="eyebrow">小游戏</p>
        <h1>霓虹贪吃蛇</h1>
        <p>方向键或 WASD 控制，空格暂停。移动端可以使用棋盘下方的方向按钮。</p>
      </section>
      <SnakeGame />
    </div>
  )
}

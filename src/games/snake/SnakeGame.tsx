import { SnakeBoard } from './components/SnakeBoard'
import { SnakeControls } from './components/SnakeControls'
import { ScorePanel } from './components/ScorePanel'
import { useSnakeGame } from './hooks/useSnakeGame'
import { statusTextByState } from './snakeConfig'

export function SnakeGame() {
  const game = useSnakeGame()
  const statusText = statusTextByState[game.gameState]

  return (
    <section className="snake-shell" aria-label="贪吃蛇游戏">
      <div className="game-topline">
        <div>
          <p className="eyebrow">项目 001</p>
          <h2>霓虹贪吃蛇</h2>
        </div>
        <ScorePanel bestScore={game.bestScore} score={game.score} />
      </div>

      <div className="snake-stage">
        <SnakeBoard
          boardSize={game.boardSize}
          food={game.food}
          snake={game.snake}
          snakeCells={game.snakeCells}
          statusText={statusText}
        />
        <div className="game-status">
          <strong>{statusText}</strong>
          <span>方向键 / WASD / 空格</span>
        </div>
      </div>

      <SnakeControls
        chooseDirection={game.chooseDirection}
        gameState={game.gameState}
        resetGame={game.resetGame}
        startGame={game.startGame}
        togglePause={game.togglePause}
      />
    </section>
  )
}

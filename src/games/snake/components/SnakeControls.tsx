import type { Direction, GameState } from '../types/snake'

type SnakeControlsProps = {
  chooseDirection: (direction: Direction) => void
  gameState: GameState
  resetGame: () => void
  startGame: () => void
  togglePause: () => void
}

export function SnakeControls({
  chooseDirection,
  gameState,
  resetGame,
  startGame,
  togglePause,
}: SnakeControlsProps) {
  return (
    <div className="game-controls" aria-label="贪吃蛇控制">
      <button type="button" onClick={() => chooseDirection('up')} aria-label="向上">
        ↑
      </button>
      <button type="button" onClick={() => chooseDirection('left')} aria-label="向左">
        ←
      </button>
      <button
        type="button"
        onClick={() => {
          if (gameState === 'ended') {
            startGame()
            return
          }

          togglePause()
        }}
      >
        {gameState === 'running' ? '暂停' : '开始'}
      </button>
      <button type="button" onClick={() => chooseDirection('right')} aria-label="向右">
        →
      </button>
      <button type="button" onClick={() => chooseDirection('down')} aria-label="向下">
        ↓
      </button>
      <button type="button" className="ghost-button" onClick={resetGame}>
        重置
      </button>
    </div>
  )
}

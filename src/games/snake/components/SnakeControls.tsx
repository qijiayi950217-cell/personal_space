import type { Direction, GameState } from '../types/snake'

type SnakeControlsProps = {
  chooseDirection: (direction: Direction) => void
  gameState: GameState
  isAutoMode: boolean
  resetGame: () => void
  startGame: () => void
  toggleAutoMode: () => void
  togglePause: () => void
}

export function SnakeControls({
  chooseDirection,
  gameState,
  isAutoMode,
  resetGame,
  startGame,
  toggleAutoMode,
  togglePause,
}: SnakeControlsProps) {
  return (
    <>
      <div className="auto-mode-row">
        <div>
          <strong>自动通关</strong>
          <span>实时寻路、模拟风险，并在危险时主动追尾</span>
        </div>
        <button
          aria-pressed={isAutoMode}
          className={isAutoMode ? 'mode-toggle active' : 'mode-toggle'}
          onClick={toggleAutoMode}
          type="button"
        >
          <span />
          {isAutoMode ? '自动模式' : '手动模式'}
        </button>
      </div>

      <div className="game-controls" aria-label="贪吃蛇控制">
        <button disabled={isAutoMode} type="button" onClick={() => chooseDirection('up')} aria-label="向上">
          ↑
        </button>
        <button disabled={isAutoMode} type="button" onClick={() => chooseDirection('left')} aria-label="向左">
          ←
        </button>
        <button
          type="button"
          onClick={() => {
            if (gameState === 'ended' || gameState === 'won') {
              startGame()
              return
            }

            togglePause()
          }}
        >
          {gameState === 'running' ? '暂停' : '开始'}
        </button>
        <button disabled={isAutoMode} type="button" onClick={() => chooseDirection('right')} aria-label="向右">
          →
        </button>
        <button disabled={isAutoMode} type="button" onClick={() => chooseDirection('down')} aria-label="向下">
          ↓
        </button>
        <button type="button" className="ghost-button" onClick={resetGame}>
          重置
        </button>
      </div>
    </>
  )
}

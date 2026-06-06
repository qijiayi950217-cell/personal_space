import type { Cell } from '../types/snake'

type SnakeBoardProps = {
  boardSize: number
  food: Cell
  snake: Cell[]
  snakeCells: Set<string>
  statusText: string
}

function sameCell(a: Cell, b: Cell) {
  return a.x === b.x && a.y === b.y
}

export function SnakeBoard({ boardSize, food, snake, snakeCells, statusText }: SnakeBoardProps) {
  return (
    <div className="board" role="img" aria-label={`贪吃蛇棋盘。${statusText}。`}>
      {Array.from({ length: boardSize * boardSize }, (_, index) => {
        const x = index % boardSize
        const y = Math.floor(index / boardSize)
        const isHead = sameCell(snake[0], { x, y })
        const isSnake = snakeCells.has(`${x}:${y}`)
        const isFood = sameCell(food, { x, y })

        return (
          <span
            className={[
              'cell',
              isSnake ? 'snake-cell' : '',
              isHead ? 'snake-head' : '',
              isFood ? 'food-cell' : '',
            ].join(' ')}
            key={`${x}-${y}`}
          />
        )
      })}
    </div>
  )
}

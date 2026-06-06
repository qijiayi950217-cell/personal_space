import { useCallback, useEffect, useMemo, useState } from 'react'
import { readNumberFromStorage, writeNumberToStorage } from '../../../utils/storage'
import { chooseAutoDirection } from '../snakeAi'
import type { Cell, Direction, GameState } from '../types/snake'

const BEST_SCORE_KEY = 'qijiayi-space.snake.best-score'
const BOARD_SIZE = 18
const AUTO_TICK_MS = 8
const START_SNAKE: Cell[] = [
  { x: 8, y: 9 },
  { x: 7, y: 9 },
  { x: 6, y: 9 },
]
const START_FOOD: Cell = { x: 13, y: 9 }

const directions: Record<Direction, Cell> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const opposite: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

function sameCell(a: Cell, b: Cell) {
  return a.x === b.x && a.y === b.y
}

function makeFood(snake: Cell[]): Cell {
  const taken = new Set(snake.map((cell) => `${cell.x}:${cell.y}`))
  const open: Cell[] = []

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      if (!taken.has(`${x}:${y}`)) open.push({ x, y })
    }
  }

  return open[Math.floor(Math.random() * open.length)] ?? START_FOOD
}

export function useSnakeGame() {
  const [snake, setSnake] = useState<Cell[]>(START_SNAKE)
  const [food, setFood] = useState<Cell | null>(START_FOOD)
  const [direction, setDirection] = useState<Direction>('right')
  const [nextDirection, setNextDirection] = useState<Direction>('right')
  const [gameState, setGameState] = useState<GameState>('ready')
  const [isAutoMode, setIsAutoMode] = useState(false)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(() => readNumberFromStorage(BEST_SCORE_KEY, 0))

  const updateBestScore = useCallback((nextScore: number) => {
    setBestScore((currentBest) => {
      const best = Math.max(currentBest, nextScore)
      writeNumberToStorage(BEST_SCORE_KEY, best)
      return best
    })
  }, [])

  const resetGame = useCallback(() => {
    setSnake(START_SNAKE)
    setFood(START_FOOD)
    setDirection('right')
    setNextDirection('right')
    setScore(0)
    setGameState('ready')
  }, [])

  const startGame = useCallback(() => {
    setSnake(START_SNAKE)
    setFood(makeFood(START_SNAKE))
    setDirection('right')
    setNextDirection('right')
    setScore(0)
    setGameState('running')
  }, [])

  const toggleAutoMode = useCallback(() => {
    setIsAutoMode((current) => {
      const nextAutoMode = !current
      setSnake(START_SNAKE)
      setFood(makeFood(START_SNAKE))
      setDirection('right')
      setNextDirection('right')
      setScore(0)
      setGameState(nextAutoMode ? 'running' : 'ready')
      return nextAutoMode
    })
  }, [])

  const togglePause = useCallback(() => {
    setGameState((current) => {
      if (current === 'running') return 'paused'
      if (current === 'paused' || current === 'ready') return 'running'
      return current
    })
  }, [])

  const chooseDirection = useCallback((newDirection: Direction) => {
    if (isAutoMode) return

    setNextDirection((current) =>
      opposite[current] === newDirection ? current : newDirection,
    )
    setGameState((current) => (current === 'ready' ? 'running' : current))
  }, [isAutoMode])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMap: Record<string, Direction | undefined> = {
        ArrowUp: 'up',
        w: 'up',
        W: 'up',
        ArrowDown: 'down',
        s: 'down',
        S: 'down',
        ArrowLeft: 'left',
        a: 'left',
        A: 'left',
        ArrowRight: 'right',
        d: 'right',
        D: 'right',
      }

      if (event.key === ' ') {
        event.preventDefault()
        togglePause()
      }

      const keyboardDirection = keyMap[event.key]
      if (keyboardDirection) {
        event.preventDefault()
        chooseDirection(keyboardDirection)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [chooseDirection, togglePause])

  useEffect(() => {
    if (gameState !== 'running') return

    const tick = window.setInterval(() => {
      setSnake((currentSnake) => {
        const head = currentSnake[0]
        const confirmedDirection = isAutoMode
          ? chooseAutoDirection(currentSnake, food, BOARD_SIZE)
          : opposite[direction] === nextDirection
            ? direction
            : nextDirection
        const move = directions[confirmedDirection]
        const nextHead = {
          x: head.x + move.x,
          y: head.y + move.y,
        }
        const hitsWall =
          nextHead.x < 0 ||
          nextHead.x >= BOARD_SIZE ||
          nextHead.y < 0 ||
          nextHead.y >= BOARD_SIZE

        if (hitsWall) {
          setGameState('ended')
          updateBestScore(score)
          return currentSnake
        }

        const eatsFood = food ? sameCell(nextHead, food) : false
        const nextSnake = [nextHead, ...currentSnake]

        if (!eatsFood) nextSnake.pop()

        const body = eatsFood ? currentSnake : nextSnake.slice(1)
        if (body.some((cell) => sameCell(cell, nextHead))) {
          setGameState('ended')
          updateBestScore(score)
          return currentSnake
        }

        setDirection(confirmedDirection)

        if (eatsFood) {
          const nextScore = score + 1
          setScore(nextScore)
          updateBestScore(nextScore)

          if (nextSnake.length === BOARD_SIZE * BOARD_SIZE) {
            setFood(null)
            setGameState('won')
          } else {
            setFood(makeFood(nextSnake))
          }
        }

        return nextSnake
      })
    }, isAutoMode ? AUTO_TICK_MS : Math.max(74, 160 - score * 6))

    return () => window.clearInterval(tick)
  }, [direction, food, gameState, isAutoMode, nextDirection, score, updateBestScore])

  const snakeCells = useMemo(
    () => new Set(snake.map((cell) => `${cell.x}:${cell.y}`)),
    [snake],
  )

  return {
    bestScore,
    boardSize: BOARD_SIZE,
    chooseDirection,
    food,
    gameState,
    isAutoMode,
    resetGame,
    score,
    snake,
    snakeCells,
    startGame,
    toggleAutoMode,
    togglePause,
  }
}

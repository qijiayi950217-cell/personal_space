import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

type Tab = 'home' | 'apps' | 'notes'
type Cell = { x: number; y: number }
type Direction = 'up' | 'down' | 'left' | 'right'
type GameState = 'ready' | 'running' | 'paused' | 'ended'

const BOARD_SIZE = 18
const START_SNAKE: Cell[] = [
  { x: 8, y: 9 },
  { x: 7, y: 9 },
  { x: 6, y: 9 },
]
const START_FOOD: Cell = { x: 13, y: 9 }

const tabs: { id: Tab; label: string }[] = [
  { id: 'home', label: '首页' },
  { id: 'apps', label: '玩具' },
  { id: 'notes', label: '笔记' },
]

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

function SnakeGame() {
  const [snake, setSnake] = useState<Cell[]>(START_SNAKE)
  const [food, setFood] = useState<Cell>(START_FOOD)
  const [direction, setDirection] = useState<Direction>('right')
  const [nextDirection, setNextDirection] = useState<Direction>('right')
  const [gameState, setGameState] = useState<GameState>('ready')
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)

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
    setFood(START_FOOD)
    setDirection('right')
    setNextDirection('right')
    setScore(0)
    setGameState('running')
  }, [])

  const chooseDirection = useCallback((newDirection: Direction) => {
    setNextDirection((current) =>
      opposite[current] === newDirection ? current : newDirection,
    )
    setGameState((current) => (current === 'ready' ? 'running' : current))
  }, [])

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
        setGameState((current) => {
          if (current === 'running') return 'paused'
          if (current === 'paused' || current === 'ready') return 'running'
          return current
        })
      }

      const keyboardDirection = keyMap[event.key]
      if (keyboardDirection) {
        event.preventDefault()
        chooseDirection(keyboardDirection)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [chooseDirection])

  useEffect(() => {
    if (gameState !== 'running') return

    const tick = window.setInterval(() => {
      setSnake((currentSnake) => {
        const confirmedDirection =
          opposite[direction] === nextDirection ? direction : nextDirection
        const move = directions[confirmedDirection]
        const head = currentSnake[0]
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
          setBestScore((best) => Math.max(best, score))
          return currentSnake
        }

        const eatsFood = sameCell(nextHead, food)
        const nextSnake = [nextHead, ...currentSnake]

        if (!eatsFood) nextSnake.pop()

        const body = eatsFood ? currentSnake : nextSnake.slice(1)
        if (body.some((cell) => sameCell(cell, nextHead))) {
          setGameState('ended')
          setBestScore((best) => Math.max(best, score))
          return currentSnake
        }

        setDirection(confirmedDirection)

        if (eatsFood) {
          const nextScore = score + 1
          setScore(nextScore)
          setBestScore((best) => Math.max(best, nextScore))
          setFood(makeFood(nextSnake))
        }

        return nextSnake
      })
    }, Math.max(74, 160 - score * 6))

    return () => window.clearInterval(tick)
  }, [direction, food, gameState, nextDirection, score])

  const snakeCells = useMemo(
    () => new Set(snake.map((cell) => `${cell.x}:${cell.y}`)),
    [snake],
  )

  const statusText = {
    ready: '按方向键开始',
    running: '前进中',
    paused: '已暂停',
    ended: '游戏结束',
  }[gameState]

  return (
    <section className="snake-shell" aria-label="贪吃蛇游戏">
      <div className="game-topline">
        <div>
          <p className="eyebrow">玩具 001</p>
          <h2>霓虹贪吃蛇</h2>
        </div>
        <div className="score-strip" aria-label="游戏分数">
          <span>{score.toString().padStart(2, '0')}</span>
          <small>最高 {bestScore.toString().padStart(2, '0')}</small>
        </div>
      </div>

      <div className="snake-stage">
        <div className="board" role="img" aria-label={`贪吃蛇棋盘。${statusText}。`}>
          {Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => {
            const x = index % BOARD_SIZE
            const y = Math.floor(index / BOARD_SIZE)
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
        <div className="game-status">
          <strong>{statusText}</strong>
          <span>方向键 / WASD / 空格</span>
        </div>
      </div>

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

            setGameState((current) => (current === 'running' ? 'paused' : 'running'))
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
    </section>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home')

  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="个人主页">
          <span className="brand-mark">Q</span>
          <span>齐佳一的空间</span>
        </a>
        <nav className="tab-list" aria-label="主导航">
          {tabs.map((tab) => (
            <button
              className={activeTab === tab.id ? 'tab active' : 'tab'}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <section className="content-band" aria-live="polite">
        {activeTab === 'home' && (
          <div className="page-view home-page" id="top">
            <section className="hero">
              <div className="hero-copy">
                <p className="eyebrow">个人实验室上线中</p>
                <h1>把小想法做成可以公开访问的工具</h1>
                <p>
                  这里会慢慢变成我的个人网站：主页负责介绍方向，玩具页放一些能直接使用的小应用，
                  笔记页记录开发、部署和偶尔值得留下的想法。
                </p>
                <div className="hero-actions" aria-label="当前网站内容">
                  <span>Vercel 部署</span>
                  <span>React + Vite</span>
                  <span>持续加料中</span>
                </div>
              </div>
              <div className="hero-visual" aria-hidden="true">
                <span className="orbital one" />
                <span className="orbital two" />
                <span className="orbital three" />
                <span className="signal-line" />
                <span className="signal-line second" />
              </div>
            </section>

            <div className="home-grid">
              <article className="intro-panel">
                <p className="eyebrow">正在搭建</p>
                <h2>先搭一个耐看的入口，再慢慢往里放应用。</h2>
                <p>
                  每个 tab 都是一页独立内容。以后可以在“玩具”里加更多小应用，
                  在“笔记”里记录部署、踩坑和产品想法。
                </p>
              </article>
              <div className="stack-list">
                <div>
                  <span>01</span>
                  <strong>适合 Vercel 部署</strong>
                  <p>Vite 静态构建，导入 GitHub 仓库后就能自动预览和发布。</p>
                </div>
                <div>
                  <span>02</span>
                  <strong>应用优先</strong>
                  <p>导航和页面结构已经分开，后续加新工具不用推倒重来。</p>
                </div>
                <div>
                  <span>03</span>
                  <strong>轻量 JS</strong>
                  <p>当前只用 React 状态和 CSS，先保持简单、可控、容易改。</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'apps' && (
          <div className="page-view apps-page">
            <section className="page-heading">
              <p className="eyebrow">小应用架</p>
              <h1>先放一个能玩的贪吃蛇。</h1>
              <p>后面这里可以继续加计时器、AI 小工具、可视化实验或者任何你临时想玩的东西。</p>
            </section>
            <SnakeGame />
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="page-view notes-page">
            <p className="eyebrow">笔记</p>
            <h1>下一步可以做一个开发日志。</h1>
            <p>
              这里适合放部署记录、应用想法、设计草稿，以及那些未来的自己会感谢现在保存下来的调试笔记。
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

export default App

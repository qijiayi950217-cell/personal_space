import type { Cell, Direction } from './types/snake'

const moves: { direction: Direction; offset: Cell }[] = [
  { direction: 'up', offset: { x: 0, y: -1 } },
  { direction: 'right', offset: { x: 1, y: 0 } },
  { direction: 'down', offset: { x: 0, y: 1 } },
  { direction: 'left', offset: { x: -1, y: 0 } },
]

function key(cell: Cell) {
  return `${cell.x}:${cell.y}`
}

function sameCell(a: Cell, b: Cell) {
  return a.x === b.x && a.y === b.y
}

function buildSafetyOrder(boardSize: number) {
  const order: Cell[] = []

  for (let x = 0; x < boardSize; x += 1) order.push({ x, y: 0 })

  for (let y = 1; y < boardSize; y += 1) {
    if (y % 2 === 1) {
      for (let x = boardSize - 1; x >= 1; x -= 1) order.push({ x, y })
    } else {
      for (let x = 1; x < boardSize; x += 1) order.push({ x, y })
    }
  }

  for (let y = boardSize - 1; y >= 1; y -= 1) order.push({ x: 0, y })

  return order.reverse()
}

function cycleDistance(from: number, to: number, length: number) {
  return (to - from + length) % length
}

function explore(start: Cell, blocked: Set<string>, boardSize: number, target?: Cell) {
  const queue: { cell: Cell; distance: number }[] = [{ cell: start, distance: 0 }]
  const visited = new Set([key(start)])

  for (let index = 0; index < queue.length; index += 1) {
    const current = queue[index]
    if (target && sameCell(current.cell, target)) {
      return { area: visited.size, distance: current.distance, reachesTarget: true }
    }

    for (const { offset } of moves) {
      const next = { x: current.cell.x + offset.x, y: current.cell.y + offset.y }
      const nextKey = key(next)
      if (
        next.x < 0 ||
        next.x >= boardSize ||
        next.y < 0 ||
        next.y >= boardSize ||
        blocked.has(nextKey) ||
        visited.has(nextKey)
      ) {
        continue
      }

      visited.add(nextKey)
      queue.push({ cell: next, distance: current.distance + 1 })
    }
  }

  return { area: visited.size, distance: Number.POSITIVE_INFINITY, reachesTarget: false }
}

export function chooseAutoDirection(snake: Cell[], food: Cell | null, boardSize: number) {
  const safetyOrder = buildSafetyOrder(boardSize)
  const safetyIndex = new Map(safetyOrder.map((cell, index) => [key(cell), index]))
  const head = snake[0]
  const tail = snake[snake.length - 1]
  const headIndex = safetyIndex.get(key(head)) ?? 0
  const tailIndex = safetyIndex.get(key(tail)) ?? 0
  const distanceToTail = cycleDistance(headIndex, tailIndex, safetyOrder.length)
  const foodIndex = food ? safetyIndex.get(key(food)) : undefined
  const distanceToFood =
    foodIndex === undefined
      ? Number.POSITIVE_INFINITY
      : cycleDistance(headIndex, foodIndex, safetyOrder.length)
  const foodIsAhead = distanceToFood > 0 && distanceToFood < distanceToTail
  let best: { direction: Direction; score: number } | null = null

  for (const { direction, offset } of moves) {
    const nextHead = { x: head.x + offset.x, y: head.y + offset.y }
    const nextIndex = safetyIndex.get(key(nextHead))
    if (nextIndex === undefined) continue

    const eatsFood = food ? sameCell(nextHead, food) : false
    const progress = cycleDistance(headIndex, nextIndex, safetyOrder.length)
    const maximumSafeProgress = distanceToTail - (eatsFood ? 1 : 0)
    if (progress === 0 || progress > maximumSafeProgress) continue
    if (foodIsAhead && progress > distanceToFood) continue

    const bodyToCheck = eatsFood ? snake : snake.slice(0, -1)
    if (bodyToCheck.some((cell) => sameCell(cell, nextHead))) continue

    const nextSnake = [nextHead, ...snake]
    if (!eatsFood) nextSnake.pop()

    const blocked = new Set(nextSnake.slice(1, -1).map(key))
    const spaceSearch = explore(nextHead, blocked, boardSize)
    const score =
      (eatsFood ? 500_000 : 0) +
      (foodIsAhead ? progress * 2_000 : -progress * 4) +
      spaceSearch.area * 30 +
      Math.random()

    if (!best || score > best.score) best = { direction, score }
  }

  if (best) return best.direction

  const fallback = safetyOrder[(headIndex + 1) % safetyOrder.length]
  if (fallback.x > head.x) return 'right'
  if (fallback.x < head.x) return 'left'
  if (fallback.y > head.y) return 'down'
  return 'up'
}

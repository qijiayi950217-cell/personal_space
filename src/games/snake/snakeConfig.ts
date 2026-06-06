import type { GameState } from './types/snake'

export const statusTextByState: Record<GameState, string> = {
  ready: '按方向键开始',
  running: '前进中',
  paused: '已暂停',
  ended: '游戏结束',
}

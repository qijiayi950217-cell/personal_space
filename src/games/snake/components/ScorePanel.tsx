type ScorePanelProps = {
  bestScore: number
  score: number
}

export function ScorePanel({ bestScore, score }: ScorePanelProps) {
  return (
    <div className="score-strip" aria-label="游戏分数">
      <span>{score.toString().padStart(2, '0')}</span>
      <small>最高 {bestScore.toString().padStart(2, '0')}</small>
    </div>
  )
}

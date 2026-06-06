import { Link } from 'react-router-dom'
import { routes } from '../config/routes'

const projectCards = [
  {
    description: '一个带得分、暂停、移动端控制的小游戏，用来打磨小项目页面结构。',
    href: '/snake',
    label: '已上线',
    title: '霓虹贪吃蛇',
  },
  {
    description: '预留给下一个工具：也许是番茄钟、可视化小实验，或者一个 AI 辅助工作流。',
    href: '/notes',
    label: '计划中',
    title: '下一个小应用',
  },
]

export function HomePage() {
  return (
    <div className="page-view home-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">个人数字空间</p>
          <h1>一个用来启动小项目的个人实验台</h1>
          <p>
            这里会收纳已经完成和正在开发的小应用。每个项目都有独立页面，首页只负责提供入口和方向感。
          </p>
          <div aria-label="当前网站技术栈" className="hero-actions">
            <span>React + TypeScript</span>
            <span>Vite + Tailwind</span>
            <span>Vercel 部署</span>
          </div>
        </div>

        <div aria-hidden="true" className="hero-visual">
          <span className="orbital one" />
          <span className="orbital two" />
          <span className="orbital three" />
          <span className="signal-line" />
          <span className="signal-line second" />
        </div>
      </section>

      <section className="launch-section" aria-labelledby="launch-title">
        <div className="section-heading">
          <p className="eyebrow">项目入口</p>
          <h2 id="launch-title">从一个卡片进入一个小世界。</h2>
        </div>

        <div className="project-grid">
          {projectCards.map((card) => (
            <Link className="project-card" key={card.title} to={card.href}>
              <span>{card.label}</span>
              <strong>{card.title}</strong>
              <p>{card.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-grid" aria-label="项目结构说明">
        <article className="intro-panel">
          <p className="eyebrow">扩展方式</p>
          <h2>新增页面只需要补页面组件和路由配置。</h2>
          <p>
            导航来自集中配置，页面在 routes 里注册后就会自动出现在顶部。小项目可以继续放进 pages 或 games。
          </p>
        </article>

        <div className="stack-list">
          {routes.map((route, index) => (
            <div key={route.label}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{route.label}</strong>
              <p>{route.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

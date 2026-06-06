import { NavLink, Outlet } from 'react-router-dom'
import { navRoutes } from '../config/routes'

export function AppLayout() {
  return (
    <main className="site-shell min-h-screen overflow-hidden text-[#17211d]">
      <header className="site-header">
        <NavLink className="brand" to="/">
          <span className="brand-mark">J</span>
          <span>Jiayi 的项目启动台</span>
        </NavLink>

        <nav aria-label="主导航" className="tab-list">
          {navRoutes.map((route) => (
            <NavLink className={({ isActive }) => (isActive ? 'tab active' : 'tab')} key={route.href} to={route.href}>
              {route.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <section className="content-band">
        <Outlet />
      </section>
    </main>
  )
}

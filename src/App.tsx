import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { routes } from './config/routes'
import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />} path="/">
        {routes.map((route) =>
          route.index ? (
            <Route Component={route.Component} index key={route.label} />
          ) : (
            <Route Component={route.Component} key={route.label} path={route.path} />
          ),
        )}
        <Route element={<Navigate replace to="/" />} path="*" />
      </Route>
    </Routes>
  )
}

export default App

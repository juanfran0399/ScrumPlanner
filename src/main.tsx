import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './components/ThemeProvider'
import { TooltipProvider } from './components/ui/tooltip'
import './App.css'
import './index.css'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import ErrorBoundary from './pages/ErrorBoundary'
import Proyects from './pages/Proyects'
import Poker from './pages/Poker'
import Survey from './pages/Survey'
import Planning from './pages/Planning'
import Teams from './pages/Teams'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'proyects',
        element: <Proyects />
      },
      {
        path: 'poker',
        element: <Poker />
      },
      {
        path: 'survey',
        element: <Survey />
      },
      {
        path: 'planning',
        element: <Planning />
      },
      {
        path: 'teams',
        element: <Teams />
      }
    ]
  }
])

const rootElement = document.getElementById('root') as HTMLElement
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  </React.StrictMode>
)

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Layout from '@/components/Layout'
import { Button } from '@/components/ui/button'
import Chart from 'chart.js/auto'

const Analysis = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [fadeState, setFadeState] = useState<'enter' | 'exit'>('enter') // for managing transitions

  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart | null>(null) // Store the chart instance

  const projects = {
    'Sistema de Gestión de Inventario': ['Tarea 1', 'Tarea 2', 'Tarea 3'],
    'Aplicación de Tareas': ['Tarea 4', 'Tarea 5'],
    'Plataforma de Aprendizaje en Línea': ['Tarea 6', 'Tarea 7', 'Tarea 8'],
    'Sitio Web de Comercio Electrónico': ['Tarea 9', 'Tarea 10'],
    'Sistema de Reservas de Hotel': ['Tarea 11', 'Tarea 12']
  }

  const cards = ['0', '0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?', '∞']

  // Function to initialize or update the chart
  const createChart = () => {
    if (chartRef.current != null) {
      const ctx = chartRef.current.getContext('2d')
      if (ctx != null) {
        // If there's already a chart, destroy it before creating a new one
        if (chartInstanceRef.current != null) {
          chartInstanceRef.current.destroy()
        }

        // Create new chart
        chartInstanceRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Tarea 1', 'Tarea 2', 'Tarea 3', 'Tarea 4', 'Tarea 5'],
            datasets: [
              {
                label: 'Progress',
                data: [12, 19, 3, 5, 2],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        })
      }
    }
  }

  useEffect(() => {
    if (selectedProject) {
      createChart() // Create chart when a project is selected
    }
  }, [selectedProject])

  const handleProjectSelect = (project: string) => {
    // Trigger fade-out before changing project
    setFadeState('exit')
    setTimeout(() => {
      setSelectedProject(project)
      setSelectedTask(null) // Reset task when a new project is selected
      setSelectedCard(null) // Reset card when a new project is selected
      setFadeState('enter') // Trigger fade-in after project is selected
    }, 500) // Delay matches the transition time (0.5s)
  }

  return (
    <Layout>
      <div className='container mx-auto mt-8'>
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedProject ? `Analisis - ${selectedProject}` : 'Analisis'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Dropdown for project selection */}
            <div>
              <h4>Selecciona un proyecto:</h4>
              {Object.keys(projects).map((project) => (
                <Button key={project} onClick={() => handleProjectSelect(project)}>
                  {project}
                </Button>
              ))}
            </div>

            {/* Show chart with transition when a project is selected */}
            {selectedProject && (
              <>
                <Separator className='my-4' />
                <h4>{selectedProject} Progreso</h4>
                <div
                  className={`chart-container fade-${fadeState}`}
                  style={{ transition: 'opacity 0.5s' }}
                >
                  <canvas ref={chartRef} width='400' height='200' />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default Analysis

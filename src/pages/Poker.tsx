import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Layout from '@/components/Layout'
import { Button } from '@/components/ui/button'

const ScrumPoker = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const projects = {
    'Sistema de Gestión de Inventario': ['Tarea 1', 'Tarea 2', 'Tarea 3'],
    'Aplicación de Tareas': ['Tarea 4', 'Tarea 5'],
    'Plataforma de Aprendizaje en Línea': ['Tarea 6', 'Tarea 7', 'Tarea 8'],
    'Sitio Web de Comercio Electrónico': ['Tarea 9', 'Tarea 10'],
    'Sistema de Reservas de Hotel': ['Tarea 11', 'Tarea 12']
  }

  const cards = ['1', '2', '3', '5']

  const handleProjectSelect = (project: string) => {
    setSelectedProject(project)
    setSelectedTask(null) // Reiniciar la tarea cuando se selecciona un nuevo proyecto
    setSelectedCard(null) // Reiniciar la carta cuando se selecciona un nuevo proyecto
  }

  const handleTaskSelect = (task: string) => {
    setSelectedTask(task)
    setSelectedCard(null) // Reiniciar la carta cuando se selecciona una nueva tarea
  }

  const handleCardSelect = (card: string) => {
    setSelectedCard(card)
  }

  return (
    <Layout>
      <div className='container mx-auto mt-8'>
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedProject ? `Scrum Poker - ${selectedProject}` : 'Scrum Poker'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Selecciona un proyecto, una tarea y una carta para priorizar tareas:</p>

            {/* Selección de Proyecto */}
            <div className='flex flex-wrap gap-4'>
              {Object.keys(projects).map((project) => (
                <Button
                  key={project}
                  className={`m-2 ${selectedProject === project ? 'bg-[#9A3324] text-white' : ''}`}
                  onClick={() => handleProjectSelect(project)}
                >
                  {project}
                </Button>
              ))}
            </div>

            {/* Selección de Tarea */}
            {selectedProject && (
              <>
                <Separator className='my-4' />
                <div>
                  <h2>Backlog para el Proyecto: {selectedProject}</h2>
                  <div className='flex flex-wrap gap-4'>
                    {projects[selectedProject].map((task) => (
                      <Button
                        key={task}
                        className={`m-2 ${selectedTask === task ? 'bg-[#9A3324] text-white' : ''}`}
                        onClick={() => handleTaskSelect(task)}
                      >
                        {task}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Selección de Carta */}
            {selectedTask && (
              <>
                <Separator className='my-4' />
                <div>
                  <h3>Selecciona una carta para la tarea: {selectedTask}</h3>
                  <div className='flex flex-wrap gap-4'>
                    {cards.map((card) => (
                      <Button
                        key={card}
                        className={`m-2 ${selectedCard === card ? 'bg-[#9A3324] text-white' : ''}`}
                        onClick={() => handleCardSelect(card)}
                      >
                        {card}
                      </Button>
                    ))}
                  </div>

                  {/* Mostrar Carta Seleccionada */}
                  {selectedCard && (
                    <div className='mt-8 text-center'>
                      <h4 className='text-2xl'>Has seleccionado:</h4>
                      <div className='mt-4 text-6xl font-bold text-[#9A3324]'>{selectedCard}</div>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default ScrumPoker

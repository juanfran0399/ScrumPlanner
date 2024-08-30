import React, { useState, useEffect, FormEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import Layout from '@/components/Layout'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

// Define interfaces for the data
interface Task {
  task: string
  assignee: string
  status: string
}

interface Sprint {
  title: string
  start_date: string
  end_date: string
  objectives: string
  tasks: Task[]
}

const initialSprints: { [key: string]: Sprint } = {
  sprint1: {
    title: 'Sprint 1',
    start_date: '2024-08-05',
    end_date: '2024-08-19',
    objectives: 'Desarrollar la funcionalidad de usuario y autenticación.',
    tasks: [
      { task: 'Implementar registro de usuario', assignee: 'Juan Pérez', status: 'Pendiente' },
      { task: 'Implementar inicio de sesión', assignee: 'Ana López', status: 'En Progreso' }
    ]
  },
  sprint2: {
    title: 'Sprint 2',
    start_date: '2024-08-20',
    end_date: '2024-09-03',
    objectives: 'Desarrollar la funcionalidad de pagos y reportes.',
    tasks: [
      { task: 'Implementar pasarela de pagos', assignee: 'Luis Gómez', status: 'Pendiente' },
      { task: 'Desarrollar módulo de reportes', assignee: 'María López', status: 'Pendiente' }
    ]
  }
}

const SprintPlanning: React.FC = () => {
  const [sprints, setSprints] = useState<{ [key: string]: Sprint }>(initialSprints)
  const [selectedSprint, setSelectedSprint] = useState<string>('sprint1')
  const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null)
  const [newTask, setNewTask] = useState<string>('')
  const [assignee, setAssignee] = useState<string>('')
  const [objectives, setObjectives] = useState<string>('')

  useEffect(() => {
    setCurrentSprint(sprints[selectedSprint] || null)
  }, [selectedSprint, sprints])

  const handleSprintChange = (value: string) => {
    setSelectedSprint(value)
  }

  const handleAddTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (currentSprint != null) {
      const updatedSprint = { ...currentSprint }
      updatedSprint.tasks.push({ task: newTask, assignee, status: 'Pendiente' })
      setSprints({
        ...sprints,
        [selectedSprint]: updatedSprint
      })
      setNewTask('')
      setAssignee('')
    }
  }

  const handleDeleteTask = (index: number) => {
    if (currentSprint != null) {
      const updatedSprint = { ...currentSprint }
      updatedSprint.tasks.splice(index, 1)
      setSprints({
        ...sprints,
        [selectedSprint]: updatedSprint
      })
    }
  }

  const handleUpdateObjectives = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (currentSprint != null) {
      const updatedSprint = { ...currentSprint, objectives }
      setSprints({
        ...sprints,
        [selectedSprint]: updatedSprint
      })
    }
  }

  return (
    <Layout>
      <div id='main-content' style={{ padding: '20px' }}>
        <div className='container'>
          {/* Card para seleccionar el sprint */}
          <Card>
            <CardHeader>
              <CardTitle>Selecciona un Sprint</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => e.preventDefault()}>
                <Label htmlFor='sprint'>Sprint:</Label>
                <Select value={selectedSprint} onValueChange={handleSprintChange}>
                  <SelectTrigger id='sprint'>
                    <SelectValue placeholder='Selecciona un Sprint' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(sprints).map(([key, sprint]) => (
                      <SelectItem key={key} value={key}>
                        {sprint.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </form>
            </CardContent>
          </Card>

          {(currentSprint != null)
            ? (
              <>
                {/* Card para detalles del sprint */}
                <Card style={{ marginTop: '20px' }}>
                  <CardHeader>
                    <CardTitle>Detalles del Sprint</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Objetivos:</strong> {currentSprint.objectives}</p>
                    <p><strong>Fechas:</strong> Desde {currentSprint.start_date} hasta {currentSprint.end_date}</p>
                  </CardContent>
                </Card>

                {/* Card para el backlog del sprint */}
                <Card style={{ marginTop: '20px' }}>
                  <CardHeader>
                    <CardTitle>Backlog del Sprint</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul>
                      {currentSprint.tasks.map((task, index) => (
                        <li key={index} style={{ marginBottom: '10px' }}>
                          <strong>Tarea:</strong> {task.task} <br />
                          <strong>Responsable:</strong> {task.assignee} <br />
                          <strong>Estado:</strong> {task.status}
                          <form onSubmit={() => handleDeleteTask(index)} style={{ display: 'inline', marginLeft: '10px' }}>
                            <Button type='submit' variant='danger' onClick={() => handleDeleteTask(index)}>
                              Eliminar
                            </Button>
                          </form>
                        </li>
                      ))}
                    </ul>

                    <h3>Agregar Nueva Tarea</h3>
                    <form onSubmit={handleAddTask}>
                      <div className='form-group'>
                        <Label htmlFor='new_task'>Tarea:</Label>
                        <Input
                          id='new_task'
                          value={newTask}
                          onChange={(e) => setNewTask(e.target.value)}
                          required
                        />
                      </div>
                      <div className='form-group'>
                        <Label htmlFor='assignee'>Responsable:</Label>
                        <Input
                          id='assignee'
                          value={assignee}
                          onChange={(e) => setAssignee(e.target.value)}
                          required
                        />
                      </div>
                      <Button type='submit' style={{ marginTop: '10px' }}>Agregar Tarea</Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Card para actualizar los objetivos del sprint */}
                <Card style={{ marginTop: '20px' }}>
                  <CardHeader>
                    <CardTitle>Actualizar Objetivos del Sprint</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateObjectives}>
                      <Textarea
                        value={objectives}
                        onChange={(e) => setObjectives(e.target.value)}
                        rows={4}
                        cols={50}
                      />
                      <Button type='submit' style={{ marginTop: '10px' }}>Actualizar Objetivos</Button>
                    </form>
                  </CardContent>
                </Card>
              </>
              )
            : (
              <p>No hay datos del sprint seleccionado.</p>
              )}
        </div>
      </div>
    </Layout>
  )
}

export default SprintPlanning

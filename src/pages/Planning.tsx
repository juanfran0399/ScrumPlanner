import React, { useState, FormEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import Layout from '@/components/Layout'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Bar } from 'react-chartjs-2'

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

const initialSprints: Sprint[] = [
  {
    title: 'Sprint 1',
    start_date: '2024-08-05',
    end_date: '2024-08-19',
    objectives: 'Desarrollar la funcionalidad de usuario y autenticación.',
    tasks: [
      { task: 'Implementar registro de usuario', assignee: 'Juan Pérez', status: 'Pendiente' },
      { task: 'Implementar inicio de sesión', assignee: 'Ana López', status: 'En Progreso' },
      { task: 'Crear perfil de usuario', assignee: 'Carlos Torres', status: 'Pendiente' },
      { task: 'Agregar recuperación de contraseña', assignee: 'Lucía Martínez', status: 'Pendiente' },
      { task: 'Configurar autenticación de dos factores', assignee: 'Fernando Díaz', status: 'Pendiente' }
    ]
  },
  {
    title: 'Sprint 2',
    start_date: '2024-08-20',
    end_date: '2024-09-03',
    objectives: 'Desarrollar la funcionalidad de pagos y reportes.',
    tasks: [
      { task: 'Implementar pasarela de pagos', assignee: 'Luis Gómez', status: 'Pendiente' },
      { task: 'Desarrollar módulo de reportes', assignee: 'María López', status: 'Pendiente' },
      { task: 'Agregar historial de transacciones', assignee: 'Pedro Jiménez', status: 'Pendiente' },
      { task: 'Configurar notificaciones de pago', assignee: 'Sara Ortega', status: 'Pendiente' },
      { task: 'Realizar pruebas de integración de pagos', assignee: 'José Hernández', status: 'Pendiente' }
    ]
  }
]

const SprintPlanning: React.FC = () => {
  const [sprints, setSprints] = useState<Sprint[]>(initialSprints)
  const [selectedSprintIndex, setSelectedSprintIndex] = useState<number>(0)
  const [newTask, setNewTask] = useState<string>('')
  const [assignee, setAssignee] = useState<string>('')
  const [objectives, setObjectives] = useState<string>('')
  const [newSprintTitle, setNewSprintTitle] = useState<string>('')
  const [newSprintStartDate, setNewSprintStartDate] = useState<string>('')
  const [newSprintEndDate, setNewSprintEndDate] = useState<string>('')

  const currentSprint = sprints[selectedSprintIndex]

  const handleAddTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (currentSprint) {
      const updatedSprint = { ...currentSprint, tasks: [...currentSprint.tasks, { task: newTask, assignee, status: 'Pendiente' }] }
      setSprints(sprints.map((sprint, index) => (index === selectedSprintIndex ? updatedSprint : sprint)))
      setNewTask('')
      setAssignee('')
    }
  }

  const handleDeleteTask = (index: number) => {
    if (currentSprint) {
      const updatedSprint = { ...currentSprint }
      updatedSprint.tasks.splice(index, 1)
      setSprints(sprints.map((sprint, i) => (i === selectedSprintIndex ? updatedSprint : sprint)))
    }
  }

  const handleUpdateObjectives = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (currentSprint) {
      const updatedSprint = { ...currentSprint, objectives }
      setSprints(sprints.map((sprint, index) => (index === selectedSprintIndex ? updatedSprint : sprint)))
    }
  }

  const handleAddSprint = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const newSprint: Sprint = {
      title: newSprintTitle,
      start_date: newSprintStartDate,
      end_date: newSprintEndDate,
      objectives: '',
      tasks: []
    }
    setSprints([...sprints, newSprint])
    setNewSprintTitle('')
    setNewSprintStartDate('')
    setNewSprintEndDate('')
  }

  // Gráfica de tareas completadas por estado
  const getChartData = () => {
    const labels = ['Pendiente', 'En Progreso', 'Completada']
    const taskCounts = labels.map(status => currentSprint.tasks.filter(task => task.status === status).length)

    return {
      labels,
      datasets: [
        {
          label: 'Cantidad de Tareas',
          data: taskCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    }
  }

  return (
    <Layout>
      <div id='main-content' style={{ padding: '20px' }}>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {/* Card para seleccionar el sprint */}
          <Card>
            <CardHeader>
              <CardTitle>Selecciona un Sprint</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={String(selectedSprintIndex)} onValueChange={(value) => setSelectedSprintIndex(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder='Selecciona un Sprint' />
                </SelectTrigger>
                <SelectContent>
                  {sprints.map((sprint, index) => (
                    <SelectItem key={index} value={String(index)}>
                      {sprint.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Card para agregar un nuevo sprint */}
          <Card>
            <CardHeader>
              <CardTitle>Agregar Nuevo Sprint</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSprint}>
                <Label htmlFor='new_sprint_title'>Título:</Label>
                <Input id='new_sprint_title' value={newSprintTitle} onChange={(e) => setNewSprintTitle(e.target.value)} required />
                <Label htmlFor='new_sprint_start_date'>Fecha de Inicio:</Label>
                <Input type='date' id='new_sprint_start_date' value={newSprintStartDate} onChange={(e) => setNewSprintStartDate(e.target.value)} required />
                <Label htmlFor='new_sprint_end_date'>Fecha de Fin:</Label>
                <Input type='date' id='new_sprint_end_date' value={newSprintEndDate} onChange={(e) => setNewSprintEndDate(e.target.value)} required />
                <Button type='submit' style={{ marginTop: '10px' }}>Agregar Sprint</Button>
              </form>
            </CardContent>
          </Card>

          {/* Card para detalles del sprint */}
          {currentSprint && (
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Sprint</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Objetivos:</strong> {currentSprint.objectives}</p>
                <p><strong>Fechas:</strong> Desde {currentSprint.start_date} hasta {currentSprint.end_date}</p>
              </CardContent>
            </Card>
          )}

          {/* Card para el backlog del sprint */}
          {currentSprint && (
            <Card>
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
                      <Button type='button' variant='destructive' onClick={() => handleDeleteTask(index)} style={{ marginLeft: '10px' }}>Eliminar</Button>
                    </li>
                  ))}
                </ul>
                <form onSubmit={handleAddTask}>
                  <Label htmlFor='new_task'>Agregar Nueva Tarea:</Label>
                  <Input id='new_task' value={newTask} onChange={(e) => setNewTask(e.target.value)} required />
                  <Label htmlFor='assignee'>Responsable:</Label>
                  <Input id='assignee' value={assignee} onChange={(e) => setAssignee(e.target.value)} required />
                  <Button type='submit' style={{ marginTop: '10px' }}>Agregar Tarea</Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Card para actualizar objetivos */}
          {currentSprint && (
            <Card>
              <CardHeader>
                <CardTitle>Actualizar Objetivos del Sprint</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateObjectives}>
                  <Label htmlFor='objectives'>Objetivos:</Label>
                  <Textarea id='objectives' value={objectives} onChange={(e) => setObjectives(e.target.value)} required />
                  <Button type='submit' style={{ marginTop: '10px' }}>Actualizar Objetivos</Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Card para gráficas de tareas */}
          {currentSprint && (
            <Card>
              <CardHeader>
                <CardTitle>Gráfica de Tareas por Estado</CardTitle>
              </CardHeader>
              <CardContent>
                <Bar data={getChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default SprintPlanning

import React, { useState, useEffect, FormEvent } from 'react'
import axios from 'axios'
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
  id: number
  title: string
  start_date: string
  end_date: string
  objectives: string
  tasks: Task[]
}

const SprintPlanning: React.FC = () => {
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [selectedSprintIndex, setSelectedSprintIndex] = useState<number>(0)
  const [newTask, setNewTask] = useState<string>('')
  const [assignee, setAssignee] = useState<string>('')
  const [objectives, setObjectives] = useState<string>('')
  const [newSprintTitle, setNewSprintTitle] = useState<string>('')
  const [newSprintStartDate, setNewSprintStartDate] = useState<string>('')
  const [newSprintEndDate, setNewSprintEndDate] = useState<string>('')
  const [teamId, setTeamId] = useState<number | null>(null)
  const [userId, setUserId] = useState<number | null>(null)

  // Retrieve user_id from localStorage when the component mounts
  useEffect(() => {
    const storedUserId = parseInt(localStorage.getItem('id_usuario') || '0', 10)
    if (storedUserId) {
      setUserId(storedUserId)
    }
  }, [])

  // Fetch team_id using the user_id and store it in localStorage
  useEffect(() => {
    const fetchTeamId = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/sprint/team/${userId}`)
          const fetchedTeamId = response.data.team_id
          setTeamId(fetchedTeamId)
          localStorage.setItem('team_id', fetchedTeamId.toString())
          fetchSprints(fetchedTeamId) // Fetch sprints after getting the team_id
        } catch (error) {
          console.error('Error fetching team_id:', error)
        }
      }
    }
    fetchTeamId()
  }, [userId])

  const currentSprint = sprints[selectedSprintIndex] || null // Handle undefined case

  // Fetch all sprints from the backend
  const fetchSprints = async (teamId: number) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/sprint/all-sprints/${teamId}`)
      setSprints(response.data.sprints)
    } catch (error) {
      console.error('Error fetching sprints:', error)
    }
  }

  const handleAddTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentSprint) return // Ensure currentSprint is defined
    try {
      const response = await axios.post('http://localhost:5000/api/sprint/add-task', {
        sprint_id: currentSprint.id,
        task: newTask,
        user_id: userId,
        status: 'Pendiente',
        active: true
      })

      setSprints(sprints.map((sprint, index) =>
        index === selectedSprintIndex ? { ...sprint, tasks: [...(sprint.tasks || []), response.data] } : sprint
      ))

      setNewTask('')
      setAssignee('')
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const handleDeleteTask = (index: number) => {
    if (currentSprint) {
      const updatedSprint = { ...currentSprint }
      updatedSprint.tasks = updatedSprint.tasks ? [...updatedSprint.tasks] : []
      updatedSprint.tasks.splice(index, 1)
      setSprints(sprints.map((sprint, i) => (i === selectedSprintIndex ? updatedSprint : sprint)))
    }
  }

  const handleUpdateObjectives = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentSprint) return // Ensure currentSprint is defined
    try {
      await axios.put('http://localhost:5000/api/sprint/update-objective', {
        sprint_id: currentSprint.id,
        objective: objectives
      })

      setSprints(sprints.map((sprint, index) =>
        index === selectedSprintIndex ? { ...sprint, objectives } : sprint
      ))
    } catch (error) {
      console.error('Error updating objectives:', error)
    }
  }

  const handleAddSprint = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/api/sprint/add-sprint', {
        user_id: userId,
        team_id: teamId,
        title: newSprintTitle,
        start_date: newSprintStartDate,
        end_date: newSprintEndDate
      })

      setSprints([...sprints, response.data])
      setNewSprintTitle('')
      setNewSprintStartDate('')
      setNewSprintEndDate('')
    } catch (error) {
      console.error('Error adding sprint:', error)
    }
  }

  // Gráfica de tareas completadas por estado
  const getChartData = () => {
    if (!currentSprint || !currentSprint.tasks) return { labels: [], datasets: [] } // Handle undefined case

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
        },
      ]
    };
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
                  {sprints.length > 0 ? (
                    sprints.map((sprint, index) => (
                      <SelectItem key={index} value={String(index)}>
                        {sprint.title}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No hay sprints disponibles</SelectItem> // Handling case of empty sprints
                  )}
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
                <form onSubmit={handleUpdateObjectives}>
                  <Label htmlFor='objectives'>Actualizar Objetivos:</Label>
                  <Textarea id='objectives' value={objectives} onChange={(e) => setObjectives(e.target.value)} required />
                  <Button type='submit' style={{ marginTop: '10px' }}>Actualizar Objetivos</Button>
                </form>
                <h3>Tareas</h3>
                <form onSubmit={handleAddTask}>
                  <Label htmlFor='new_task'>Nueva Tarea:</Label>
                  <Input id='new_task' value={newTask} onChange={(e) => setNewTask(e.target.value)} required />
                  <Button type='submit' style={{ marginTop: '10px' }}>Agregar Tarea</Button>
                </form>
                <ul>
                  {currentSprint.tasks && currentSprint.tasks.length > 0 ? (
                    currentSprint.tasks.map((task, index) => (
                      <li key={index}>
                        {task.task} - {task.status}
                        <Button onClick={() => handleDeleteTask(index)}>Eliminar</Button>
                      </li>
                    ))
                  ) : (
                    <li>No hay tareas para este sprint.</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Gráfica de tareas */}
        {currentSprint && currentSprint.tasks && (
          <div style={{ marginTop: '20px' }}>
            <Bar data={getChartData()} options={{ responsive: true }} />
          </div>
        )}
      </div>
    </Layout>
  )
}

export default SprintPlanning

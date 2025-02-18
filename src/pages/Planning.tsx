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

// Interfaces for Sprint and Task
interface Task {
  task: string
  assignee?: string
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
  const [objectives, setObjectives] = useState<string>('')
  const [newSprintTitle, setNewSprintTitle] = useState<string>('')
  const [newSprintStartDate, setNewSprintStartDate] = useState<string>('')
  const [newSprintEndDate, setNewSprintEndDate] = useState<string>('')
  const [teamId, setTeamId] = useState<number | null>(null)
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    const storedUserId = parseInt(localStorage.getItem('id_usuario') || '0', 10)
    if (storedUserId) setUserId(storedUserId)
  }, [])

  useEffect(() => {
    if (userId) {
      const fetchTeamId = async () => {
        try {
          const { data } = await axios.get(`http://localhost:5000/api/sprint/team/${userId}`)
          setTeamId(data.team_id)
          localStorage.setItem('team_id', data.team_id.toString())
          fetchSprints(data.team_id)
        } catch (error) {
          console.error('Error fetching team ID:', error)
        }
      }
      fetchTeamId()
    }
  }, [userId])

  const fetchSprints = async (teamId: number) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/sprint/all-sprints/${teamId}`)
      setSprints(data.sprints)
    } catch (error) {
      console.error('Error fetching sprints:', error)
    }
  }

  const currentSprint = sprints[selectedSprintIndex] || null

  const handleObjectivesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedObjectives = e.target.value
    setObjectives(updatedObjectives)
    localStorage.setItem('objectives', updatedObjectives)
  }

  const handleAddTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!currentSprint) return

    try {
      const { data } = await axios.post('http://localhost:5000/api/sprint/add-task', {
        sprint_id: currentSprint.id,
        task: newTask,
        user_id: userId,
        status: 'Pendiente',
        active: true
      })

      setSprints(
        sprints.map((sprint, index) =>
          index === selectedSprintIndex ? { ...sprint, tasks: [...sprint.tasks, data] } : sprint
        )
      )
      setNewTask('')
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const handleAddSprint = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const { data } = await axios.post('http://localhost:5000/api/sprint/add-sprint', {
        user_id: userId,
        team_id: teamId,
        title: newSprintTitle,
        start_date: newSprintStartDate,
        end_date: newSprintEndDate
      })

      setSprints([...sprints, data])
      setNewSprintTitle('')
      setNewSprintStartDate('')
      setNewSprintEndDate('')
    } catch (error) {
      console.error('Error adding sprint:', error)
    }
  }

  const getChartData = () => {
    if (!currentSprint?.tasks) return { labels: [], datasets: [] }

    const labels = ['Pendiente', 'En Progreso', 'Completada']
    const taskCounts = labels.map(
      (status) => currentSprint.tasks.filter((task) => task.status === status).length
    )

    return {
      labels,
      datasets: [
        {
          label: 'Cantidad de Tareas',
          data: taskCounts,
          backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0']
        }
      ]
    }
  }

  return (
    <Layout>
      <div className='p-6'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Selecciona un Sprint</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={String(selectedSprintIndex)}
                onValueChange={(value) => setSelectedSprintIndex(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecciona un Sprint' />
                </SelectTrigger>
                <SelectContent>
                  {sprints && sprints.length > 0
                    ? (
                        sprints.map((sprint, index) => (
                          <SelectItem key={sprint.id || index} value={String(index)}>
                            {sprint.title}
                          </SelectItem>
                        ))
                      )
                    : (
                      <SelectItem disabled value='_no_sprints_'>
                        No hay sprints disponibles
                      </SelectItem>
                      )}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agregar Nuevo Sprint</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSprint}>
                <Label htmlFor='newSprintTitle'>Título:</Label>
                <Input
                  id='newSprintTitle'
                  value={newSprintTitle}
                  onChange={(e) => setNewSprintTitle(e.target.value)}
                  required
                />
                <Label htmlFor='newSprintStartDate'>Fecha de Inicio:</Label>
                <Input
                  type='date'
                  id='newSprintStartDate'
                  value={newSprintStartDate}
                  onChange={(e) => setNewSprintStartDate(e.target.value)}
                  required
                />
                <Label htmlFor='newSprintEndDate'>Fecha de Fin:</Label>
                <Input
                  type='date'
                  id='newSprintEndDate'
                  value={newSprintEndDate}
                  onChange={(e) => setNewSprintEndDate(e.target.value)}
                  required
                />
                <Button type='submit' className='mt-4'>
                  Agregar Sprint
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {currentSprint && (
          <div className='mt-6'>
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Sprint</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Título:</strong> {currentSprint.title}</p>
                <p><strong>Fecha de Inicio:</strong> {currentSprint.start_date}</p>
                <p><strong>Fecha de Fin:</strong> {currentSprint.end_date}</p>
                <p><strong>Objetivos:</strong> {currentSprint.objectives}</p>
                <form onSubmit={handleObjectivesChange}>
                  <Textarea
                    value={objectives}
                    onChange={handleObjectivesChange}
                    placeholder='Actualizar objetivos'
                    required
                  />
                  <Button className='mt-4' type='submit'>Guardar Objetivos</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {currentSprint?.tasks && (
          <div className='mt-6'>
            <Bar data={getChartData()} options={{ responsive: true }} />
          </div>
        )}
      </div>
    </Layout>
  )
}

export default SprintPlanning

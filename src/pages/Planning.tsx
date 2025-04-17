import React, { useState, useEffect, FormEvent } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import Layout from '@/components/Layout'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

// Interfaces for Sprint and Task
interface Task {
  task: string
  assignee?: string
  status: string
}

interface Sprint {
  sprint_id: string
  objectives: string
  id: number
  title: string
  start_date: string
  end_date: string
  tasks: Task[]
}

const SprintPlanning: React.FC = () => {
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [selectedSprintIndex, setSelectedSprintIndex] = useState<number>(0)
  const [objectives, setObjectives] = useState<string>('') // Ensure the objectives are initialized properly
  const [newSprintStartDate, setNewSprintStartDate] = useState<string>('')
  const [newSprintEndDate, setNewSprintEndDate] = useState<string>('')
  const [teamId, setTeamId] = useState<number | null>(null)
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    const storedUserId = parseInt(localStorage.getItem('id_usuario') || '0', 10)
    if (storedUserId) setUserId(storedUserId)
  }, [])

  useEffect(() => {
    if (currentSprint) {
      console.log('Current Sprint:', currentSprint)
      setObjectives(currentSprint.objectives)
    }
  }, [selectedSprintIndex, sprints])

  useEffect(() => {
    // Check if there is a stored selected sprint index in localStorage
    const storedSprintIndex = localStorage.getItem('selectedSprintIndex')
    if (storedSprintIndex) {
      const index = parseInt(storedSprintIndex, 10)
      setSelectedSprintIndex(index)
    }
  }, [])

  useEffect(() => {
    if (currentSprint) {
      // Store the current sprint's ID in localStorage when selectedSprintIndex changes
      localStorage.setItem('selectedSprintId', String(currentSprint.id))
    }
  }, [selectedSprintIndex, sprints])

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
      if (data.sprints.length > 0) {
        const currentSprint = data.sprints[selectedSprintIndex]
        setObjectives(currentSprint.objectives || '') // Set objectives based on the current sprint
      }
    } catch (error) {
      console.error('Error fetching sprints:', error)
    }
  }

  const currentSprint = sprints[selectedSprintIndex] || null

  const handleCarga = async (): Promise<void> => {
    if (!userId || !currentSprint?.sprint_id) {
      console.error('User ID or Sprint ID is missing')
      return
    }

    try {
      await axios.post('http://localhost:5000/api/modelo/carga', {
        user_id: userId,
        sprint_id: currentSprint.sprint_id
      })
      console.log('Carga saved successfully')
    } catch (error) {
      console.error('Error saving carga:', error)
    }
  }

  useEffect(() => {
    if (currentSprint) {
      setObjectives(currentSprint.objectives)
    }
  }, [selectedSprintIndex, sprints])

  const handleObjectivesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedObjectives = e.target.value
    setObjectives(updatedObjectives)
    localStorage.setItem('objectives', updatedObjectives)
  }

  const handleAddSprint = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    if (!teamId) {
      console.error('Team ID is missing')
      return
    }

    try {
      // Fetch existing sprints for the team
      const { data } = await axios.get(`http://localhost:5000/api/sprint/all-sprints/${teamId}`)
      const sprintCount = data.sprints.length
      const nextSprintTitle = `Sprint ${sprintCount + 1}`

      const response = await axios.post('http://localhost:5000/api/sprint/add-sprint', {
        user_id: userId,
        team_id: teamId,
        title: nextSprintTitle,
        start_date: newSprintStartDate,
        end_date: newSprintEndDate
      })

      setSprints([...sprints, response.data])
      setNewSprintStartDate('')
      setNewSprintEndDate('')
      window.location.reload()
    } catch (error) {
      console.error('Error adding sprint:', error)
    }
  }

  const handleSaveObjectives = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!currentSprint || !currentSprint.sprint_id) {
      console.error('Sprint ID is required') // Log the error if no sprint ID is found
      return
    }

    try {
      console.log('Saving objectives:', objectives, 'for Sprint ID:', currentSprint.sprint_id) // Debug log

      await axios.put('http://localhost:5000/api/sprint/update-objective', {
        sprint_id: currentSprint.sprint_id,
        objectives
      })

      // Update the local sprints state after successfully saving the objectives
      setSprints(
        sprints.map((sprint, index) =>
          index === selectedSprintIndex ? { ...sprint, objectives } : sprint
        )
      )
      console.log('Sprint objectives updated successfully')
      window.location.reload()
    } catch (error) {
      console.error('Error updating objectives:', error)
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
                <p><strong>Próximo Sprint:</strong> Sprint {sprints.length + 1}</p>
                <Label htmlFor='newSprintStartDate'>Fecha de Inicio:</Label>
                <Input
                  type='date'
                  id='newSprintStartDate'
                  value={newSprintStartDate}
                  onChange={(e) => setNewSprintStartDate(e.target.value)}
                  required
                  className='text-black bg-gray-300'
                />
                <Label htmlFor='newSprintEndDate'>Fecha de Fin:</Label>
                <Input
                  type='date'
                  id='newSprintEndDate'
                  value={newSprintEndDate}
                  onChange={(e) => setNewSprintEndDate(e.target.value)}
                  required
                  className='text-black bg-gray-300'
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
                <p><strong>Fecha de Inicio:</strong> {new Date(currentSprint.start_date).toISOString().split('T')[0]}</p>
                <p><strong>Fecha de Fin:</strong> {new Date(currentSprint.end_date).toISOString().split('T')[0]}</p>
                <p><strong>Objetivos:</strong> {currentSprint.objectives}</p>
                <form onSubmit={handleSaveObjectives}>
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

        {currentSprint && (
          <div className='mt-6'>
            <Button onClick={handleCarga}>Enviar Carga</Button>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default SprintPlanning

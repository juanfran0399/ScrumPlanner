import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Layout from '@/components/Layout'
import { Button } from '@/components/ui/button'
import axios from 'axios'

interface Sprint {
  id: string
  name: string
  title: string
} // Added type definition for Sprint

const ScrumPoker: React.FC = () => {
  const [sprints, setSprints] = useState<Sprint[]>([]) // Updated type to Sprint[]
  const [tasks, setTasks] = useState<any[]>([]) // Updated type to any[] to match usage
  const [selectedSprint, setSelectedSprint] = useState('')
  const [selectedTask, setSelectedTask] = useState('')
  const [selectedVote, setSelectedVote] = useState('')

  useEffect(() => {
    const fetchSprints = async (): Promise<void> => {
      const teamId = localStorage.getItem('team_id')
      if (!teamId) {
        console.error('No team_id found in localStorage')
        return
      }
      try {
        const response = await axios.get(`http://localhost:5000/api/sprint/all-sprints/${teamId}`)
        setSprints(Array.isArray(response.data.sprints) ? response.data.sprints : [])
      } catch (error) {
        console.error('Error fetching sprints:', error)
        setSprints([])
      }
    }
    fetchSprints()
  }, [])

  const fetchTasks = async (sprintId: string): Promise<void> => {
    try {
      const response = await axios.get(`/api/tasks?sprintId=${sprintId}&complexity=Votacion`)
      setTasks(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setTasks([])
    }
  }

  const handleSprintChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const sprintId = event.target.value
    setSelectedSprint(sprintId)
    setSelectedTask('')
    setSelectedVote('')
    if (sprintId) void fetchTasks(sprintId)
  }

  const handleVoteSubmit = async (): Promise<void> => {
    if (!selectedTask || !selectedVote) {
      alert('Por favor selecciona una tarea y un voto.')
      return
    }

    try {
      await axios.post('/api/vote', { taskId: selectedTask, vote: selectedVote })
      alert('Voto registrado exitosamente')
    } catch (error) {
      console.error('Error submitting vote:', error)
      alert('Hubo un error al registrar el voto')
    }
  }

  return (
    <Layout>
      <div className='container mx-auto mt-8'>
        <Card>
          <CardHeader>
            <CardTitle>Scrum Poker</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Selecciona un Sprint y una tarea para votar:</p>

            {/* Sprint Selection */}
            <div className='my-4'>
              <label className='block text-sm font-medium'>Selecciona un Sprint:</label>
              <select value={selectedSprint} onChange={handleSprintChange} className='w-full p-2 border rounded'>
                <option value=''>-- Seleccionar Sprint --</option>
                {sprints.map((sprint) => (
                  <option key={sprint.id} value={sprint.id}>{sprint.name} - {sprint.title}</option>
                ))}
              </select>
            </div>

            {/* Task Selection */}
            {selectedSprint && tasks.length > 0 && (
              <div className='my-4'>
                <label className='block text-sm font-medium'>Selecciona una Tarea:</label>
                <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)} className='w-full p-2 border rounded'>
                  <option value=''>-- Seleccionar Tarea --</option>
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>{task.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Voting Section */}
            {selectedTask && (
              <>
                <Separator className='my-4' />
                <label className='block text-sm font-medium'>Selecciona tu voto:</label>
                <select value={selectedVote} onChange={(e) => setSelectedVote(e.target.value)} className='w-full p-2 border rounded'>
                  <option value=''>-- Seleccionar Voto --</option>
                  {[1, 2, 3, 4, 5].map((vote) => (
                    <option key={vote} value={vote}>{vote}</option>
                  ))}
                </select>
                <Button onClick={handleVoteSubmit} className='mt-4 w-full bg-[#9A3324] text-white'>
                  Enviar Voto
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default ScrumPoker

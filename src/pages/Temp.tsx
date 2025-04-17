import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { IconPlus } from '@tabler/icons-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const API_BASE_URL = 'http://localhost:5000/api/planner'
const columns = ['Backlog', 'Listo para asignar', 'En desarrollo', 'En revisión', 'Terminado']
const complexityOptions = ['Baja', 'Media', 'Alta']

const TaskManagerPlanner = () => {
  const [tasks, setTasks] = useState<any[]>([]) // Updated type to any[] to match usage
  const [newTask, setNewTask] = useState({ title: '', description: '', complexity: 'Baja', assignedTo: '' })
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)
  const [teamMembers, setTeamMembers] = useState<Array<{ user_id: number; username: string }>>([]) // Updated type to match usage

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks`)
        const data = await response.json()
        setTasks(data.tasks)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }

    fetchTasks()
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    const teamId = localStorage.getItem('team_id')
    if (!teamId) return

    try {
      const response = await fetch(`http://localhost:5000/api/team/members/${teamId}`)
      const data = await response.json()
      setTeamMembers(data.members || [])
    } catch (error) {
      console.error('Error fetching team members:', error)
      setTeamMembers([])
    }
  }

  const addTask = async () => {
    if (newTask.title && newTask.description && newTask.assignedTo) {
      const newTaskData = {
        title: newTask.title,
        description: newTask.description,
        status: 'Backlog',
        assignedTo: newTask.assignedTo,
        complexity: newTask.complexity
      }

      try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTaskData)
        })

        if (response.ok) {
          const { taskId } = await response.json()
          setTasks((prevTasks) => [...prevTasks, { ...newTaskData, id: taskId }])
          setNewTask({ title: '', description: '', complexity: 'Baja', assignedTo: '' })
          setIsNewTaskDialogOpen(false)
        }
      } catch (error) {
        console.error('Error adding task:', error)
      }
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout>
        <div className='p-6'>
          <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <IconPlus className='inline-block mr-1' /> Agregar Nueva Tarea
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nueva Tarea</DialogTitle>
              </DialogHeader>
              <div className='flex flex-col space-y-4'>
                <Input
                  type='text'
                  placeholder='Título de la tarea'
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <Input
                  type='text'
                  placeholder='Descripción de la tarea'
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                <Select
                  value={newTask.complexity}
                  onValueChange={(value) => setNewTask({ ...newTask, complexity: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccionar complejidad' />
                  </SelectTrigger>
                  <SelectContent>
                    {complexityOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={newTask.assignedTo}
                  onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccionar miembro del equipo' />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.user_id} value={String(member.user_id)}>
                        {member.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addTask}>Añadir</Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className='grid grid-cols-5 gap-4 mt-6'>
            {columns.map((status) => (
              <div key={status} className='p-4 border rounded'>
                <h2 className='text-lg font-bold'>{status}</h2>
                <div className='mt-2'>
                  {tasks.filter((task) => task.status === status).map((task) => (
                    <Card key={task.id} className='mb-2'>
                      <CardHeader>
                        <CardTitle>{task.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{task.description}</p>
                        <Separator className='my-2' />
                        <p><strong>Asignado a:</strong> {task.assignedTo}</p>
                        <Badge variant='outline'>{task.complexity}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </DndProvider>
  )
}

export default TaskManagerPlanner

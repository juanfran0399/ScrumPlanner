import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { IconPlus } from '@tabler/icons-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const API_BASE_URL = 'http://localhost:5000/api/planner'
const columns = ['Backlog', 'Listo para asignar', 'En desarrollo', 'En revisión', 'Terminado']
const complexityOptions = ['Basica', 'Moderada', 'Intermedia', 'Avanzada', 'Epica']

const TaskManagerPlanner: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([])
  const [newTask, setNewTask] = useState({ title: '', description: '', complexity: '', assignedTo: '', sprint: '' })
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [sprints, setSprints] = useState<any[]>([])
  const [selectedSprint, setSelectedSprint] = useState<string | null>(null)

  const fetchTasks = async (): Promise<void> => {
    const teamId = localStorage.getItem('team_id')
    if (teamId === null || teamId === '') return

    try {
      const response = await fetch(`http://localhost:5000/api/planner/tasks/${teamId}`)
      const data = await response.json()

      if (Array.isArray(data.tasks) && data.tasks.length > 0) {
        setTasks(data.tasks)
      } else {
        setTasks([])
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setTasks([])
    }
  }

  const fetchTeamMembers = async (): Promise<void> => {
    const teamId = localStorage.getItem('team_id')
    if (teamId === null || teamId === '') return

    try {
      const response = await fetch(`http://localhost:5000/api/team/members/${teamId}`)
      const data = await response.json()
      const members = Array.isArray(data.members) ? data.members : []
      setTeamMembers(members)
      localStorage.setItem('team_members', JSON.stringify(members))
    } catch (error) {
      console.error('Error fetching team members:', error)
    }
  }

  const fetchSprints = async (): Promise<void> => {
    const teamId = localStorage.getItem('team_id')
    if (teamId === null || teamId === '') return

    try {
      const response = await fetch(`http://localhost:5000/api/sprint/all-sprints/${teamId}`)
      const data = await response.json()
      const sprints = Array.isArray(data.sprints) ? data.sprints : []
      setSprints(sprints)
      localStorage.setItem('sprints', JSON.stringify(sprints))
    } catch (error) {
      console.error('Error fetching sprints:', error)
    }
  }

  useEffect(() => {
    void fetchTasks()
    void fetchTeamMembers()
    void fetchSprints()
  }, [])

  const addTask = async (): Promise<void> => {
    const teamId = localStorage.getItem('team_id')
    if (newTask.title.trim() !== '' && newTask.description.trim() !== '') {
      const newTaskData = {
        title: newTask.title,
        description: newTask.description,
        status: 'Backlog',
        assignedTo: newTask.assignedTo,
        complexity: newTask.complexity,
        sprint: selectedSprint,
        proyecto: teamId !== null && teamId !== '' ? parseInt(teamId) : 0
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
          setNewTask({ title: '', description: '', complexity: '', assignedTo: '', sprint: '' })
          setIsNewTaskDialogOpen(false)
          window.location.reload()
        }
      } catch (error) {
        console.error('Error adding task:', error)
      }
    }
  }

  const moveTask = async (taskId: string, newStatus: string): Promise<void> => {
    try {
      const payload = { id: taskId, status: newStatus }
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            if ('id_serial' in task && task.id_serial === taskId) {
              return { ...task, status: newStatus }
            }
            return task
          })
        )
      } else {
        console.error('Failed to update task status')
      }
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const TaskCard: React.FC<{ task: any }> = ({ task }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'task',
      item: { id: task?.id_serial },
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() })
    }))

    return (
      <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }} className='cursor-pointer'>
        <Card className='mb-2'>
          <CardHeader>
            <CardTitle>{task.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{task.description}</p>
            <Separator className='my-2' />
            <p><strong>Asignado a:</strong> {task.assignedTo}</p>
            <div className='flex justify-between mt-2'>
              <Badge variant='outline' style={getComplexityBadgeStyle(task.complexity)}>
                {task.complexity}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const Column: React.FC<{ status: string, children: React.ReactNode }> = ({ status, children }) => {
    const [, drop] = useDrop({
      accept: 'task',
      drop: async (item) => {
        if (item && typeof item === 'object' && 'id' in item) {
          await moveTask(item.id as string, status)
        } else {
          console.error('Task ID is missing or invalid!')
        }
      }
    })

    return (
      <div ref={drop} className='p-4 border rounded'>
        <h2 className='text-lg font-bold'>{status}</h2>
        <div className='mt-2'>{children}</div>
      </div>
    )
  }

  const filterTasksByStatus = (status: string): any[] => tasks.filter((task) => task.status === status)
  const calculateProgress = (): number => (tasks.length === 0 ? 0 : (filterTasksByStatus('Terminado').length / tasks.length) * 100)

  const getComplexityBadgeStyle = (complexity: string): React.CSSProperties => {
    switch (complexity) {
      case 'Basica': return { backgroundColor: '#d4edda', color: '#155724' }
      case 'Moderada': return { backgroundColor: '#d4edda', color: '#155724' }
      case 'Intermedia': return { backgroundColor: '#fff3cd', color: '#856404' }
      case 'Avanzada': return { backgroundColor: '#fff3cd', color: '#856404' }
      case 'Epica': return { backgroundColor: '#f8d7da', color: '#721c24' }
      default: return {}
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout>
        <div className='p-6'>
          <div className='mb-4'>
            <h2 className='mb-2 text-lg font-bold'>Progreso del Proyecto</h2>
            <Progress value={calculateProgress()} />
            <p className='mt-2 text-sm font-semibold'>ID del Equipo: {localStorage.getItem('team_id')}</p>
            <h2 className='mb-2 text-lg font-bold'>Miembros del equipo:</h2>
            <ul>
              {teamMembers.map((member, index) => (
                <li key={index}>{member.nombre}</li>
              ))}
            </ul>
          </div>

          <Card className='relative'>
            <CardHeader>
              <CardTitle>Gestor de Tareas</CardTitle>
              <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button className='absolute top-2 right-2'>
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
                      <SelectTrigger className='w-full'>
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
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Asignar a' />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.nombre} value={member.nombre}>
                            {member.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={newTask.sprint}
                      onValueChange={(value) => {
                        setSelectedSprint(value)
                        localStorage.setItem('selected_sprint', value) // Save selected sprint to localStorage
                      }}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Seleccionar Sprint' />
                      </SelectTrigger>
                      <SelectContent>
                        {sprints.map((sprint) => (
                          <SelectItem key={sprint.sprint_id} value={sprint.sprint_id}>
                            {sprint.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={() => void addTask()} className='px-4 py-2'>
                      Añadir
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-5 gap-4'>
                {columns.map((status) => (
                  <Column key={status} status={status}>
                    {filterTasksByStatus(status).map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </Column>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </DndProvider>
  )
}

export default TaskManagerPlanner

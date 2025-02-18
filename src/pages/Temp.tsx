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
const complexityOptions = ['Baja', 'Media', 'Alta']

const TaskManagerPlanner = () => {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({ title: '', description: '', complexity: 'Baja', assignedTo: 'No asignado' })
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)

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
  }, [])

  const addTask = async () => {
    if (newTask.title && newTask.description) {
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
          setNewTask({ title: '', description: '', complexity: 'Baja', assignedTo: 'No asignado' })
          setIsNewTaskDialogOpen(false)
        }
      } catch (error) {
        console.error('Error adding task:', error)
      }
    }
  }

  const moveTask = async (taskId, newStatus) => {
    try {
      const payload = { id: taskId, status: newStatus }
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) // Send the payload
      })
      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)) // Update the task status locally
        )
      } else {
        console.error('Failed to update task status')
      }
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, { method: 'DELETE' })
      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const TaskCard = ({ task }) => {
    console.log('TaskCard received task:', task) // Debugging line

    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'task',
      item: { id: task?.id }, // Safely access task.id
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
              <Button variant='destructive' size='sm' onClick={async () => await deleteTask(task.id)}>
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const Column = ({ status, children }) => {
    const [, drop] = useDrop({
      accept: 'task',
      drop: async (item) => {
        console.log('Dropped item:', item) // Debugging
        if (item?.id) {
          await moveTask(item.id, status)
        } else {
          console.error('Task ID is missing!')
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

  const filterTasksByStatus = (status) => tasks.filter((task) => task.status === status)
  const calculateProgress = () => (tasks.length === 0 ? 0 : (filterTasksByStatus('Terminado').length / tasks.length) * 100)
  const getComplexityBadgeStyle = (complexity) => {
    switch (complexity) {
      case 'Baja': return { backgroundColor: '#d4edda', color: '#155724' }
      case 'Media': return { backgroundColor: '#fff3cd', color: '#856404' }
      case 'Alta': return { backgroundColor: '#f8d7da', color: '#721c24' }
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
                    <Input
                      type='text'
                      placeholder='Asignado a'
                      value={newTask.assignedTo}
                      onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    />
                    <Button onClick={addTask} className='px-4 py-2'>
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

import { useState } from 'react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { IconPlus } from '@tabler/icons-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// Ejemplos iniciales de tareas
const initialTasks = [
  {
    id: '1',
    title: 'Configurar el entorno de desarrollo',
    description: 'Instalar dependencias y configurar variables de entorno.',
    status: 'Backlog',
    subtasks: ['Instalar Node.js', 'Configurar .env'],
    comments: ['Revisar versiones de dependencias'],
    assignedTo: 'Juan Pérez',
    complexity: 'Baja'
  }
  // otras tareas...
]

// Definir los nombres de las columnas
const columns = ['Backlog', 'Listo para asignar', 'En desarrollo', 'En revisión', 'Terminado']

const complexityOptions = ['Baja', 'Media', 'Alta']

const TaskManagerPlanner = () => {
  const [tasks, setTasks] = useState(initialTasks)
  const [newTask, setNewTask] = useState({ title: '', description: '', complexity: 'Baja', assignedTo: 'No asignado' })
  const [selectedTask, setSelectedTask] = useState(null)
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)

  // Función para añadir nueva tarea
  const addTask = () => {
    if (newTask.title && newTask.description) {
      setTasks([
        ...tasks,
        {
          id: (tasks.length + 1).toString(),
          title: newTask.title,
          description: newTask.description,
          status: 'Backlog',
          subtasks: [],
          comments: [],
          assignedTo: newTask.assignedTo,
          complexity: newTask.complexity
        }
      ])
      setNewTask({ title: '', description: '', complexity: 'Baja', assignedTo: 'No asignado' })
      setIsNewTaskDialogOpen(false)
    }
  }

  // Drag and drop handling
  const moveTask = (taskId, newStatus) => {
    setTasks(tasks.map(task => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const TaskCard = ({ task }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'task',
      item: { id: task.id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging()
      })
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
            <div className='flex justify-end mt-2'>
              <Badge variant='outline' style={getComplexityBadgeStyle(task.complexity)}>
                {task.complexity}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const Column = ({ status, children }) => {
    const [, drop] = useDrop({
      accept: 'task',
      drop: (item) => moveTask(item.id, status)
    })

    return (
      <div ref={drop} className='p-4 border rounded'>
        <h2 className='text-lg font-bold'>{status}</h2>
        <div className='mt-2'>{children}</div>
      </div>
    )
  }

  // Filtrar tareas por estado
  const filterTasksByStatus = (status) => tasks.filter((task) => task.status === status)

  // Calcular el progreso total basado en las tareas completadas
  const calculateProgress = () => {
    const totalTasks = tasks.length
    const completedTasks = filterTasksByStatus('Terminado').length
    if (totalTasks === 0) return 0
    return (completedTasks / totalTasks) * 100
  }

  // Obtener color del badge
  const getComplexityBadgeStyle = (complexity) => {
    switch (complexity) {
      case 'Baja':
        return { backgroundColor: '#d4edda', color: '#155724' }
      case 'Media':
        return { backgroundColor: '#fff3cd', color: '#856404' }
      case 'Alta':
        return { backgroundColor: '#f8d7da', color: '#721c24' }
      default:
        return {}
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
                  <Button className='absolute top-2 right-2' onClick={() => setIsNewTaskDialogOpen(true)}>
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

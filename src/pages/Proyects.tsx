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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

// Ejemplos iniciales de tareas con campo de complejidad
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
  },
  {
    id: '2',
    title: 'Diseñar el dashboard',
    description: 'Definir componentes y estructura.',
    status: 'Backlog',
    subtasks: ['Crear mockups', 'Definir navegación'],
    comments: ['Validar con el equipo de diseño'],
    assignedTo: 'Ana García',
    complexity: 'Media'
  },
  {
    id: '3',
    title: 'Implementar autenticación',
    description: 'Configurar el sistema de autenticación.',
    status: 'Backlog',
    subtasks: ['Configurar JWT', 'Crear rutas protegidas'],
    comments: ['Revisar con el equipo de seguridad'],
    assignedTo: 'Laura López',
    complexity: 'Alta'
  },
  {
    id: '4',
    title: 'Revisar código',
    description: 'Hacer una revisión del código y pruebas.',
    status: 'Backlog',
    subtasks: ['Revisar pull requests', 'Realizar pruebas'],
    comments: ['Discutir mejoras'],
    assignedTo: 'Carlos Martínez',
    complexity: 'Baja'
  }
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
      setTasks([...tasks, { id: (tasks.length + 1).toString(), title: newTask.title, description: newTask.description, status: 'Backlog', subtasks: [], comments: [], assignedTo: newTask.assignedTo, complexity: newTask.complexity }])
      setNewTask({ title: '', description: '', complexity: 'Baja', assignedTo: 'No asignado' })
      setIsNewTaskDialogOpen(false)
    }
  }

  // Función para mover tarea entre columnas
  const moveTask = (taskId, direction) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const currentIndex = columns.indexOf(task.status)
        const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
        const newStatus = columns[newIndex] || task.status
        return { ...task, status: newStatus }
      }
      return task
    }))
  }

  // Filtrar tareas por estado
  const filterTasksByStatus = (status) => tasks.filter(task => task.status === status)

  // Calcular el progreso total basado solo en las tareas en la columna "Terminado"
  const calculateProgress = () => {
    const totalTasks = tasks.length
    const completedTasks = filterTasksByStatus('Terminado').length
    if (totalTasks === 0) return 0
    return (completedTasks / totalTasks) * 100
  }

  // Función para actualizar la complejidad de la tarea seleccionada
  const updateTaskComplexity = (taskId, complexity) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, complexity }
      }
      return task
    }))
  }

  // Función para obtener el color de fondo basado en la complejidad
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
    <Layout>
      <div className='p-6'>
        {/* Barra de progreso del proyecto */}
        <div className='mb-4'>
          <h2 className='mb-2 text-lg font-bold'>Progreso del Proyecto</h2>
          <Progress value={calculateProgress()} />
        </div>

        {/* Card del tablero de tareas */}
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
                  <Select value={newTask.complexity} onValueChange={(value) => setNewTask({ ...newTask, complexity: value })}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Seleccionar complejidad' />
                    </SelectTrigger>
                    <SelectContent>
                      {complexityOptions.map(option => (
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
              {columns.map(status => (
                <div key={status} className='p-4 border rounded'>
                  <h2 className='text-lg font-bold'>{status}</h2>
                  <div className='mt-2'>
                    {filterTasksByStatus(status).length === 0
                      ? (
                        <p className='text-gray-500'>No hay tareas en esta columna.</p>
                        )
                      : (
                          filterTasksByStatus(status).map(task => (
                            <Card key={task.id} className='mb-2 cursor-pointer'>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <div onClick={() => { setSelectedTask(task.id) }}>
                                    <CardHeader>
                                      <CardTitle>{task.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p>{task.description}</p>
                                      <Separator className='my-2' />
                                      <p><strong>Asignado a:</strong> {task.assignedTo}</p>
                                      {/* Badge en la parte inferior */}
                                      <div className='flex justify-end mt-2'>
                                        <Badge
                                          variant='outline'
                                          style={getComplexityBadgeStyle(task.complexity)}
                                        >
                                          {task.complexity}
                                        </Badge>
                                      </div>
                                    </CardContent>
                                  </div>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>{task.title}</DialogTitle>
                                    <DialogDescription>{task.description}</DialogDescription>
                                  </DialogHeader>
                                  <div className='flex flex-col space-y-4'>
                                    <p><strong>Asignado a:</strong> {task.assignedTo}</p>
                                    <div className='flex flex-col space-y-2'>
                                      <h4 className='font-semibold'>Subtareas:</h4>
                                      <ul>
                                        {task.subtasks.map((subtask, index) => (
                                          <li key={index}>{subtask}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className='flex flex-col space-y-2'>
                                      <h4 className='font-semibold'>Comentarios:</h4>
                                      <ul>
                                        {task.comments.map((comment, index) => (
                                          <li key={index}>{comment}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                  <div className='flex justify-between mt-4'>
                                    <Button onClick={() => moveTask(task.id, 'previous')}>Mover a Anterior</Button>
                                    <Button onClick={() => moveTask(task.id, 'next')}>Mover a Siguiente</Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </Card>
                          ))
                        )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default TaskManagerPlanner

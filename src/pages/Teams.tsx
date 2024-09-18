import { useState } from 'react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { IconPlus, IconEdit, IconTrash, IconUserPlus } from '@tabler/icons-react'
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

// Función principal
function GestionEquiposScrum () {
  const [equipos, setEquipos] = useState([
    { id: 1, nombre: 'Equipo Alpha', rol: 'Desarrollador', progreso: 50, activo: true, miembros: ['Alicia', 'Carlos'], historial: [], tareas: ['Tarea 1', 'Tarea 2'] },
    { id: 2, nombre: 'Equipo Beta', rol: 'Scrum Master', progreso: 75, activo: false, miembros: ['Miguel', 'Sofia'], historial: [], tareas: ['Tarea 3'] }
  ])
  const [nuevoEquipo, setNuevoEquipo] = useState('')
  const [rol, setRol] = useState('Desarrollador')
  const [miembro, setMiembro] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editTeamId, setEditTeamId] = useState(null)
  const [filtroEstado, setFiltroEstado] = useState('todos')

  // Agregar un nuevo equipo
  const handleAddEquipo = () => {
    const nuevoEquipoData = { id: Date.now(), nombre: nuevoEquipo, rol, progreso: 0, activo: true, miembros: [], historial: [], tareas: [] }
    setEquipos([...equipos, nuevoEquipoData])
    setNuevoEquipo('')
    setRol('Desarrollador')
  }

  // Editar un equipo existente
  const handleEditEquipo = (id) => {
    const equipoAEditar = equipos.find(equipo => equipo.id === id)
    setNuevoEquipo(equipoAEditar.nombre)
    setRol(equipoAEditar.rol)
    setIsEditing(true)
    setEditTeamId(id)
  }

  const guardarCambiosEquipo = () => {
    const equiposActualizados = equipos.map(equipo =>
      equipo.id === editTeamId ? { ...equipo, nombre: nuevoEquipo, rol } : equipo
    )
    setEquipos(equiposActualizados)
    resetForm()
  }

  const resetForm = () => {
    setNuevoEquipo('')
    setRol('Desarrollador')
    setIsEditing(false)
    setEditTeamId(null)
  }

  // Eliminar equipo
  const eliminarEquipo = (id) => {
    const equiposActualizados = equipos.filter(equipo => equipo.id !== id)
    setEquipos(equiposActualizados)
  }

  // Cambiar estado activo/inactivo
  const toggleEstadoEquipo = (id) => {
    const equiposActualizados = equipos.map(equipo =>
      equipo.id === id ? { ...equipo, activo: !equipo.activo } : equipo
    )
    setEquipos(equiposActualizados)
  }

  // Avanzar progreso y agregar al historial
  const actualizarProgresoEquipo = (id) => {
    const equiposActualizados = equipos.map(equipo => {
      if (equipo.id === id) {
        const nuevoProgreso = Math.min(equipo.progreso + 25, 100)
        const nuevoHistorial = [...equipo.historial, `Progreso actualizado a ${nuevoProgreso}%`]
        return { ...equipo, progreso: nuevoProgreso, historial: nuevoHistorial }
      }
      return equipo
    })
    setEquipos(equiposActualizados)
  }

  // Asignar un nuevo miembro al equipo
  const asignarMiembro = (id) => {
    const equiposActualizados = equipos.map(equipo =>
      equipo.id === id ? { ...equipo, miembros: [...equipo.miembros, miembro] } : equipo
    )
    setEquipos(equiposActualizados)
    setMiembro('')
  }

  const equiposFiltrados = equipos.filter(equipo => {
    if (filtroEstado === 'todos') return true
    if (filtroEstado === 'activos') return equipo.activo
    if (filtroEstado === 'inactivos') return !equipo.activo
  })

  return (
    <Layout>
      <h1>Gestión de Equipos Scrum</h1>

      {/* Filtrar equipos */}
      <Select
        value={filtroEstado}
        onValueChange={setFiltroEstado}
        className='mb-4'
      >
        <SelectTrigger>
          <SelectValue placeholder='Filtrar por estado' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='todos'>Todos los equipos</SelectItem>
          <SelectItem value='activos'>Equipos activos</SelectItem>
          <SelectItem value='inactivos'>Equipos inactivos</SelectItem>
        </SelectContent>
      </Select>

      {/* Crear/editar equipo */}
      <Card className='p-6 mb-4'>
        <CardHeader>
          <CardTitle>{isEditing ? 'Editar Equipo' : 'Crear Nuevo Equipo'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder='Nombre del equipo'
            value={nuevoEquipo}
            onChange={(e) => setNuevoEquipo(e.target.value)}
            className='mb-2'
          />
          <Select value={rol} onValueChange={setRol}>
            <SelectTrigger>
              <SelectValue placeholder='Seleccionar rol' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Desarrollador'>Desarrollador</SelectItem>
              <SelectItem value='Scrum Master'>Scrum Master</SelectItem>
              <SelectItem value='Product Owner'>Product Owner</SelectItem>
            </SelectContent>
          </Select>

          <Button className='mt-4' onClick={isEditing ? guardarCambiosEquipo : handleAddEquipo} disabled={!nuevoEquipo}>
            {isEditing ? <IconEdit className='mr-2' /> : <IconPlus className='mr-2' />}
            {isEditing ? 'Guardar Cambios' : 'Agregar Equipo'}
          </Button>

          {isEditing && <Button className='mt-4 ml-2' variant='ghost' onClick={resetForm}>Cancelar</Button>}
        </CardContent>
      </Card>

      <Separator className='my-6' />

      {/* Mostrar equipos */}
      {equiposFiltrados.length > 0 ? (
        equiposFiltrados.map((equipo) => (
          <Card key={equipo.id} className='p-6 mb-6'>
            <CardHeader>
              <CardTitle>
                {equipo.nombre}
                <Badge className='ml-2'>{equipo.activo ? 'Activo' : 'Inactivo'}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Rol: {equipo.rol}</p>
              <Progress value={equipo.progreso} className='mb-2' />
              <Button onClick={() => actualizarProgresoEquipo(equipo.id)}>Avanzar Progreso</Button>

              <div className='mt-2'>
                <Button variant='outline' onClick={() => handleEditEquipo(equipo.id)} className='mr-2'>
                  <IconEdit className='mr-2' /> Editar
                </Button>
                <Button variant='destructive' onClick={() => eliminarEquipo(equipo.id)}>
                  <IconTrash className='mr-2' /> Eliminar
                </Button>
                <Button variant='ghost' onClick={() => toggleEstadoEquipo(equipo.id)}>
                  {equipo.activo ? 'Desactivar' : 'Activar'}
                </Button>
              </div>

              {/* Asignar miembro */}
              <Input
                placeholder='Nuevo miembro'
                value={miembro}
                onChange={(e) => setMiembro(e.target.value)}
                className='mt-4'
              />
              <Button className='mt-2' onClick={() => asignarMiembro(equipo.id)} disabled={!miembro}>
                <IconUserPlus className='mr-2' /> Asignar Miembro
              </Button>

              {/* Diálogo de detalles del equipo */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='outline' className='mt-4'>Ver Detalles</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Equipo: {equipo.nombre}</DialogTitle>
                    <DialogDescription>Rol: {equipo.rol}</DialogDescription>
                  </DialogHeader>
                  <p><strong>Miembros:</strong> {equipo.miembros.join(', ')}</p>
                  <p><strong>Tareas:</strong> {equipo.tareas.join(', ')}</p>
                  <p><strong>Historial de Cambios:</strong></p>
                  <ul>
                    {equipo.historial.length > 0
                      ? equipo.historial.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))
                      : <li>No hay historial</li>}
                  </ul>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No se encontraron equipos.</p>
      )}
    </Layout>
  )
}

export default GestionEquiposScrum

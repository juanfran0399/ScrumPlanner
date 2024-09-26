import React, { useState } from 'react'
import Layout from '@/components/Layout'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Button } from '@/components/ui/button'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'

// Datos generales de los sprints
const sprintData = {
  'Sprint 1': {
    tasks: [
      { id: 1, task: 'Desarrollo de funcionalidad X', completed: true },
      { id: 2, task: 'Corrección de errores Y', completed: false }
    ],
    analysis: 'El equipo tuvo problemas con la integración de la API externa, lo cual retrasó algunas tareas.',
    points: { completed: 50, total: 80 },
    team: [
      { member: 'Alice', tasks: 5, effort: 'Alto' },
      { member: 'Bob', tasks: 3, effort: 'Medio' }
    ]
  },
  'Sprint 2': {
    tasks: [
      { id: 1, task: 'Implementación de la autenticación', completed: true },
      { id: 2, task: 'Diseño de interfaz de usuario', completed: true }
    ],
    analysis: 'Mejor organización en el equipo, logrando completar más tareas a tiempo.',
    points: { completed: 60, total: 100 },
    team: [
      { member: 'Alice', tasks: 7, effort: 'Alto' },
      { member: 'Charlie', tasks: 4, effort: 'Medio' }
    ]
  }
  // Agregar más datos para otros sprints si es necesario
}

// Datos para la gráfica
const chartData = [
  { sprint: 'Sprint 1', completedPoints: 50, totalPoints: 80 },
  { sprint: 'Sprint 2', completedPoints: 60, totalPoints: 100 },
  { sprint: 'Sprint 3', completedPoints: 75, totalPoints: 90 },
  { sprint: 'Sprint 4', completedPoints: 90, totalPoints: 100 }
]

const chartConfig = {
  completedPoints: {
    label: 'Puntos Completados',
    color: '#2563eb'
  },
  totalPoints: {
    label: 'Puntos Totales',
    color: '#60a5fa'
  }
}

// Componente principal de Retrospectiva
const Retrospective: React.FC = () => {
  const [selectedSprint, setSelectedSprint] = useState<string | null>(null)

  // Función para manejar la selección del sprint
  const handleSprintChange = (value: string) => {
    setSelectedSprint(value)
  }

  return (
    <Layout>
      <ResizablePanelGroup
        direction='horizontal'
        className='min-h-[400px] max-w-[1200px] rounded-lg border md:min-w-[600px]'
      >
        {/* Panel izquierdo para la información del sprint */}
        <ResizablePanel>
          <div className='p-6'>
            <h1 className='text-xl font-bold'>Retrospectiva de Proyecto - Scrum</h1>

            {/* Selección del Sprint */}
            <div className='mb-4'>
              <Select onValueChange={handleSprintChange}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Selecciona un Sprint' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sprints</SelectLabel>
                    <SelectItem value='Sprint 1'>Sprint 1</SelectItem>
                    <SelectItem value='Sprint 2'>Sprint 2</SelectItem>
                    <SelectItem value='Sprint 3'>Sprint 3</SelectItem>
                    <SelectItem value='Sprint 4'>Sprint 4</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Mostrar detalles del sprint seleccionado */}
            {selectedSprint && (
              <>
                <h2 className='text-lg font-semibold'>{`Detalles de ${selectedSprint}`}</h2>

                {/* Mostrar tareas */}
                <div className='mb-4'>
                  <h3 className='font-semibold'>Tareas</h3>
                  <ul>
                    {sprintData[selectedSprint]?.tasks.map((task: any) => (
                      <li key={task.id}>
                        {task.task} - {task.completed ? 'Completada' : 'Pendiente'}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mostrar análisis del sprint */}
                <div className='mb-4'>
                  <h3 className='font-semibold'>Análisis del Sprint</h3>
                  <p>{sprintData[selectedSprint]?.analysis}</p>
                </div>

                {/* Mostrar puntos completados */}
                <div className='mb-4'>
                  <h3 className='font-semibold'>Puntos</h3>
                  <p>Puntos completados: {sprintData[selectedSprint]?.points.completed}</p>
                  <p>Puntos totales: {sprintData[selectedSprint]?.points.total}</p>
                </div>

                {/* Mostrar trabajo de los integrantes */}
                <div className='mb-4'>
                  <h3 className='font-semibold'>Trabajo del Equipo</h3>
                  <ul>
                    {sprintData[selectedSprint]?.team.map((member: any, index: number) => (
                      <li key={index}>
                        {member.member}: {member.tasks} tareas, Esfuerzo: {member.effort}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Inputs adicionales para más información */}
                <div className='mb-4'>
                  <h3 className='font-semibold'>Agregar Comentarios</h3>
                  <Input placeholder='Comentarios del sprint...' />
                  <Button className='mt-2'>Agregar</Button>
                </div>
              </>
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Panel derecho para la gráfica */}
        <ResizablePanel>
          <div className='p-6'>
            <h2 className='text-xl font-bold'>Análisis Global de los Sprints</h2>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='sprint' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='completedPoints' fill='#2563eb' />
                <Bar dataKey='totalPoints' fill='#60a5fa' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Layout>
  )
}

// Exportar componente
export default Retrospective

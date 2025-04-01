'use client'

import React, { useEffect, useState } from 'react'
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Layout from '@/components/Layout'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger
} from '@/components/ui/dialog'
import {
  obtenerUsuarios,
  obtenerTareasPorUsuario
} from '@/services/api'
import {
  calcularIndices,
  obtenerTipoRecomendado
} from '@/services/predictor'
import {
  Command, CommandInput, CommandItem, CommandList
} from '@/components/ui/command'
import {
  Popover, PopoverContent, PopoverTrigger
} from '@/components/ui/popover'
import { ChevronsUpDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts'



interface Usuario {
  id_usuario: number
  nombre: string
}

interface TareaSprint {
  id: number
  usuario_id: number
  sprint: number
  [key: string]: any
}

const tiposNombre = ['Básicas', 'Moderadas', 'Intermedias', 'Avanzadas', 'Épicas']

const SprintAudit: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null)
  const [tareas, setTareas] = useState<TareaSprint[]>([])
  const [sprintSeleccionado, setSprintSeleccionado] = useState<number | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)

  useEffect(() => {
    obtenerUsuarios().then(res => setUsuarios(res.data))
  }, [])

  useEffect(() => {
    if (usuarioSeleccionado != null) {
      obtenerTareasPorUsuario(usuarioSeleccionado.id_usuario).then(res => setTareas(res.data))
    }
  }, [usuarioSeleccionado])

  const tareasDelSprint = tareas.find(t => t.sprint === sprintSeleccionado)
  const indicesGlobales = calcularIndices(tareas)
  const indicesSprint = (tareasDelSprint != null) ? calcularIndices([tareasDelSprint]) : []

  const chartGlobal = indicesGlobales.map((val, i) => {
    const completadas = tareas.reduce((sum, t) => sum + t[`t${i + 1}_completadas`] || 0, 0)
    const asignadas = tareas.reduce((sum, t) => sum + t[`t${i + 1}_asignadas`] || 0, 0)
    const base = asignadas > 0 ? (completadas * 100) / asignadas : 0
    return {
      tipo: tiposNombre[i],
      porcentaje: parseFloat(base.toFixed(2)),
      ponderado: val,
      completadas,
      asignadas
    }
  })

  const chartSprint = indicesSprint.map((val, i) => {
    const completadas = tareasDelSprint?.[`t${i + 1}_completadas`] || 0
    const asignadas = tareasDelSprint?.[`t${i + 1}_asignadas`] || 0
    const base = asignadas > 0 ? (completadas * 100) / asignadas : 0
    return {
      tipo: tiposNombre[i],
      porcentaje: parseFloat(base.toFixed(2)),
      ponderado: val,
      completadas,
      asignadas
    }
  })

  const graficoEvolucion = tareas.map((t) => {
    const totalCompletadas = [1, 2, 3, 4, 5].reduce((sum, tipo) => sum + t[`t${tipo}_completadas`], 0)
    const totalAsignadas = [1, 2, 3, 4, 5].reduce((sum, tipo) => sum + t[`t${tipo}_asignadas`], 0)
    const porcentaje = totalAsignadas > 0 ? (totalCompletadas * 100) / totalAsignadas : 0

    return {
      sprint: `Sprint ${t.sprint}`,
      rendimiento: parseFloat(porcentaje.toFixed(2))
    }
  })

  const tipoRecomendadoGlobal = obtenerTipoRecomendado(indicesGlobales)
  const tipoRecomendadoSprint = obtenerTipoRecomendado(indicesSprint)

  return (
    <Layout>
      <div className='flex flex-col justify-between gap-4 mb-6 md:flex-row md:items-center'>
        <h2 className='text-2xl font-bold text-primary'>📋 Auditoría de Sprints</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button variant='outline'>🧠 Cómo se calcula</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>🧠 Cómo se calculan los porcentajes</DialogTitle>
              <DialogDescription>
                <p className='mb-2'>El sistema aplica un porcentaje extra según la dificultad:</p>
                <ul className='space-y-1 text-sm list-disc list-inside text-muted-foreground'>
                  <li><b>Básicas</b>: +10%</li>
                  <li><b>Moderadas</b>: +15%</li>
                  <li><b>Intermedias</b>: +20%</li>
                  <li><b>Avanzadas</b>: +25%</li>
                  <li><b>Épicas</b>: +30%</li>
                </ul>
                <p className='mt-3 text-sm italic'>Ejemplo: 6 de 6 Avanzadas = 100% + 25% = <b>125%</b></p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className='grid grid-cols-1 gap-4 mb-6 md:grid-cols-2'>
        {/* Usuario Selector */}
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant='outline' role='combobox' className='justify-between w-full'>
              {(usuarioSeleccionado != null) ? usuarioSeleccionado.nombre : 'Selecciona un usuario'}
              <ChevronsUpDown className='w-4 h-4 ml-2 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-full p-0'>
            <Command>
              <CommandInput placeholder='Buscar usuario...' />
              <CommandList>
                {usuarios.map((user) => (
                  <CommandItem
                    key={user.id_usuario}
                    value={user.nombre}
                    onSelect={() => {
                      setUsuarioSeleccionado(user)
                      setPopoverOpen(false)
                      setSprintSeleccionado(null)
                    }}
                  >
                    <Check className={cn('mr-2 h-4 w-4', usuarioSeleccionado?.id_usuario === user.id_usuario ? 'opacity-100' : 'opacity-0')} />
                    {user.nombre}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Sprint Selector */}
        {(usuarioSeleccionado != null) && tareas.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='outline' role='combobox' className='justify-between w-full'>
                {sprintSeleccionado !== null ? `Sprint ${sprintSeleccionado}` : 'Selecciona un sprint'}
                <ChevronsUpDown className='w-4 h-4 ml-2 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
              <Command>
                <CommandInput placeholder='Buscar sprint...' />
                <CommandList>
                  {tareas.map((t) => (
                    <CommandItem
                      key={t.sprint}
                      value={`Sprint ${t.sprint}`}
                      onSelect={() => setSprintSeleccionado(t.sprint)}
                    >
                      <Check className={cn('mr-2 h-4 w-4', sprintSeleccionado === t.sprint ? 'opacity-100' : 'opacity-0')} />
                      Sprint {t.sprint}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <Separator className='mb-6' />

      {(usuarioSeleccionado != null) && (
        <div className='grid gap-4 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-semibold text-primary'>📊 Global del Usuario</CardTitle>
              <p className='text-muted-foreground'>Recomendado: {tipoRecomendadoGlobal}</p>
            </CardHeader>
            <CardContent>
              <ul className='space-y-1 text-sm text-muted-foreground'>
                {chartGlobal.map((d, i) => (
                  <li key={i} className='flex justify-between'>
                    <span>{d.tipo}</span>
                    <span className='font-medium'>
                      {d.porcentaje}% (🎯 {d.ponderado}%)
                      <span className='ml-2 text-xs text-gray-500'>| {d.completadas}/{d.asignadas}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {(tareasDelSprint != null) && (
            <Card>
              <CardHeader>
                <CardTitle className='text-lg font-semibold text-green-700'>📌 Sprint {tareasDelSprint.sprint}</CardTitle>
                <p className='text-muted-foreground'>Recomendado: {tipoRecomendadoSprint}</p>
              </CardHeader>
              <CardContent>
                <ul className='mb-4 space-y-1 text-sm text-muted-foreground'>
                  {chartSprint.map((d, i) => (
                    <li key={i} className='flex justify-between'>
                      <span>{d.tipo}</span>
                      <span className='font-medium'>
                        {d.porcentaje}% (🎯 {d.ponderado}%)
                        <span className='ml-2 text-xs text-gray-500'>| {d.completadas}/{d.asignadas}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                <ResponsiveContainer width='100%' height={250}>
                  <BarChart data={chartSprint}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='tipo' />
                    <YAxis domain={[0, 150]} />
                    <Tooltip />
                    <Bar dataKey='porcentaje' fill='#2ecc71' />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {(usuarioSeleccionado != null) && tareas.length > 1 && (
        <Card className='mt-8'>
          <CardHeader>
            <CardTitle className='text-lg font-semibold'>📈 Evolución del rendimiento por Sprint</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={250}>
              <LineChart data={graficoEvolucion}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='sprint' />
                <YAxis domain={[0, 150]} />
                <Tooltip />
                <Line type='monotone' dataKey='rendimiento' stroke='#8884d8' strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </Layout>
  )
}

export default SprintAudit

'use client'

import React, { useEffect, useState } from 'react'
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
  Command, CommandInput, CommandItem, CommandList
} from '@/components/ui/command'
import {
  Popover, PopoverContent, PopoverTrigger
} from '@/components/ui/popover'
import { ChevronsUpDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

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

const SprintAudit: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null)
  const [tareas, setTareas] = useState<TareaSprint[]>([])
  const [sprintSeleccionado, setSprintSeleccionado] = useState<number | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)

  useEffect(() => {
    obtenerUsuarios().then(res => setUsuarios(res.data))

    // Check localStorage for user_id and set usuarioSeleccionado
    const storedUserId = localStorage.getItem('user_id')
    if (storedUserId) {
      const user = usuarios.find(u => u.id_usuario === parseInt(storedUserId))
      if (user != null) {
        setUsuarioSeleccionado(user)
      }
    }
  }, [usuarios])

  useEffect(() => {
    if (usuarioSeleccionado != null) {
      obtenerTareasPorUsuario(usuarioSeleccionado.id_usuario).then(res => setTareas(res.data))
    }
  }, [usuarioSeleccionado])

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
          {/* Rest of the code remains the same */}
        </div>
      )}

    </Layout>
  )
}

export default SprintAudit

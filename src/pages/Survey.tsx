import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Layout from '@/components/Layout'
import { Button } from '@/components/ui/button'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

// Componente DataTable
interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>
  data: TData[]
}

export function DataTable<TData, TValue> ({
  columns,
  data
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div className='border rounded-md'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length
            ? table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
            : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
              )}
        </TableBody>
      </Table>
    </div>
  )
}

// Preguntas y opciones
const preguntas = [
  {
    id: 1,
    texto: '¿Te consideras efectivo/a en comunicarte con diferentes grupos de interés (stakeholders, equipo de desarrollo, etc.)?',
    opciones: ['Muy efectivo/a', 'Bastante efectivo/a', 'Algo efectivo/a', 'No muy efectivo/a']
  },
  {
    id: 2,
    texto: '¿Tienes experiencia en desarrollo de software y conocimientos técnicos relevantes para el proyecto?',
    opciones: ['Mucho', 'Bastante', 'Algo', 'Poco']
  },
  {
    id: 3,
    texto: '¿Te sientes cómodo/a resolviendo impedimentos que puedan surgir durante el desarrollo del proyecto?',
    opciones: ['Muy cómodo/a', 'Bastante cómodo/a', 'Algo cómodo/a', 'No muy cómodo/a']
  },
  {
    id: 4,
    texto: '¿Te consideras bueno/a facilitando discusiones y ayudando a otros a alcanzar consensos?',
    opciones: ['Muy bueno/a', 'Bastante bueno/a', 'Algo bueno/a', 'No muy bueno/a']
  },
  {
    id: 5,
    texto: '¿Eres flexible y capaz de asumir múltiples roles o tareas según sea necesario?',
    opciones: ['Muy flexible', 'Bastante flexible', 'Algo flexible', 'Poco flexible']
  },
  {
    id: 6,
    texto: '¿Eres bueno/a analizando datos y utilizando esa información para tomar decisiones informadas?',
    opciones: ['Muy bueno/a', 'Bastante bueno/a', 'Algo bueno/a', 'Poco bueno/a']
  },
  {
    id: 7,
    texto: '¿Tienes experiencia trabajando en entornos ágiles fuera del marco Scrum?',
    opciones: ['Sí', 'No', 'A veces']
  },
  {
    id: 8,
    texto: '¿Qué tan seguido asumen posiciones de liderato?',
    opciones: ['Siempre', 'Frecuentemente', 'A veces', 'Raramente']
  },
  {
    id: 9,
    texto: '¿Logras terminar a tiempo tus actividades y tareas?',
    opciones: ['Siempre', 'Frecuentemente', 'A veces', 'Raramente']
  },
  {
    id: 10,
    texto: '¿Cómo consideras tus habilidades para hacer documentación?',
    opciones: ['Muy buenas', 'Buenas', 'Adecuadas', 'Pobres']
  },
  {
    id: 11,
    texto: '¿Cuando hay un problema cuál es tu aproximación para resolverlo?',
    opciones: ['Proactiva', 'Reactiva', 'Busca ayuda', 'Ignora el problema']
  },
  {
    id: 12,
    texto: '¿Consideras importante la documentación en un proyecto?',
    opciones: ['Sí', 'No', 'A veces']
  },
  {
    id: 13,
    texto: '¿Qué consideras más importante en un proyecto?',
    opciones: ['Comunicación', 'Documentación', 'Cumplimiento de plazos', 'Calidad del producto']
  }
]

const EncuestaPage = () => {
  const [selectedScores, setSelectedScores] = useState<{ [key: number]: number | null }>({})
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalScore, setTotalScore] = useState<number | null>(null)
  const [alreadySubmitted, setAlreadySubmitted] = useState<boolean>(false)

  const userId = localStorage.getItem('id_usuario')

  useEffect(() => {
    const checkSurveyStatus = async () => {
      const userIdAsInt = parseInt(userId || '0', 10)

      try {
        const response = await axios.post('http://localhost:5000/api/survey/chek', {
          id_usuario: userIdAsInt
        })

        if (response.data.success) {
          setAlreadySubmitted(true)
        }
      } catch (error) {
        console.error('Error checking survey status:', error)
        setError('Error checking survey status. Please try again.')
      }
    }

    if (userId) {
      checkSurveyStatus()
    }
  }, [userId])

  const handleOptionChange = (id: number, score: number) => {
    setSelectedScores((prev) => ({
      ...prev,
      [id]: score
    }))
    setError(null)
  }

  const handleSubmit = async () => {
    const unanswered = preguntas.some(pregunta => !selectedScores[pregunta.id])

    if (unanswered) {
      setError('Por favor, responde todas las preguntas antes de enviar.')
      return
    }

    const score = Object.values(selectedScores).reduce((acc, curr) => acc + (curr || 0), 0)
    setTotalScore(score)
    setSubmitted(true)
    setError(null)

    const userIdAsInt = parseInt(userId || '0', 10)

    try {
      if (!alreadySubmitted) {
        const response = await axios.post('http://localhost:5000/api/survey/survey', {
          id_usuario: userIdAsInt,
          puntaje: score
        })

        if (!response.data.success) {
          setError(response.data.message || 'Failed to submit survey data')
        } else {
          console.log('Survey data submitted successfully.')
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      } else {
        console.log('Survey data already submitted.')
      }
    } catch (error) {
      console.error('Error submitting survey:', error)
      setError('Error al enviar la encuesta. Por favor, intenta nuevamente.')
    }
  }

  // Columnas para DataTable
  const columns: Array<ColumnDef<any>> = [
    {
      header: 'Pregunta',
      accessorKey: 'texto'
    },
    {
      header: 'Opciones',
      cell: ({ row }) => (
        <div>
          {row.original.opciones.map((opcion: string, index: number) => (
            <label key={index} className='block'>
              <input
                type='radio'
                name={`opcion_${row.original.id}`}
                value={opcion}
                checked={selectedScores[row.original.id] === 4 - index}
                className='mr-2'
                onChange={() => handleOptionChange(row.original.id, 4 - index)}
              />
              {opcion}
            </label>
          ))}
        </div>
      )
    }
  ]

  return (
    <Layout>
      <div className='container mx-auto mt-8'>
        <Card>
          <CardHeader>
            <CardTitle>Encuesta de Satisfacción</CardTitle>
          </CardHeader>
          <CardContent>
            {alreadySubmitted
              ? (
                <p>Ya has completado esta encuesta. Gracias por tu participación.</p>
                )
              : (
                <>
                  <p>Responde las siguientes preguntas seleccionando la opción que mejor te describa:</p>

                  <Separator className='my-4' />
                  <DataTable columns={columns} data={preguntas} />

                  {error && <p className='mt-4 text-red-500'>{error}</p>}

                  <Button onClick={handleSubmit} className='mt-4 bg-[#9A3324] text-white'>
                    Enviar
                  </Button>

                  {submitted && !error && (
                    <div className='mt-6'>
                      <h2 className='text-lg font-bold'>Tu puntuación total:</h2>
                      <p className='text-xl'>{totalScore}</p>
                    </div>
                  )}
                </>
                )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default EncuestaPage

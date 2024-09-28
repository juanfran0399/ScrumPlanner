'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Layout from '@/components/Layout'
import Chart from 'chart.js/auto'
import { Check, ChevronsUpDown } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

const names = ['Jose', 'Roberto', 'Rodrigo', 'Manuel']
const inputs = [
  '0.8757, 0.6846, 0.764',
  '0.8757, 0.9846, 0.764',
  '0.8757, 0.6846, 0.964',
  '0.8757, 0.6846, 0.764'
]

const difficultyLabels = ['Fácil', 'Medio', 'Difícil']

const Prediction: React.FC = () => {
  const [results, setResults] = useState<string[]>(['', '', '', ''])
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [chartData, setChartData] = useState<number[]>(Array(names.length).fill(0))
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart | null>(null)

  // Simulación de predicción
  const simulatePrediction = (input: number[]) => {
    return Math.floor(Math.random() * 3) // Valores entre 0 y 2
  }

  const fetchPrediction = async (val: number) => {
    const input = inputs[val].split(',').map(Number)
    const predictedClass = simulatePrediction(input)
    const resultText = difficultyLabels[predictedClass]

    setResults((prevResults) => {
      const newResults = [...prevResults]
      newResults[val] = resultText
      return newResults
    })

    // Actualiza los datos del gráfico
    setChartData((prevData) => {
      const newData = [...prevData]
      newData[val] = predictedClass // Guardamos el índice de la predicción
      return newData
    })
  }

  const handlePredictAll = () => {
    for (let i = 0; i < names.length; i++) {
      fetchPrediction(i)
    }
  }

  const createChart = () => {
    if (chartRef.current != null) {
      const ctx = chartRef.current.getContext('2d')
      if (ctx != null) {
        if (chartInstanceRef.current != null) {
          chartInstanceRef.current.destroy()
        }

        chartInstanceRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: names,
            datasets: [{
              label: 'Dificultad Predicha',
              data: chartData,
              backgroundColor: [
                'rgba(75, 192, 192, 0.2)', // Fácil
                'rgba(255, 206, 86, 0.2)', // Medio
                'rgba(255, 99, 132, 0.2)' // Difícil
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => difficultyLabels[value] || value
                }
              }
            }
          }
        })
      }
    }
  }

  useEffect(() => {
    createChart() // Actualiza el gráfico cuando se generan nuevas predicciones
  }, [chartData])

  return (
    <Layout>
      <div className='container mx-auto mt-8'>
        <Card>
          <CardHeader>
            <CardTitle>Clasificación Simulada</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Selecciona un nombre para ver la predicción de dificultad:</p>

            {/* ComboBox para seleccionar nombres */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline' className='w-[200px] justify-between'>
                  {selectedName || 'Selecciona un nombre...'}
                  <ChevronsUpDown className='w-4 h-4 ml-2 opacity-50 shrink-0' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[200px] p-0'>
                <Command>
                  <CommandInput placeholder='Buscar nombre...' />
                  <CommandList>
                    <CommandEmpty>No se encontró el nombre.</CommandEmpty>
                    <CommandGroup>
                      {names.map((name, index) => (
                        <CommandItem
                          key={index}
                          onSelect={() => {
                            fetchPrediction(index)
                            setSelectedName(name)
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${selectedName === name ? 'opacity-100' : 'opacity-0'}`}
                          />
                          {name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Mostrar resultados */}
            {results.some((result) => result) && (
              <>
                <Separator className='my-4' />
                <div className='flex flex-wrap gap-4'>
                  {names.map((name, index) => (
                    <div key={index} className='m-2'>
                      <h4>{name}: <span className='font-bold'>{results[index]}</span></h4>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Mostrar gráfico */}
            <Separator className='my-4' />
            <h4>Gráfico de Dificultad Predicha</h4>
            <div className='chart-container'>
              <canvas ref={chartRef} width='400' height='200' />
            </div>

            {/* Botón para predecir todos */}
            <Button className='mt-6 bg-[#9A3324] text-white' onClick={handlePredictAll}>
              Predecir Todos
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default Prediction

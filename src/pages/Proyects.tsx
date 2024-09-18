import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Layout from '@/components/Layout'

const Prediction: React.FC = () => {
  const [results, setResults] = useState<string[]>(['', '', '', ''])
  const names = ['Jose', 'Roberto', 'Rodrigo', 'Manuel']
  const inputs = [
    '0.8757, 0.6846, 0.764',
    '0.8757, 0.9846, 0.764',
    '0.8757, 0.6846, 0.964',
    '0.8757, 0.6846, 0.764'
  ]

  // Simulación de predicción
  const simulatePrediction = (input: number[]) => {
    const randomPrediction = Math.floor(Math.random() * 3)
    return randomPrediction
  }

  const fetchPrediction = async (val: number) => {
    const input = inputs[val].split(',').map(Number)
    const predictedClass = simulatePrediction(input)
    let resultText = ''

    switch (predictedClass) {
      case 0:
        resultText = 'facil'
        break
      case 1:
        resultText = 'medio'
        break
      case 2:
        resultText = 'dificil'
        break
      default:
        resultText = 'Error en la predicción'
        break
    }

    setResults((prevResults) => {
      const newResults = [...prevResults]
      newResults[val] = resultText
      return newResults
    })
  }

  const handlePredictAll = () => {
    for (let i = 0; i < 4; i++) {
      fetchPrediction(i)
    }
  }

  return (
    <Layout>
      <div className='container mx-auto mt-8'>
        <Card>
          <CardHeader>
            <CardTitle>Clasificación Simulada</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Selecciona un nombre para ver la predicción de dificultad:</p>

            {/* Selección de nombres */}
            <div className='flex flex-wrap gap-4'>
              {names.map((name, index) => (
                <Button
                  key={index}
                  className={`m-2 ${results[index] ? 'bg-[#9A3324] text-white' : ''}`}
                  onClick={async () => fetchPrediction(index)}
                >
                  {name}
                </Button>
              ))}
            </div>

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

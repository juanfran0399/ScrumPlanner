import { ReactNode, useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
  IconBrandTeams, IconCapProjecting,
  IconLayoutDashboard, IconPokerChip,
  IconUserQuestion, IconWriting
} from '@tabler/icons-react'

const Content = (): ReactNode => {
  const [userId, setUserId] = useState<string | null>(null)
  const [teamId, setTeamId] = useState<string | null>(null)
  const [alreadySubmitted, setAlreadySubmitted] = useState<boolean>(false)
  const [isInTeam, setIsInTeam] = useState<boolean>(false)

  useEffect(() => {
    const storedUserId = localStorage.getItem('id_usuario')
    const storedTeamId = localStorage.getItem('team_id')
    setUserId(storedUserId)
    setTeamId(storedTeamId)
  }, [])

  useEffect(() => {
    const checkSurveyStatus = async () => {
      const userIdAsInt = parseInt(userId || '0', 10)
      try {
        const response = await axios.post('http://localhost:5000/api/survey/check', {
          id_usuario: userIdAsInt
        })
        if (response.data.success) setAlreadySubmitted(true)
      } catch (error) {
        console.error('Error checking survey status:', error)
      }
    }

    if (userId) checkSurveyStatus()
  }, [userId])

  useEffect(() => {
    const checkTeamStatus = async () => {
      const userIdAsInt = parseInt(userId || '0', 10)
      try {
        const response = await axios.post('http://localhost:5000/api/miembros/check2', {
          id_usuario: userIdAsInt
        })
        if (response.data.success) {
          setIsInTeam(true)
          if (response.data.team_id) {
            setTeamId(response.data.team_id.toString())
            localStorage.setItem('team_id', response.data.team_id.toString())
          }
        }
      } catch (error) {
        console.error('Error checking team membership:', error)
      }
    }

    if (userId) checkTeamStatus()
  }, [userId])

  return (
    <main className='grid items-start gap-4 p-4 sm:px-6 sm:py-0'>
      <div className='grid items-start gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>
              Scrum Planner{' '}
              {userId
                ? (
                  <span className='text-sm text-muted'>
                    ({userId}{teamId ? ` | Team ID: ${teamId}` : ''})
                  </span>
                  )
                : (
                  <span className='text-sm text-muted'>(Guest)</span>
                  )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alreadySubmitted
              ? (
                <>
                  <h1 className='mb-4 text-2xl'>Gestor de Proyectos</h1>
                  <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                    {isInTeam && (
                      <Link to='/proyects' className='flex flex-col justify-between p-6 font-semibold text-center transition-all border rounded-lg shadow-lg bg-muted/25 hover:bg-muted/50'>
                        <div className='mx-auto'><IconLayoutDashboard size={64} stroke={2} /></div>
                        <p>Proyect Dashboard</p>
                      </Link>
                    )}
                    <Link to='/teams' className='flex flex-col justify-between p-6 font-semibold text-center transition-all border rounded-lg shadow-lg bg-muted/25 hover:bg-muted/50'>
                      <div className='mx-auto'><IconBrandTeams size={64} stroke={2} /></div>
                      <p>Equipos</p>
                    </Link>
                  </div>
                  <Separator className='my-4' />
                  <h1 className='mb-4 text-2xl'>Scrum</h1>
                  {isInTeam
                    ? (
                      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                        <Link to='/poker' className='flex flex-col justify-between p-6 font-semibold text-center transition-all border rounded-lg shadow-lg bg-muted/25 hover:bg-muted/50'>
                          <div className='mx-auto'><IconPokerChip size={64} stroke={2} /></div>
                          <p>Scrum Poker</p>
                        </Link>
                        <Link to='/planning' className='flex flex-col justify-between p-6 font-semibold text-center transition-all border rounded-lg shadow-lg bg-muted/25 hover:bg-muted/50'>
                          <div className='mx-auto'><IconWriting size={64} stroke={2} /></div>
                          <p>Planning</p>
                        </Link>

                        <Link to='/projection' className='flex flex-col justify-between p-6 font-semibold text-center transition-all border rounded-lg shadow-lg bg-muted/25 hover:bg-muted/50'>
                          <div className='mx-auto'><IconCapProjecting size={64} stroke={2} /></div>
                          <p>Projection</p>
                        </Link>
                      </div>
                      )
                    : (
                      <p className='text-lg font-semibold text-center text-red-500'>
                        Debes unirte a un equipo para acceder a estas opciones.
                      </p>
                      )}
                </>
                )
              : (
                <div className='grid grid-cols-1 gap-6'>
                  <Link to='/survey' className='flex flex-col justify-between p-6 font-semibold text-center transition-all border rounded-lg shadow-lg bg-muted/25 hover:bg-muted/50'>
                    <div className='mx-auto'><IconUserQuestion size={64} stroke={2} /></div>
                    <p>Encuesta</p>
                  </Link>
                </div>
                )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

const Dashboard = (): ReactNode => {
  return (
    <Layout>
      <Content />
    </Layout>
  )
}

export default Dashboard

import { ReactNode } from 'react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { IconAnalyze, IconBrandTeams, IconDashboard, IconGraph, IconLayoutDashboard, IconLocationPin, IconPokerChip, IconQuestionMark, IconSortAscendingNumbers, IconTimelineEvent, IconTruck, IconUserQuestion, IconWriting } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

const Content = (): ReactNode => {
  return (
    <main className='grid items-start gap-4 p-4 sm:px-6 sm:py-0'>
      <div className='grid items-start gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Scrum Planner</CardTitle>
          </CardHeader>
          <CardContent>
            <h1 className='mb-4 text-2xl'>Gestor de Proyectos</h1>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              <Link to='/proyects' className='flex flex-col justify-between p-6 font-semibold text-center transition-all border rounded-lg shadow-lg bg-muted/25 hover:bg-muted/50'>
                <div className='mx-auto'>
                  <IconLayoutDashboard size={64} stroke={2} />
                </div>
                <p>Proyect Dashboard</p>
              </Link>
              <Link to='/shipments' className='flex flex-col justify-between p-6 font-semibold text-center transition-all border rounded-lg shadow-lg bg-muted/25 hover:bg-muted/50'>
                <div className='mx-auto'>
                  <IconBrandTeams size={64} stroke={2} />
                </div>
                <p>Equipos</p>
              </Link>
              <Link to='/shipments' className='flex flex-col justify-between p-6 font-semibold text-center transition-all border rounded-lg shadow-lg bg-muted/25 hover:bg-muted/50'>
                <div className='mx-auto'>
                  <IconUserQuestion size={64} stroke={2} />
                </div>
                <p>Encuesta</p>
              </Link>
            </div>
            <Separator className='my-4' />
            <h1 className='mb-4 text-2xl'>Scrum</h1>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              <Link to='/poker' className='flex flex-col justify-between p-6 font-semibold text-center transition-all border rounded-lg shadow-lg bg-muted/25 hover:bg-muted/50'>
                <div className='mx-auto'>
                  <IconPokerChip size={64} stroke={2} />
                </div>
                <p>Scrum Poker</p>
              </Link>

              <Link to='/events' className='flex flex-col justify-between p-6 font-semibold text-center transition-all border rounded-lg shadow-lg bg-muted/25 hover:bg-muted/50'>
                <div className='mx-auto'>
                  <IconWriting size={64} stroke={2} />
                </div>
                <p>Planning</p>
              </Link>

              <Link to='/events' className='flex flex-col justify-between p-6 font-semibold text-center transition-all border rounded-lg shadow-lg bg-muted/25 hover:bg-muted/50'>
                <div className='mx-auto'>
                  <IconGraph size={64} stroke={2} />
                </div>
                <p>Retrospectiva</p>
              </Link>

              <Link to='/events' className='flex flex-col justify-between p-6 font-semibold text-center transition-all border rounded-lg shadow-lg bg-muted/25 hover:bg-muted/50'>
                <div className='mx-auto'>
                  <IconAnalyze size={64} stroke={2} />
                </div>
                <p>Análisis</p>
              </Link>
            </div>
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

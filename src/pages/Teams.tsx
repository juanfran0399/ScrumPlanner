import { Separator } from '@/components/ui/separator'
import Layout from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface Team {
  id: number
  name: string
  membersCount: number
}

interface User {
  id: number
  name: string
  teamId: number | null
}

const LOCAL_STORAGE_KEYS = {
  TEAMS: 'teams',
  USER: 'user'
}

const getFromLocalStorage = (key: string) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

const setToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data))
}

const TeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [newTeamName, setNewTeamName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null)

  useEffect(() => {
    const storedTeams = getFromLocalStorage(LOCAL_STORAGE_KEYS.TEAMS) || []
    const storedUser = getFromLocalStorage(LOCAL_STORAGE_KEYS.USER) || { id: 2, name: 'Luis Garcia', teamId: null }

    setTeams(storedTeams)
    setUser(storedUser)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    console.log('User data:', user) // Debugging state
  }, [user])

  const joinTeam = (teamId: number) => {
    if (user != null) {
      const team = teams.find((team) => team.id === teamId)
      if (team != null) {
        const updatedTeams = teams.map(t => t.id === teamId ? { ...t, membersCount: t.membersCount + 1 } : t)
        setTeams(updatedTeams)
        setUser({ ...user, teamId })
        setToLocalStorage(LOCAL_STORAGE_KEYS.TEAMS, updatedTeams)
        setToLocalStorage(LOCAL_STORAGE_KEYS.USER, { ...user, teamId })
        alert(`You have joined ${team.name}`)
      } else {
        alert('Selected team does not exist.')
      }
    } else {
      alert('User is not available')
    }
  }

  const createTeam = () => {
    if (!newTeamName.trim()) {
      alert('Team name cannot be empty')
      return
    }

    const newTeam = { id: teams.length + 1, name: newTeamName, membersCount: 1 }
    const updatedTeams = [...teams, newTeam]
    setTeams(updatedTeams)
    setToLocalStorage(LOCAL_STORAGE_KEYS.TEAMS, updatedTeams)
    if (user != null) {
      const updatedUser = { ...user, teamId: newTeam.id }
      setUser(updatedUser)
      setToLocalStorage(LOCAL_STORAGE_KEYS.USER, updatedUser)
    }
    alert('Team created successfully!')
  }

  const leaveTeam = () => {
    if (user != null && user.teamId) {
      const updatedTeams = teams.map(t => t.id === user.teamId ? { ...t, membersCount: t.membersCount - 1 } : t)
      setTeams(updatedTeams)
      setToLocalStorage(LOCAL_STORAGE_KEYS.TEAMS, updatedTeams)
      const updatedUser = { ...user, teamId: null }
      setUser(updatedUser)
      setToLocalStorage(LOCAL_STORAGE_KEYS.USER, updatedUser)
      alert('You have left the team.')
    } else {
      alert('You are not part of any team.')
    }
  }

  const deleteTeam = (teamId: number) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      const updatedTeams = teams.filter((team) => team.id !== teamId)
      if (user != null && user.teamId === teamId) {
        setUser({ ...user, teamId: null })
        setToLocalStorage(LOCAL_STORAGE_KEYS.USER, { ...user, teamId: null })
      }
      setTeams(updatedTeams)
      setToLocalStorage(LOCAL_STORAGE_KEYS.TEAMS, updatedTeams)
      alert('Team deleted successfully!')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <div className='container mx-auto mt-8'>
        {user != null && user.teamId
? (
          <div>
            <h1 className='text-2xl font-bold'>You are part of a team!</h1>
            <p>You are in team {teams.find((team) => team.id === user.teamId)?.name}</p>
            <Button className='mt-4 text-white bg-red-500' onClick={leaveTeam}>
              Leave Team
            </Button>
          </div>
        )
: (
          <div>
            <h1 className='text-2xl font-bold'>Available Teams</h1>
            <p>Select a team to join or create a new one:</p>
            <div className='flex flex-wrap gap-4'>
              {teams.map((team) => (
                <div key={team.id} className='flex items-center gap-2'>
                  <Button
                    className={`m-2 ${selectedTeam === team.id ? 'bg-[#9A3324] text-white' : ''}`}
                    onClick={() => setSelectedTeam(team.id)}
                  >
                    {team.name} ({team.membersCount} members)
                  </Button>
                  <Button
                    className='text-white bg-red-500'
                    onClick={() => deleteTeam(team.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
            {selectedTeam && (
              <Button className='mt-4' onClick={() => joinTeam(selectedTeam)}>
                Join Selected Team
              </Button>
            )}
            <Separator className='my-4' />
            <div>
              <h2 className='text-xl font-bold'>Create a New Team</h2>
              <input
                type='text'
                placeholder='Enter team name'
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className='w-full p-2 mt-2 text-black border border-gray-300'
              />
              <Button className='mt-4' onClick={createTeam}>
                Create Team
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default TeamsPage

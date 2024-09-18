import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import Layout from '@/components/Layout'
import { Button } from '@/components/ui/button'

const TeamsPage = () => {
  const [teams, setTeams] = useState([
    { id: 1, name: 'Team Alpha', membersCount: 5, members: ['Alice', 'Bob', 'Charlie', 'David', 'Eve'] },
    { id: 2, name: 'Team Beta', membersCount: 3, members: ['Frank', 'Grace', 'Hannah'] },
    { id: 3, name: 'Team Gamma', membersCount: 4, members: ['Isaac', 'Jack', 'Karen', 'Liam'] }
  ])
  const [user, setUser] = useState({ id: 1, name: 'John Doe', teamId: null }) // Initially no team assigned
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [newTeamName, setNewTeamName] = useState('')

  const joinTeam = (teamId) => {
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          membersCount: team.membersCount + 1,
          members: [...team.members, user.name]
        }
      }
      return team
    })
    setTeams(updatedTeams)
    setUser({ ...user, teamId })
  }

  const leaveTeam = () => {
    const updatedTeams = teams.map(team => {
      if (team.id === user.teamId) {
        return {
          ...team,
          membersCount: team.membersCount - 1,
          members: team.members.filter(member => member !== user.name)
        }
      }
      return team
    })
    setTeams(updatedTeams)
    setUser({ ...user, teamId: null })
  }

  const deleteTeam = (teamId) => {
    setTeams(teams.filter(team => team.id !== teamId))
  }

  const createTeam = () => {
    if (!newTeamName) return
    const newTeam = { id: teams.length + 1, name: newTeamName, membersCount: 1, members: [user.name] }
    setTeams([...teams, newTeam])
    setNewTeamName('')
    setUser({ ...user, teamId: newTeam.id })
  }

  return (
    <Layout>
      <div className='container mx-auto mt-8'>
        {user.teamId
          ? (
            <div>
              <h1 className='text-2xl font-bold'>You are part of a team!</h1>
              <p>You are in team {teams.find((team) => team.id === user.teamId)?.name}</p>
              <h2 className='text-xl font-bold'>Team Members:</h2>
              <ul className='list-disc list-inside'>
                {teams.find(team => team.id === user.teamId)?.members.map(member => (
                  <li key={member}>{member}</li>
                ))}
              </ul>
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
                <div>
                  <h2 className='mt-4 text-xl font-bold'>Team Members:</h2>
                  <ul className='list-disc list-inside'>
                    {teams.find(team => team.id === selectedTeam)?.members.map(member => (
                      <li key={member}>{member}</li>
                    ))}
                  </ul>
                  <Button className='mt-4' onClick={() => joinTeam(selectedTeam)}>
                    Join Selected Team
                  </Button>
                </div>
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

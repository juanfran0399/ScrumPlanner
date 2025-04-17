import { useState, useEffect } from 'react'
import { Separator } from '@/components/ui/separator'
import Layout from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'

const Teams = () => {
  const [userId, setUserId] = useState<number | null>(null)
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamDescription, setNewTeamDescription] = useState('')
  const [newTeamPassword, setNewTeamPassword] = useState('')
  const [creatingTeam, setCreatingTeam] = useState(false)
  const [joiningTeam, setJoiningTeam] = useState(false)
  const [joinTeamPassword, setJoinTeamPassword] = useState('')
  const [availableTeams, setAvailableTeams] = useState<any[]>([]) // Updated type to any[] to match usage
  const [selectedTeam, setSelectedTeam] = useState('')
  const [teamMembers, setTeamMembers] = useState<Array<{ user_id: number; nombre: string }>>([]) // Updated type to match usage
  const [showCreateTeam, setShowCreateTeam] = useState(false)

  useEffect(() => {
    const storedUserId = parseInt(localStorage.getItem('id_usuario') || '', 10)
    const storedTeamId = localStorage.getItem('team_id') || ''

    if (storedUserId) setUserId(storedUserId)
    if (storedTeamId) setSelectedTeam(storedTeamId) // Automatically select the team
  }, [])

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/team/all')
        if (response.data.teams) setAvailableTeams(response.data.teams)
      } catch (error) {
        console.error('Error fetching teams:', error)
      }
    }
    fetchTeams()
  }, [])

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!selectedTeam) return
      try {
        const response = await axios.get(`http://localhost:5000/api/team/members/${selectedTeam}`)
        if (response.data.members) setTeamMembers(response.data.members)
      } catch (error) {
        console.error('Error fetching team members:', error)
      }
    }
    fetchTeamMembers()
  }, [selectedTeam])

  const createTeam = async () => {
    setCreatingTeam(true)
    try {
      const response = await axios.post('http://localhost:5000/api/team/add', {
        name: newTeamName,
        description: newTeamDescription,
        pass: newTeamPassword
      })

      console.log('Response:', response.data) // Debugging

      if (response.data.success) {
        window.location.href = window.location.href // Force refresh
      } else {
        alert(response.data.message || 'Failed to create team.')
      }
    } catch (error) {
      console.error('Error creating team:', error)
      alert('An error occurred while adding the team.')
    } finally {
      setCreatingTeam(false)
    }
  }

  const joinTeam = async () => {
    if (!selectedTeam) return alert('Please select a team to join.')

    setJoiningTeam(true)
    try {
      const response = await axios.post('http://localhost:5000/api/team/join', {
        team_id: parseInt(selectedTeam, 10),
        user_id: userId,
        pass: joinTeamPassword
      })
      if (response.data.success) {
        window.location.reload()
        window.location.reload()
        alert('Successfully joined the team!')
        localStorage.setItem('team_id', selectedTeam)
        setJoinTeamPassword('')
        window.location.reload()
      } else {
        alert(response.data.message || 'Unable to join the team.')
      }
    } catch (error) {
      alert('Error joining the team.')
    } finally {
      setJoiningTeam(false)
    }
  }

  const exitTeam = async () => {
    if (!selectedTeam) return alert('Please select a team to exit.')

    try {
      const response = await axios.post('http://localhost:5000/api/team/exit', {
        team_id: parseInt(selectedTeam, 10),
        user_id: userId
      })
      if (response.data.success) {
        alert('Successfully exited the team.')
        setSelectedTeam('')
        setTeamMembers([])
        window.location.reload()
      } else {
        alert(response.data.message || 'Failed to exit the team.')
      }
    } catch (error) {
      alert('Error exiting team.')
    }
  }

  return (
    <Layout>
      <div className='container mx-auto mt-8 space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>User Info</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-lg'>User ID: {userId ?? 'No user ID found'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select a Team</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className='w-full p-2 text-white bg-gray-800 border border-gray-300 rounded-md'
            >
              <option value='' className='text-white bg-gray-800'>Select a team</option>
              {availableTeams.map((team) => (
                <option key={team.team_id} value={team.team_id} className='text-white bg-gray-800'>
                  {team.name} - {team.description}
                </option>
              ))}
            </select>

            {/* Password input for joining a team */}
            {selectedTeam && (
              <div className='mt-4'>
                <Input
                  type='password'
                  placeholder='Enter team password'
                  value={joinTeamPassword}
                  onChange={(e) => setJoinTeamPassword(e.target.value)}
                />
              </div>
            )}

            <div className='flex mt-4 space-x-4'>
              <Button onClick={joinTeam} disabled={joiningTeam || !selectedTeam}>
                {joiningTeam ? 'Joining...' : 'Join Team'}
              </Button>
              <Button onClick={exitTeam} disabled={!selectedTeam} variant='destructive'>
                Exit Team
              </Button>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Button className='w-full' onClick={() => setShowCreateTeam(!showCreateTeam)}>
          {showCreateTeam ? 'Hide Create Team' : 'Create a New Team'}
        </Button>

        {showCreateTeam && (
          <Card>
            <CardHeader>
              <CardTitle>Create a New Team</CardTitle>
            </CardHeader>
            <CardContent>
              <Input type='text' placeholder='Team Name' value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} />
              <Input type='text' placeholder='Description' value={newTeamDescription} onChange={(e) => setNewTeamDescription(e.target.value)} className='mt-2' />
              <Input type='password' placeholder='Password' value={newTeamPassword} onChange={(e) => setNewTeamPassword(e.target.value)} className='mt-2' />
              <Button className='w-full mt-4' onClick={createTeam} disabled={creatingTeam}>
                {creatingTeam ? 'Creating...' : 'Create Team'}
              </Button>
            </CardContent>
          </Card>
        )}

        <Separator />

        {selectedTeam && (
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              {teamMembers.length > 0
                ? (
                  <ul className='pl-5 list-disc'>
                    {teamMembers.map((member, index) => (
                      <li key={index}>{member.nombre}</li>
                    ))}
                  </ul>
                  )
                : (
                  <p>No members found.</p>
                  )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}

export default Teams

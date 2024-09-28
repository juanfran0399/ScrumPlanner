import { useState, useEffect } from 'react'
import { Separator } from '@/components/ui/separator'
import Layout from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'

const Teams = () => {
  const [userId, setUserId] = useState(null)
  const [newTeamName, setNewTeamName] = useState('')
  const [newTeamDescription, setNewTeamDescription] = useState('')
  const [newTeamPassword, setNewTeamPassword] = useState('') // New state for password
  const [creatingTeam, setCreatingTeam] = useState(false)
  const [joiningTeam, setJoiningTeam] = useState(false)
  const [joinTeamPassword, setJoinTeamPassword] = useState('')
  const [availableTeams, setAvailableTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState('')
  const [teamMembers, setTeamMembers] = useState([])

  useEffect(() => {
    const storedUserId = parseInt(localStorage.getItem('id_usuario'), 10)
    if (storedUserId) {
      setUserId(storedUserId)
    }
  }, [])

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/team/all')
        if (response.data.teams) {
          setAvailableTeams(response.data.teams)
        }
      } catch (error) {
        console.error('Error fetching teams:', error)
      }
    }

    fetchTeams()
  }, [])

  // Fetch team members whenever the selected team changes
  useEffect(() => {
    const fetchTeamMembers = async () => {
      const teamId = localStorage.getItem('team_id')
      const cleanTeamId = teamId ? teamId.split('%')[0] : null

      if (cleanTeamId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/team/members/${cleanTeamId}`)
          if (response.data.members) {
            setTeamMembers(response.data.members)
          }
        } catch (error) {
          console.error('Error fetching team members:', error)
        }
      }
    }

    fetchTeamMembers()
  }, [selectedTeam])

  const createTeam = async () => {
    try {
      setCreatingTeam(true)

      // Log the password to ensure it's being captured
      console.log('Password:', newTeamPassword)
      const response = await axios.post('http://localhost:5000/api/team/add', {
        name: newTeamName,
        description: newTeamDescription,
        pass: newTeamPassword // Include the password in the request
      })

      if (response.data.success) {
        alert('Team added successfully!')
        setNewTeamName('')
        setNewTeamDescription('')
        setNewTeamPassword('') // Clear the password field
        setTeamMembers([]) // Clear team members after creating a team
        // Refresh the page after creating the team
        window.location.reload()
      }
    } catch (error) {
      alert('An error occurred while adding the team.')
    } finally {
      setCreatingTeam(false)
    }
  }

  const joinTeam = async () => {
    if (!selectedTeam) {
      alert('Please select a team to join.')
      return
    }

    const teamId = parseInt(selectedTeam, 10)

    try {
      setJoiningTeam(true)
      const response = await axios.post('http://localhost:5000/api/team/join', {
        team_id: teamId,
        user_id: userId,
        pass: joinTeamPassword
      })
      if (response.data.success) {
        alert('Successfully joined the team!')
        localStorage.setItem('team_id', teamId)
        window.location.reload()
        setSelectedTeam('')
        setTeamMembers([])
      } else {
        alert(response.data.message || 'Unable to join the team.')
      }
    } catch (error) {
      console.error('Error joining team:', error)
      window.location.reload()
    } finally {
      setJoiningTeam(false)
    }
  }

  const handleExitTeam = async () => {
    if (!selectedTeam) {
      alert('Please select a team to exit.')
      return
    }
    const teamId = parseInt(selectedTeam, 10)
    try {
      // Make the API request to exit the team
      const response = await axios.post('http://localhost:5000/api/team/exit', { team_id: teamId, user_id: userId })

      // Check if the exit was successful
      if (response.data.success) {
        alert('Successfully exited the team.')
        setSelectedTeam('') // Clear selected team
        setTeamMembers([]) // Clear team members after exiting
        // Refresh the page after exiting the team
        window.location.reload()
      } else {
        alert(response.data.message || 'Failed to exit the team.')
      }
    } catch (error) {
      console.error('Error exiting team:', error)
      if (error.response && error.response.status === 400) {
        alert('You are not an active member of this team.')
      } else {
        alert('Failed to exit the team.')
      }
    }
  }

  return (
    <Layout>
      <div className='container mx-auto mt-8'>
        <div>
          <p>User ID: {userId !== null ? userId : 'No user ID found'}</p>
        </div>

        <Separator className='my-4' />

        <div className='mt-4'>
          <h2 className='text-xl font-bold'>Add a New Team</h2>
          <Input
            type='text'
            placeholder='Enter team name'
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className='w-full p-2 mt-2'
          />
          <Input
            type='text'
            placeholder='Enter team description'
            value={newTeamDescription}
            onChange={(e) => setNewTeamDescription(e.target.value)}
            className='w-full p-2 mt-2'
          />
          <Input
            type='password'
            placeholder='Enter team password'
            value={newTeamPassword}
            onChange={(e) => setNewTeamPassword(e.target.value)} // Make sure this captures the input
            className='w-full p-2 mt-2'
          />
          <Button
            className='mt-4'
            onClick={createTeam}
            disabled={creatingTeam}
          >
            {creatingTeam ? 'Adding Team...' : 'Add Team'}
          </Button>
        </div>

        <Separator className='my-4' />

        {/* Join Team Section */}
        <div className='mt-4'>
          <h2 className='text-xl font-bold'>Team Options</h2>
          {availableTeams.length > 0 ? (
            <div>
              <select
                value={selectedTeam}
                onChange={(e) => {
                  const selectedValue = e.target.value
                  setSelectedTeam(selectedValue)
                  if (selectedValue) {
                    localStorage.setItem('team_id', selectedValue)
                  }
                }}
                className='w-full p-2 mt-2 text-black border border-gray-300'
              >
                <option value=''>Select a team</option>
                {availableTeams.map((team) => (
                  <option key={team.teamId} value={team.teamId}>
                    {team.team_id} - {team.name} - {team.description}
                  </option>
                ))}
              </select>

              {/* Join Password Input */}
              <Input
                type='password'
                placeholder='Enter join password'
                value={joinTeamPassword}
                onChange={(e) => setJoinTeamPassword(e.target.value)}
                className='w-full p-2 mt-2 text-black border border-gray-300'
              />

              <div className='flex mt-4 space-x-4'>
                <Button onClick={joinTeam} disabled={joiningTeam || !selectedTeam}>
                  {joiningTeam ? 'Joining Team...' : 'Join Team'}
                </Button>

                <Button
                  onClick={handleExitTeam}
                  disabled={!selectedTeam}
                >
                  Exit Team
                </Button>
              </div>
            </div>
          )
            : (
              <p>No teams are available to join.</p>
              )}
        </div>

        <Separator className='my-4' />

        {/* Display Team Members */}
        <div className='mt-4'>
          <h2 className='text-xl font-bold'>
            {selectedTeam ? `Team Members for ${selectedTeam}` : 'No Team Selected'}
          </h2>
          {selectedTeam && teamMembers.length > 0
            ? (
              <ul>
                {teamMembers.map((member, index) => (
                  <li key={index}>{member.nombre}</li>
                ))}
              </ul>
              )
            : (
              <p>{selectedTeam ? 'No members found for the selected team.' : 'Please select a team to view members.'}</p>
              )}
        </div>

      </div>
    </Layout>
  )
}

export default Teams

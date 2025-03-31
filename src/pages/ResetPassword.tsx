import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError(true)
      return
    }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', { token, password })
      if (response.data.success) {
        setSuccess(true)
        setTimeout(() => navigate('/login'), 3000)
      } else {
        setError(true)
      }
    } catch (error) {
      setError(true)
    }
  }

  return (
    <div className='max-w-md p-6 mx-auto mt-10 bg-white rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold text-center'>Restablecer Contraseña</h2>
      <Label>Nueva Contraseña</Label>
      <Input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
      <Label>Confirmar Contraseña</Label>
      <Input type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      {error && <span className='text-destructive'>Las contraseñas no coinciden</span>}
      {success && <span className='text-green-600'>Contraseña actualizada con éxito</span>}
      <Button onClick={handleResetPassword}>Actualizar</Button>
    </div>
  )
}

export default ResetPassword

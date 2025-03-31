import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import video from '@/assets/media/Udg.mp4'
import LogoUDG from '@/assets/images/favicon.png'
import useAuthStore from '@/stores/useAuthStore'
import { useNavigate } from 'react-router-dom'

const LoginForm = (): JSX.Element => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userNameError, setUserNameError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [rememberMe, setRememberMe] = useState(localStorage.getItem('rememberMe') === 'true')
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetError, setResetError] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const userId = localStorage.getItem('id_usuario')
    if (isLoggedIn && userId) {
      navigate('/dashboard')
    }
  }, [])

  const handleForgotPassword = async () => {
    setProcessing(true)
    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email: resetEmail })
      if (response.data.success) {
        setResetSuccess(true)
        setResetError(false)
      } else {
        setResetError(true)
      }
    } catch (error) {
      setResetError(true)
    }
    setProcessing(false)
  }

  return (
    <div className='w-full min-h-screen lg:grid lg:grid-cols-2'>
      <div className='flex items-center justify-center py-12'>
        <div className='grid w-10/12 gap-6 mx-auto md:w-1/2'>
          <picture>
            <img src={LogoUDG} alt='Logo de Leones Negros' className='w-auto mx-auto' />
          </picture>
          <div className='grid gap-2 text-center'>
            <h1 className='text-3xl font-bold'>Iniciar Sesión</h1>
          </div>
          <div className='grid gap-4'>
            <Label>Usuario</Label>
            <Input value={username} onChange={(e) => { setUsername(e.target.value); setUserNameError(false) }} disabled={processing} />
            {userNameError && <span className='text-destructive'>Es necesario que ingreses tu usuario</span>}
            <Label>Contraseña</Label>
            <Input type='password' value={password} onChange={(e) => { setPassword(e.target.value); setPasswordError(false) }} disabled={processing} />
            {passwordError && <span className='text-destructive'>Es necesario que ingreses tu contraseña</span>}
            <Button variant='link' onClick={() => setForgotPasswordModalOpen(true)}>¿Olvidaste tu contraseña?</Button>
            <Switch checked={rememberMe} onCheckedChange={(checked) => { setRememberMe(checked); localStorage.setItem('rememberMe', checked.toString()) }} disabled={processing} />
            <Button onClick={handleForgotPassword} disabled={processing}>Ingresar</Button>
            <Button variant='outline' onClick={() => setRegisterModalOpen(true)}>Crear Cuenta</Button>
          </div>
        </div>
      </div>
      <div className='relative bg-gray-800 lg:block'>
        <video autoPlay muted loop className='w-full h-full'>
          <source src={video} type='video/mp4' />
        </video>
      </div>
      <Dialog open={forgotPasswordModalOpen} onOpenChange={setForgotPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recuperar Contraseña</DialogTitle>
          </DialogHeader>
          <Label>Correo Electrónico</Label>
          <Input value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
          {resetError && <span className='text-destructive'>Error al enviar solicitud</span>}
          {resetSuccess && <span className='text-success'>Correo enviado con éxito</span>}
          <Button onClick={handleForgotPassword} disabled={processing}>Enviar Instrucciones</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LoginForm

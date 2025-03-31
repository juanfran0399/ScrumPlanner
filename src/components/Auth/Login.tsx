import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import video from '@/assets/media/Udg.mp4'
import LogoUDG from '@/assets/images/favicon.png'
import useAuthStore from '@/stores/useAuthStore'
import { useNavigate } from 'react-router-dom'

const LoginForm = (): JSX.Element => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userNameError, setUserNameError] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<boolean>(false)
  const [loginError, setLoginError] = useState<boolean>(false)
  const [processing, setProcessing] = useState<boolean>(false)
  const [rememberMe, setRememberMe] = useState<boolean>(localStorage.getItem('rememberMe') === 'true')

  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const userId = localStorage.getItem('id_usuario')

    if (isLoggedIn && userId) {
      navigate('/dashboard') // Redirect if user is logged in
    }
  }, [])

  const handleSubmit = async (): Promise<void> => {
    if (username.trim() === '') {
      setUserNameError(true)
    }
    if (password.trim() === '') {
      setPasswordError(true)
    }
    if (username.trim() !== '' && password.trim() !== '') {
      setProcessing(true)
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          username,
          contrasena: password
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (response.data.success) {
          const id_usuario = response.data.id_usuario
          if (rememberMe) {
            localStorage.setItem('user', username)
            localStorage.setItem('id_usuario', id_usuario)
            localStorage.setItem('isLoggedIn', 'true')
            localStorage.setItem('rememberMe', 'true')
          } else {
            sessionStorage.setItem('user', username)
            sessionStorage.setItem('id_usuario', id_usuario)
            sessionStorage.setItem('isLoggedIn', 'true')
          }
          login()
          navigate('/dashboard')
        } else {
          setLoginError(true)
        }
      } catch (error) {
        console.error('Login error', error)
        setLoginError(true)
      }
      setProcessing(false)
    }
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
            <p className='text-muted-foreground'>Ingresa tus credenciales a continuación para iniciar sesión</p>
          </div>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='username'>Usuario</Label>
              <Input
                id='username'
                type='text'
                value={username}
                placeholder='Código UDG'
                onChange={(e) => {
                  setUsername(e.target.value)
                  setUserNameError(false)
                }}
                disabled={processing}
              />
              {userNameError && <span className='text-destructive'>Es necesario que ingreses tu usuario</span>}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Contraseña</Label>
              <Input
                id='password'
                type='password'
                placeholder='****'
                onChange={(e) => {
                  setPassword(e.target.value)
                  setPasswordError(false)
                }}
                disabled={processing}
              />
              {passwordError && <span className='text-destructive'>Es necesario que ingreses tu contraseña</span>}
            </div>
            <div className='flex items-center justify-start'>
              <Label htmlFor='remember-me' className='flex items-center'>Recordar mi sesión</Label>
              <Switch
                className='ml-2'
                id='remember-me'
                checked={rememberMe}
                onCheckedChange={(checked) => {
                  setRememberMe(checked)
                  localStorage.setItem('rememberMe', checked.toString())
                }}
                disabled={processing}
              />
            </div>
            {loginError && (
              <div className='p-4 text-center rounded bg-destructive/50 text-foreground'>
                La combinación de Usuario y Contraseña ingresada no corresponde a un usuario existente
              </div>
            )}
            <Button type='submit' onClick={handleSubmit} className='w-full' disabled={processing}>Ingresar</Button>
          </div>
        </div>
      </div>
      <div className='relative bg-gray-800 lg:block'>
        <video autoPlay muted loop className='w-full h-full'>
          <source src={video} type='video/mp4' />
        </video>
      </div>
    </div>
  )
}

export default LoginForm
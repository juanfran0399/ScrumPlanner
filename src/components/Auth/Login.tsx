import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '../ui/switch'
import video from '@/assets/media/Udg.mp4'
import LogoUDG from '@/assets/images/favicon.png'
import useAuthStore from '@/stores/useAuthStore'
import { useNavigate } from 'react-router-dom'

const LoginForm = (): JSX.Element => {
  const [username, setUsername] = useState('')
  const [id_usuario] = useState('')
  const [password, setPassword] = useState('')
  const [userNameError, setUserNameError] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<boolean>(false)
  const [loginError, setLoginError] = useState<boolean>(false)
  const [processing, setProcessing] = useState<boolean>(false)

  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

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

        console.log('Response:', response.data) // Debug log

        if (response.data.success) {
          const id_usuario = response.data.id_usuario // Ensure id_usuario is being accessed properly
          console.log('Frontend id_usuario:', id_usuario) // Debug log

          if (localStorage.getItem('rememberMe') === 'true') {
            localStorage.setItem('user', username)
            localStorage.setItem('id_usuario', id_usuario) // Save id_usuario to localStorage
            localStorage.setItem('isLoggedIn', 'true')
          }

          login() // Assuming this is a state update function
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
            <source srcSet={LogoUDG} media='(prefers-color-scheme: dark)' />
            <source srcSet={LogoUDG} media='(prefers-color-scheme: light)' />
            <img src={LogoUDG} alt='Logo de Leones Negros' className='w-auto mx-auto' />
          </picture>
          <div className='grid gap-2 text-center'>
            <h1 className='text-3xl font-bold'>Iniciar Sesión</h1>
            <p className='text-balance text-muted-foreground'>
              Ingresa tus credenciales a continuación para iniciar sesión
            </p>
          </div>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label className={userNameError ? 'text-destructive' : ''} htmlFor='username'>Usuario</Label>
              <Input
                id='username'
                type='text'
                placeholder='Código UDG'
                onChange={(e) => {
                  setUsername(e.target.value)
                  setUserNameError(false)
                }}
                className={userNameError ? 'border-destructive' : ''}
                disabled={processing}
                required
              />
              {userNameError && <span className='text-destructive'>Es necesario que ingreses tu usuario</span>}
            </div>
            <div className='grid gap-2'>
              <div className='flex items-center'>
                <Label className={passwordError ? 'text-destructive' : ''} htmlFor='password'>Contraseña</Label>
              </div>
              <Input
                id='password'
                type='password'
                placeholder='********'
                onChange={(e) => {
                  setPassword(e.target.value)
                  setPasswordError(false)
                }}
                className={passwordError ? 'border-destructive' : ''}
                disabled={processing}
                required
              />
              {passwordError && <span className='text-destructive'>Es necesario que ingreses tu contraseña</span>}
            </div>

            <div className='flex items-center justify-start'>
              <Label htmlFor='remember-me' className='flex items-center'>
                Recordar mi sesión
              </Label>
              <Switch
                className='ml-2'
                id='remember-me'
                defaultChecked={localStorage.getItem('rememberMe') === 'true'}
                onCheckedChange={(checked) => {
                  localStorage.setItem('rememberMe', checked.toString())
                }}
                disabled={processing}
              />
            </div>

            {loginError && (
              <div className='p-4 text-center rounded bg-destructive/50 text-foreground'>
                La combinación de Usuario y Contraseña ingresa no corresponde a un usuario existente
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

import LoginForm from '@/components/Auth/Login'
import { Outlet, useNavigate } from 'react-router-dom'
import useAuthStore from '@/stores/useAuthStore'
import { useEffect } from 'react'

const Home = (): JSX.Element => {
  const navigate = useNavigate()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  useEffect(() => {
    const logged = localStorage.getItem('isLoggedIn') === 'true'
    useAuthStore.setState({ isLoggedIn: logged })
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      const {
        pathname, search
      } = window.location

      navigate(`${pathname}${search}`)
    }
  }, [isLoggedIn])

  return (
    isLoggedIn
      ? <Outlet />
      : <LoginForm />
  )
}

export default Home

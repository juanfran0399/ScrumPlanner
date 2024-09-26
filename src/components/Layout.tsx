import { Link } from 'react-router-dom'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { IconHome, IconMenu2, IconPackage, IconSettings, IconLocationSearch, IconLogout2, IconUser, IconTimelineEventFilled, IconTimelineEvent, IconTimelineEventX, IconCalendarEvent, IconTimelineEventPlus, IconTruckLoading, IconTruckReturn, IconTruckDelivery, IconImageInPicture, IconDashboard, IconLayoutDashboard, IconBrandTeams, IconUserQuestion, IconPokerChip, IconWriting, IconBackspace } from '@tabler/icons-react'
import defaultUser from '@/assets/images/default-user.png'
import LayoutProps from '@/types/Layout'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogHeader, AlertDialogFooter } from './ui/alert-dialog'
import useAuthStore from '@/stores/useAuthStore'

const Layout = ({ children }: LayoutProps): JSX.Element => {
  const handleLogout = (): void => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user')
    useAuthStore.setState({ isLoggedIn: false })
  }

  return (
    <div className='flex flex-col w-full min-h-screen bg-muted/40'>
      <aside className='fixed inset-y-0 left-0 z-10 flex-col hidden border-r w-14 bg-background sm:flex'>
        <nav className='flex flex-col items-center gap-4 px-2 sm:py-4'>
          <Link
            to='/dashboard'
            className='flex items-center justify-center gap-2 text-lg font-semibold rounded-full group h-9 w-9 shrink-0 bg-primary text-primary-foreground md:h-8 md:w-8 md:text-base'
          >
            <img
              src='/favicon.png'
              alt='Icono'
              className='w-8 h-8 transition-all group-hover:scale-110'
            />
            <span className='sr-only'>Scrum Planner UDG</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to='/dashboard'
                className='flex items-center justify-center transition-colors rounded-lg h-9 w-9 text-muted-foreground hover:text-foreground md:h-8 md:w-8'
              >
                <IconHome className='w-5 h-5' />
                <span className='sr-only' />
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right'>Menú Principal</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to='/proyects'
                className='flex items-center justify-center transition-colors rounded-lg h-9 w-9 text-muted-foreground hover:text-foreground md:h-8 md:w-8'
              >
                <IconLayoutDashboard className='w-5 h-5' />
                <span className='sr-only'>Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right'>Proyect Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to='/teams'
                className='flex items-center justify-center transition-colors rounded-lg h-9 w-9 text-muted-foreground hover:text-foreground md:h-8 md:w-8'
              >
                <IconBrandTeams className='w-5 h-5' />
                <span className='sr-only'>Equipos</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right'>Equipos</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to='/survey'
                className='flex items-center justify-center transition-colors rounded-lg h-9 w-9 text-muted-foreground hover:text-foreground md:h-8 md:w-8'
              >
                <IconUserQuestion className='w-5 h-5' />
                <span className='sr-only'>Encuesta</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right'>Encuesta</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to='/poker'
                className='flex items-center justify-center transition-colors rounded-lg h-9 w-9 text-muted-foreground hover:text-foreground md:h-8 md:w-8'
              >
                <IconPokerChip className='w-5 h-5' />
                <span className='sr-only'>Scrum Poker</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right'>Scrum Poker</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to='/planning'
                className='flex items-center justify-center transition-colors rounded-lg h-9 w-9 text-muted-foreground hover:text-foreground md:h-8 md:w-8'
              >
                <IconWriting className='w-5 h-5' />
                <span className='sr-only'>Planning</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right'>Planning</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to='/retrospective'
                className='flex items-center justify-center transition-colors rounded-lg h-9 w-9 text-muted-foreground hover:text-foreground md:h-8 md:w-8'
              >
                <IconBackspace className='w-5 h-5' />
                <span className='sr-only'>Retrospectiva</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right'>Retrospectiva</TooltipContent>
          </Tooltip>
        </nav>
        <nav className='flex flex-col items-center gap-4 px-2 mt-auto sm:py-4'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to='/settings'
                className='flex items-center justify-center transition-colors rounded-lg h-9 w-9 text-muted-foreground hover:text-foreground md:h-8 md:w-8'
              >
                <IconSettings className='w-5 h-5' />
                <span className='sr-only'>Configuraciones</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side='right'>Configuraciones</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
        <header className='sticky top-0 z-30 flex items-center gap-4 px-4 border-b h-14 bg-background sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
          <Sheet>
            <SheetTrigger asChild>
              <Button size='icon' variant='outline' className='sm:hidden'>
                <IconMenu2 className='w-5 h-5' />
                <span className='sr-only'>Abrir Menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='sm:max-w-xs'>
              <nav className='grid gap-6 text-lg font-medium'>
                <Link
                  to='/dashboard'
                  className='flex items-center justify-center w-10 h-10 gap-2 text-lg font-semibold rounded-full group shrink-0 bg-primary text-primary-foreground md:text-base'
                >
                  <IconPackage className='w-5 h-5 transition-all group-hover:scale-110' />
                  <span className='sr-only'>Scrum Planner UDG</span>
                </Link>
                <Link
                  to='/dashboard'
                  className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
                >
                  <IconHome className='w-5 h-5' />
                  Menú Principal
                </Link>
                <Link
                  to='/shipments'
                  className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
                >
                  <IconPackage className='w-5 h-5' />
                  Cargas
                </Link>
                <Link
                  to='/locations'
                  className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
                >
                  <IconLocationSearch className='w-5 h-5' />
                  Ubicaciones
                </Link>
                <Link
                  to='/locations'
                  className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
                >
                  <IconSettings className='w-5 h-5' />
                  Configuraciones
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Breadcrumb className='hidden md:flex'>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to='/dashboard'>Menú Principal</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className='relative flex-1 ml-auto md:grow-0' />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                className='overflow-hidden rounded-full'
              >
                <img
                  src={defaultUser}
                  width={36}
                  height={36}
                  alt='Avatar'
                  className='overflow-hidden rounded-full'
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem>
                <IconUser className='w-4 h-4 mr-2' /> Mi Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <IconSettings className='w-4 h-4 mr-2' /> Configuraciones
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant='ghost' className='w-full'>
                    <IconLogout2 className='w-4 h-4 mr-2' /> Cerrar Sesión
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
                    <AlertDialogDescription>
                      ¿Estás seguro de que deseas cerrar sesión?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Cerrar Sesión
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        {children}
      </div>
    </div>
  )
}

export default Layout

const Progress = (): JSX.Element => {
  return (
    <div className='w-full'>
      <div className='h-1.5 w-full bg-muted-foreground overflow-hidden'>
        <div className='w-full h-full progress bg-primary left-right' />
      </div>
    </div>
  )
}

export default Progress

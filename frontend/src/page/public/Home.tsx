import { Footer, Header } from '@/components'
import FloatingButton from '@/components/FloatingButton'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <>
    <Header />
    <div className='min-h-[80vh]'>
        <Outlet />
    </div>
    <Footer />
    <FloatingButton/>
    </>
  )
}

export default Home
import { Footer, Header } from '@/components'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <>
    <Header />
    <div className='min-h-[80vh]'>
        <Outlet />
    </div>
    <Footer />
    </>
  )
}

export default Home
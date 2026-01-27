import { Footer, Header } from '@/components'
import FloatingButton from '@/components/FloatingButton'
import { ScrollToTopButton } from '@/components/ScrollToTopButton'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <>
    <Header />
    <div className='min-h-[80vh]'>
        <Outlet />
    </div>
    <Footer />
    <ScrollToTopButton />
    <FloatingButton/>
    </>
  )
}

export default Home
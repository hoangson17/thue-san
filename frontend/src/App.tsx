import { Route, Routes } from 'react-router-dom'
import { HomePage , Home, Auth, Store, ProductDetail, Tournament, Contact, Court, CourtDetail } from './page/public'
import Google from './page/public/Google'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <div>
        <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<HomePage />} />
          <Route path='/products' element={<Store />} />
          <Route path='/products?category=:category' element={<Store />} />
          <Route path='/products/:id' element={<ProductDetail />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/tournament' element={<Tournament />} />
          <Route path='/courts' element={<Court />} />
          <Route path='/courts/:id' element={<CourtDetail />} />
        </Route>
          <Route path='/login' element={<Auth type="login" />} />
          <Route path='/register' element={<Auth type="register" />} />
          <Route path="/auth/google/callback" element={<Google />} />
        </Routes>
        <Toaster position="top-center" />
      </div>
    </>
  )
}

export default App

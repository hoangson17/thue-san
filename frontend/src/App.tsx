import { Route, Routes } from "react-router-dom";
import {
  HomePage,
  Home,
  Auth,
  Store,
  ProductDetail,
  Tournament,
  Contact,
  Court,
  CourtDetail,
  TournamentDetail,
  Profile,
  Cart,
  OrderCourt,
  RegisterTounament,
  Facebook,
  OrderProducts,
  BookingCourt,
} from "./page/public";
import Google from "./page/public/Google";
import { Toaster } from "sonner";
import AuthMiddleware from "./middlewares/AuthMiddleware";
import AdminMiddleware from "./middlewares/AdminMiddleware";
import Admin from "./page/private/Admin";
import AdminUsers from "./page/private/AdminUsers";
import AdminCourts from "./page/private/AdminCourts";
import AdminTournaments from "./page/private/AdminTournaments";
import Dashboard from "./page/private/Dashboard";
import Support from "./page/private/Support";
import AdminProducts from "./page/private/AdminProducts";
import AdminCategories from "./page/private/AdminCategories";
import AdminPrice from "./page/private/AdminPrice";
import AdminCarosel from "./page/private/AdminCarosel";
import LockedUser from "./page/private/LockedUser";
import CourtTypes from "./page/private/CourtTypes";
import Sport from "./page/private/Sport";
import AdminBooking from "./page/private/AdminBooking";

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<HomePage />} />
            <Route path="/products" element={<Store />} />
            <Route path="/products?category=:category" element={<Store />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/tournaments" element={<Tournament />} />
            <Route path="/tournaments/:id" element={<TournamentDetail />} />
            <Route path="/courts" element={<Court />} />
            <Route path="/courts/:id" element={<CourtDetail />} />
            <Route element={<AuthMiddleware />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/booking-courts" element={<BookingCourt />} />
              <Route path="/order-product" element={<OrderProducts />} />
              <Route
                path="/register-tournament"
                element={<RegisterTounament />}
              />
            </Route>
          </Route>
          <Route path="/login" element={<Auth type="login" />} />
          <Route path="/register" element={<Auth type="register" />} />
          <Route path="/auth/google/callback" element={<Google />} />
          <Route path="/auth/facebook/callback" element={<Facebook />} />
          <Route element={<AuthMiddleware />}>
            <Route element={<AdminMiddleware />}>
              <Route path="/admin" element={<Admin />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users-locked" element={<LockedUser />} />
                <Route path="courts" element={<AdminCourts />} />
                <Route path="support" element={<Support />} />
                <Route path="tournaments" element={<AdminTournaments />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="prices" element={<AdminPrice />} />
                <Route path="carosels" element={<AdminCarosel />} />
                <Route path="profile" element={<Profile />} />
                <Route path="bookings" element={<AdminBooking />} />
                <Route path="court-type" element={<CourtTypes />} />
                <Route path="sports" element={<Sport />} />
              </Route>
            </Route>
          </Route>
        </Routes>
        <Toaster position="top-center" />
      </div>
    </>
  );
}

export default App;

import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminMiddleware = () => {
  const {user} = useSelector((state: any) => state.auth);
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace={true} />
}

export default AdminMiddleware
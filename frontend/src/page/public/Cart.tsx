import { ListCart } from '@/components'
import { getCart } from '@/stores/actions/cartActions';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const Cart = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state: any) => state.cart);

  useEffect(() => {
    dispatch(getCart() as any);
  }, [dispatch]);

  // console.log(cart);

  return (
    <div className='w-full max-w-7xl m-auto md:px-16 py-10'>
      <div className='text-2xl font-semibold'>Giỏ hàng</div>
      <div>
        <ListCart products={cart} />
      </div>
    </div>
  )
}

export default Cart
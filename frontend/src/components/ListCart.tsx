import React from 'react'
import CartItem from './CartItem'

const ListCart = ({products}:any) => {
  return (
    <div>
        {products.map((product:any) => (<CartItem product={product} />))}
    </div>
  )
}

export default ListCart
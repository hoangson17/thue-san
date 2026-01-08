import React from 'react'
import CartItem from './CartItem'

const ListCart = ({ products = [] }: any) => {
  return (
    <div>
      {products.map((cart: any) =>
        cart.items.map((item: any) => (
          <CartItem key={item.id} product={item} />
        ))
      )}
    </div>
  )
}

export default ListCart

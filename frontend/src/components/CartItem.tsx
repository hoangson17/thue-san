import React from 'react'

const CartItem = ({product}: any) => {
  return (
    <div>
        <div>
            <img src={`${import.meta.env.VITE_SERVER_API}${product.images[0].url}`} alt="" />
            <div>
                <p>{product.name}</p>
                <p>{product.price}</p>
                <p>{product.quantity}</p>
            </div>
        </div>
    </div>
  )
}

export default CartItem
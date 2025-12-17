import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const ProductItem = ({ item }: { item: any }) => {
  const images = Array.isArray(item.images) ? item.images : [];

  const [order, setOrder] = React.useState({
    quantity: 1,
    product: item,
    image: images[0],
  });

  const decrease = () => {
    if (order.quantity > 1) {
      setOrder((prev) => ({
        ...prev,
        quantity: prev.quantity - 1,
      }));
    }
  };

  const increase = () => {
    if (order.quantity < item.stock) {
      setOrder((prev) => ({
        ...prev,
        quantity: prev.quantity + 1,
      }));
    }
  };

  const handleAddToCart = () => {
    console.log("Add to cart:", order);
    // dispatch(addToCart(order))
  };

  return (
    <div className="border p-5 rounded-2xl shadow-sm w-full">
      <Link key={item.id} to={`/products/${item.id}`}>
        <div className="text-center">
          <img
            src={`${import.meta.env.VITE_SERVER_API}${images[0]?.url}`}
            alt={item.name}
            className="mx-auto rounded-xl"
            width={150}
          />
          <h1 className="font-semibold text-lg mt-2">{item.name}</h1>
        </div>

        <p className="mt-2 text-gray-700">Giá: {item.price}₫</p>
        <p className="text-gray-500 text-sm">Tồn kho: {item.stock}</p>
      </Link>
      <div className="flex gap-4 justify-center items-center mt-2">
        <button
          onClick={decrease}
          disabled={order.quantity <= 1}
          className="w-8 h-8 flex items-center justify-center border rounded-full cursor-pointer"
        >
          -
        </button>

        <span className="text-lg font-medium w-6 text-center">
          {order.quantity}
        </span>
        <button
          onClick={increase}
          disabled={order.quantity >= item.stock}
          className="w-8 h-8 flex items-center justify-center border rounded-full cursor-pointer"
        >
          +
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-5">
        <Button variant="default" onClick={handleAddToCart}>
          <ShoppingCart />
        </Button>

        <Button variant="secondary">Mua</Button>
      </div>
    </div>
  );
};

export default ProductItem;

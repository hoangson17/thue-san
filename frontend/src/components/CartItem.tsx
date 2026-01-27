import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { CreditCard, Trash2 } from "lucide-react";
import { cartService } from "@/services/cartService";
import { useDispatch } from "react-redux";
import { getCart } from "@/stores/actions/cartActions";
import { toast } from "sonner";
import { set } from "date-fns";

const CartItem = ({ product }: any) => {
  const dispatch = useDispatch();
  const handleDelete = async (id: string) => {
    try {
      await cartService.removeItem(id.toString());
      dispatch(getCart() as any);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (err) {
      toast.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng");
    }
  };
  const handleUpdate = async (id: string, newQty: number) => {
    try {
      await cartService.addToCart({ productId: id, quantity: newQty });
      toast.success("Đã cập nhật giỏ hàng");
      dispatch(getCart() as any);
    } catch (err) {
      toast.error("Lỗi khi cập nhật giỏ hàng");
    }
  };

  return (
    <div className="flex items-center gap-6 border-b py-4 px-4">
      <div className="w-30">
        <img
          src={`${import.meta.env.VITE_SERVER_API}${
            product.product.images[0].url
          }`}
          alt={product.product.name}
          className="w-full aspect-square object-cover"
        />
      </div>
      <div className="flex gap-10 w-full justify-around">
        <div className="font-semibold">{product.product.name}</div>
        <div>Category: {product.product.category}</div>
        <div>Đơn giá: {product.product.price}</div>
        <div>Tổng tiền: ${product.product.price * product.quantity}</div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          disabled={product.quantity === 1}
          onClick={() => {
            handleUpdate(product.product.id, -1);
          }}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition cursor-pointer"
        >
          -
        </Button>
        <div className="w-8 text-center font-medium">{product.quantity}</div>
        <Button
          onClick={() => {
            handleUpdate(product.product.id, 1);
          }}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition cursor-pointer"
        >
          +
        </Button>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => handleDelete(product.product.id)}
          className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white font-medium rounded-md hover:bg-red-800 transition cursor-pointer"
        >
          <Trash2 size={18} />
          Xóa
        </Button>
        {/* <Button className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white font-medium rounded-md hover:bg-green-800 transition cursor-pointer">
          <CreditCard size={18} />
          Thanh toán
        </Button> */}
      </div>
    </div>
  );
};

export default CartItem;

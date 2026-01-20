import React, { useState } from "react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, CreditCard, Icon } from "lucide-react";
import { toast } from "sonner";
import { cartService } from "@/services/cartService";
import { getCart } from "@/stores/actions/cartActions";
import { useDispatch } from "react-redux";
import { orderService } from "@/services/orderService";
import { getProducts } from "@/stores/actions/productActions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { IconCardboards, IconCash, IconCreditCard } from "@tabler/icons-react";

const ProductItem = ({ item }: { item: any }) => {
  const images = Array.isArray(item.images) ? item.images : [];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [order, setOrder] = useState({ quantity: 1 });
  const [loading, setLoading] = useState(false);

  const [openBuyNow, setOpenBuyNow] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "PAYPAL">("COD");

  const decrease = () => {
    if (order.quantity > 1) {
      setOrder((prev) => ({ ...prev, quantity: prev.quantity - 1 }));
    }
  };

  const increase = () => {
    if (order.quantity < item.stock) {
      setOrder((prev) => ({ ...prev, quantity: prev.quantity + 1 }));
    }
  };

  const handleAddToCart = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await cartService.addToCart({
        productId: item.id,
        quantity: order.quantity,
      });
      dispatch(getCart() as any);
      toast.success("Thêm vào giỏ hàng thành công");
    } catch {
      toast.error("Lỗi khi thêm vào giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBuyNow = async () => {
    try {
      await orderService.buyNow({
        productId: item.id,
        quantity: order.quantity,
        paymentMethod,
      });

      toast.success("Tạo đơn hàng thành công");
      setOpenBuyNow(false);
      dispatch(getProducts() as any);
      navigate("/order-product");
    } catch {
      toast.error("Không thể mua ngay");
    }
  };

  return (
    <div className="border p-5 rounded-2xl shadow-sm w-full">
      <Link to={`/products/${item.id}`}>
        <div className="text-center">
          <img
            src={`${import.meta.env.VITE_SERVER_API}${images[0]?.url}`}
            alt={item.name}
            className="mx-auto h-40 object-cover rounded-xl"
          />
          <h1 className="font-semibold text-lg mt-2">{item.name}</h1>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-gray-700">Giá: {item.price.toLocaleString()}₫</p>
          <p className="text-gray-500 text-sm">Tồn kho: {item.stock}</p>
        </div>
      </Link>

      {/* Quantity */}
      <div className="flex gap-4 justify-center items-center mt-3">
        <button
          onClick={decrease}
          disabled={order.quantity <= 1}
          className="w-8 h-8 border rounded-full"
        >
          -
        </button>

        <span className="text-lg font-medium w-6 text-center">
          {order.quantity}
        </span>

        <button
          onClick={increase}
          disabled={order.quantity >= item.stock}
          className="w-8 h-8 border rounded-full"
        >
          +
        </button>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <Button onClick={handleAddToCart} disabled={loading}>
          <ShoppingCart className="mr-1" />
          Giỏ hàng
        </Button>

        <Button
          variant="secondary"
          onClick={() => setOpenBuyNow(true)}
          disabled={item.stock <= 0}
        >
          <CreditCard className="mr-1" />
          Mua ngay
        </Button>
      </div>

      {/* MODAL BUY NOW */}
      <Dialog open={openBuyNow} onOpenChange={setOpenBuyNow}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận mua ngay</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div
              onClick={() => setPaymentMethod("COD")}
              className={`border rounded-lg p-4 cursor-pointer flex items-center ${
                paymentMethod === "COD" ? "border-green-600 bg-green-50" : ""
              }`}
            >
              <IconCash className="mr-2" /> Thanh toán trực tiếp (COD)
            </div>

            <div
              onClick={() => setPaymentMethod("PAYPAL")}
              className={`border rounded-lg p-4 cursor-pointer flex items-center ${
                paymentMethod === "PAYPAL" ? "border-green-600 bg-green-50" : ""
              }`}
            >
              <IconCreditCard className="mr-2" /> Chuyển khoản ngân hàng
            </div>

            <div className="text-right font-semibold">
              Tổng tiền:{" "}
              <span className="text-green-700">
                {(item.price * order.quantity).toLocaleString()}₫
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenBuyNow(false)}>
              Hủy
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-800"
              onClick={handleConfirmBuyNow}
            >
              Xác nhận mua
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductItem;

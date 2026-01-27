import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ShoppingCart, CreditCard, Plus, Minus, Loader2, Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cartService } from "@/services/cartService";
import { orderService } from "@/services/orderService";
import { getCart } from "@/stores/actions/cartActions";
import { IconMoneybagPlus } from "@tabler/icons-react";

const ProductItem = ({ item }: { item: any }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openBuyNow, setOpenBuyNow] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "PAYPAL">("COD");

  const VND = (price: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await cartService.addToCart({ productId: item.id, quantity });
      dispatch(getCart() as any);
      toast.success("Đã thêm vào giỏ hàng");
    } catch {
      toast.error("Lỗi hệ thống");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group bg-white rounded-3xl p-4 transition-all duration-300 hover:shadow-xl border border-gray-100">
      <Link to={`/products/${item.id}`} className="space-y-3">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
          <img
            src={`${import.meta.env.VITE_SERVER_API}${item.images?.[0]?.url}`}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 line-clamp-1 group-hover:text-gray-600 transition-colors">{item.name}</h3>
          <div className="flex justify-between items-baseline mt-1">
            <span className="text-lg font-bold text-gray-900">{VND(item.price)}</span>
            <span className="text-xs text-gray-400">Kho: {item.stock}</span>
          </div>
        </div>
      </Link>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-1">
          <button 
            onClick={() => quantity > 1 && setQuantity(q => q - 1)}
            className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-30"
            disabled={quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <span className="font-semibold text-sm">{quantity}</span>
          <button 
            onClick={() => quantity < item.stock && setQuantity(q => q + 1)}
            className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-30"
            disabled={quantity >= item.stock}
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50"
            onClick={handleAddToCart}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <ShoppingCart size={18} />}
          </Button>
          <Button 
            className="flex-[2] rounded-xl bg-gray-600 hover:bg-gray-700 shadow-md shadow-gray-100"
            onClick={() => setOpenBuyNow(true)}
            disabled={item.stock <= 0}
          >
            Mua ngay
          </Button>
        </div>
      </div>

      <Dialog open={openBuyNow} onOpenChange={setOpenBuyNow}>
        <DialogContent className="sm:max-w-[380px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Thanh toán</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            {[
              { id: "COD", label: "Tiền mặt (COD)", icon: <IconMoneybagPlus size={20} /> },
              { id: "PAYPAL", label: "Thẻ / Online", icon: <CreditCard size={20} /> }
            ].map((method) => (
              <div
                key={method.id}
                onClick={() => setPaymentMethod(method.id as any)}
                className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                  paymentMethod === method.id ? "border-gray-600 bg-gray-50/50" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{method.icon}</span>
                  <span className="font-medium text-sm">{method.label}</span>
                </div>
                {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-gray-600" />}
              </div>
            ))}
            
            <div className="flex justify-between items-center px-2 pt-4 border-t">
              <span className="text-gray-500 text-sm">Tổng cộng</span>
              <span className="text-xl font-bold text-gray-600">{VND(item.price * quantity)}</span>
            </div>
          </div>

          <DialogFooter className="sm:justify-center">
            <Button 
              className="w-full rounded-xl bg-gray-600 h-12 text-md font-semibold"
              onClick={() => { /* Logic handleConfirmBuyNow */ }}
            >
              Xác nhận đơn hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductItem;
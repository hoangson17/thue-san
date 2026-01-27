import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "@/stores/actions/cartActions";
import ListCart from "@/components/ListCart";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowLeft, Trash2, ShieldCheck, ShoppingCart } from "lucide-react";
import { orderService } from "@/services/orderService";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { IconCash, IconCreditCard } from "@tabler/icons-react";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, isLoading } = useSelector((state: any) => state.cart);

  const [openCheckout, setOpenCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "PAYPAL">("COD");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getCart() as any);
  }, [dispatch]);

  const cartItems = useMemo(() => cart?.[0]?.items || [], [cart]);

  const total = useMemo(() => {
    return cartItems.reduce(
      (sum: number, item: any) => sum + (item.product?.price || 0) * item.quantity,
      0
    );
  }, [cartItems]);

  const handleConfirmCheckout = async () => {
    setLoading(true);
    try {
      await orderService.checkout(paymentMethod);
      toast.success("Đặt hàng thành công!");
      setOpenCheckout(false);
      navigate("/order-product");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Thanh toán thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoading && cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="bg-gray-100 p-6 rounded-full">
          <ShoppingCart className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold">Giỏ hàng trống</h2>
        <p className="text-gray-500">Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
        <Button asChild className="mt-2">
          <Link to="/products">Mua sắm ngay</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Giỏ hàng của bạn</h1>
          <span className="text-gray-500 font-normal ml-2">({cartItems.length} sản phẩm)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <ListCart products={cart} />
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500 px-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              Thanh toán an toàn và bảo mật 100%
            </div>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-3 text-sm border-b pb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Tạm tính</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phí vận chuyển</span>
                <span className="text-green-600 font-medium">Miễn phí</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4">
              <span className="text-base font-semibold">Tổng cộng</span>
              <span className="text-2xl font-bold text-green-700">
                ${total.toFixed(2)}
              </span>
            </div>

            <Button
              onClick={() => setOpenCheckout(true)}
              className="w-full py-6 text-base font-semibold bg-green-700 hover:bg-green-800 shadow-lg shadow-green-100 transition-all active:scale-[0.98]"
            >
              Tiến hành thanh toán
            </Button>

            <div className="mt-4">
               <Link to="/products" className="text-sm text-gray-500 hover:text-green-700 flex items-center justify-center gap-2">
                  Tiếp tục mua hàng
               </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CHỌN PHƯƠNG THỨC THANH TOÁN */}
      <Dialog open={openCheckout} onOpenChange={setOpenCheckout}>
        <DialogContent className="sm:max-w-[450px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Chọn phương thức thanh toán</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 py-4">
            <PaymentOption
              active={paymentMethod === "COD"}
              onClick={() => setPaymentMethod("COD")}
              icon={<IconCash size={24} className="text-blue-600" />}
              title="Thanh toán khi nhận hàng"
              description="Thanh toán bằng tiền mặt khi giao hàng"
            />
            
            <PaymentOption
              active={paymentMethod === "PAYPAL"}
              onClick={() => setPaymentMethod("PAYPAL")}
              icon={<IconCreditCard size={24} className="text-orange-500" />}
              title="Thanh toán trực tuyến"
              description="Hỗ trợ PayPal và Thẻ tín dụng"
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="ghost" onClick={() => setOpenCheckout(false)} className="flex-1">
              Hủy
            </Button>
            <Button 
              onClick={handleConfirmCheckout} 
              className="bg-green-700 hover:bg-green-800 flex-1"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Sub-component cho lựa chọn thanh toán để code sạch hơn
const PaymentOption = ({ active, onClick, icon, title, description }: any) => (
  <div
    onClick={onClick}
    className={`flex items-start gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
      active ? "border-green-600 bg-green-50/50 shadow-sm" : "border-gray-100 hover:border-gray-200"
    }`}
  >
    <div className={`p-2 rounded-lg ${active ? "bg-white shadow-sm" : "bg-gray-100"}`}>
      {icon}
    </div>
    <div className="flex-1">
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? "border-green-600" : "border-gray-300"}`}>
      {active && <div className="w-2.5 h-2.5 bg-green-600 rounded-full" />}
    </div>
  </div>
);

export default Cart;
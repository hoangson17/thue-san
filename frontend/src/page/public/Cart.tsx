import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "@/stores/actions/cartActions";
import ListCart from "@/components/ListCart";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { orderService } from "@/services/orderService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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

  const { cart } = useSelector((state: any) => state.cart);

  const [openCheckout, setOpenCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "PAYPAL">("COD");

  useEffect(() => {
    dispatch(getCart() as any);
  }, [dispatch]);

  const total = useMemo(() => {
    if (!cart?.length) return 0;
    return cart[0].items.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0,
    );
  }, [cart]);

  const handleConfirmCheckout = async () => {
    try {
      await orderService.checkout(paymentMethod);

      toast.success("Đặt hàng thành công");
      setOpenCheckout(false);
      navigate("/order-product");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Thanh toán thất bại");
    }
  };

  return (
    <div className="w-full max-w-7xl m-auto px-10 py-10">
      <h1 className="text-2xl font-semibold mb-6">Giỏ hàng</h1>

      <ListCart products={cart} />

      {/* Tổng tiền */}
      <div className="flex justify-between items-center mt-8 border-t pt-6">
        <div className="text-xl font-semibold">
          Tổng thanh toán:{" "}
          <span className="text-green-700">${total.toFixed(2)}</span>
        </div>

        <Button
          onClick={() => setOpenCheckout(true)}
          disabled={!cart?.length}
          className="bg-green-700 hover:bg-green-800 flex gap-2"
        >
          <CreditCard size={18} />
          Thanh toán toàn bộ
        </Button>
      </div>

      {/* MODAL THANH TOÁN */}
      <Dialog open={openCheckout} onOpenChange={setOpenCheckout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận thanh toán</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* COD */}
            <div
              onClick={() => setPaymentMethod("COD")}
              className={`border rounded-lg p-4 cursor-pointer${
                paymentMethod === "COD" ? "border-green-600 bg-green-50" : ""
              }`}
            >
              <p className="font-medium flex items-center">
                <IconCash className="mr-2" /> Thanh toán trực tiếp (COD)
              </p>
            </div>

            {/* PAYPAL */}
            <div
              onClick={() => setPaymentMethod("PAYPAL")}
              className={`border rounded-lg p-4 cursor-pointer ${
                paymentMethod === "PAYPAL" ? "border-green-600 bg-green-50" : ""
              }`}
            >
              <p className="font-medium flex items-center">
                <IconCreditCard className="mr-2" /> Chuyển khoản ngân hàng
              </p>
            </div>

            <div className="text-right font-semibold">
              Tổng tiền:{" "}
              <span className="text-green-700">${total.toFixed(2)}</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCheckout(false)}>
              Hủy
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-800"
              onClick={handleConfirmCheckout}
            >
              Xác nhận thanh toán
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;

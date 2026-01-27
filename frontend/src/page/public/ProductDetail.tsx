import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, CreditCard, Minus, Plus, ChevronLeft, Check } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import { cartService } from "@/services/cartService";
import { orderService } from "@/services/orderService";
import { getCart } from "@/stores/actions/cartActions";
import { getProductDetail } from "@/stores/actions/productActions";

const ProductDetail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productDetail } = useSelector((state: any) => state.products);
  const id = location.pathname.split("/")[2];

  const [quantity, setQuantity] = useState(1);
  const [openBuyNow, setOpenBuyNow] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "PAYPAL">("COD");

  useEffect(() => {
    dispatch(getProductDetail(id) as any);
  }, [dispatch, id]);

  const VND = (amount: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const handleAddToCart = async () => {
    try {
      await cartService.addToCart({ productId: Number(id), quantity });
      toast.success("Đã thêm vào giỏ hàng");
      dispatch(getCart() as any);
    } catch {
      toast.error("Lỗi khi thêm sản phẩm");
    }
  };

  const handleConfirmBuyNow = async () => {
    try {
      await orderService.buyNow({ productId: Number(id), quantity, paymentMethod });
      toast.success("Đặt hàng thành công");
      setOpenBuyNow(false);
      navigate("/order-product");
    } catch {
      toast.error("Giao dịch thất bại");
    }
  };

  if (!productDetail) return <div className="h-screen flex items-center justify-center">Đang tải...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Nút quay lại */}
      <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-500 hover:text-black mb-8 transition-colors">
        <ChevronLeft size={16} /> Quay lại cửa hàng
      </button>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* BÊN TRÁI: CAROUSEL HÌNH ẢNH */}
        <div className="space-y-4">
          <Carousel className="w-full">
            <CarouselContent>
              {productDetail.images?.map((image: any, index: number) => (
                <CarouselItem key={index}>
                  <div className="aspect-[4/3] overflow-hidden rounded-3xl border bg-gray-50">
                    <img
                      src={`${import.meta.env.VITE_SERVER_API}${image.url}`}
                      alt={productDetail.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </div>
          </Carousel>
        </div>

        {/* BÊN PHẢI: THÔNG TIN SẢN PHẨM */}
        <div className="flex flex-col space-y-6">
          <div className="space-y-2">
            <Badge variant="secondary" className="bg-gray-50 text-gray-600 hover:bg-gray-50 border-none px-3 py-1">
              {productDetail.category?.name}
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{productDetail.name}</h1>
            <p className="text-3xl font-medium text-gray-600">{VND(productDetail.price)}</p>
          </div>

          <div className="py-4 border-t border-b">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">Mô tả sản phẩm</h3>
            <p className="text-gray-600 leading-relaxed italic">"{productDetail.description}"</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Số lượng:</span>
              <div className="flex items-center border rounded-full px-2 py-1 bg-gray-50">
                <button 
                  onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                  className="p-1 hover:bg-white rounded-full transition-all"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-semibold">{quantity}</span>
                <button 
                  onClick={() => quantity < productDetail.stock && setQuantity(q => q + 1)}
                  className="p-1 hover:bg-white rounded-full transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="text-sm text-gray-400">({productDetail.stock} sản phẩm có sẵn)</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 h-14 rounded-2xl border-2 hover:bg-gray-50 transition-all"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Thêm giỏ hàng
              </Button>
              <Button 
                size="lg" 
                className="flex-1 h-14 rounded-2xl bg-gray-600 hover:bg-gray-700 shadow-lg shadow-gray-100 transition-all"
                onClick={() => setOpenBuyNow(true)}
                disabled={productDetail.stock <= 0}
              >
                Mua ngay
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL THANH TOÁN GỌN GÀNG */}
      <Dialog open={openBuyNow} onOpenChange={setOpenBuyNow}>
        <DialogContent className="sm:max-w-[400px] rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Thanh toán nhanh</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {[
              { id: "COD", label: "Tiền mặt khi nhận hàng", sub: "Thanh toán trực tiếp cho shipper" },
              { id: "PAYPAL", label: "Chuyển khoản / PayPal", sub: "Giao dịch an toàn, bảo mật" }
            ].map((method) => (
              <div
                key={method.id}
                onClick={() => setPaymentMethod(method.id as any)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === method.id ? "border-gray-600 bg-gray-50/50" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div>
                  <p className="font-semibold text-sm text-gray-900">{method.label}</p>
                  <p className="text-xs text-gray-500">{method.sub}</p>
                </div>
                {paymentMethod === method.id && <div className="bg-gray-600 rounded-full p-1"><Check size={12} className="text-white" /></div>}
              </div>
            ))}

            <div className="mt-6 p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
              <span className="text-gray-600 font-medium">Tổng thanh toán:</span>
              <span className="text-xl font-bold text-gray-600">{VND(productDetail.price * quantity)}</span>
            </div>
          </div>

          <DialogFooter>
            <Button className="w-full h-12 rounded-xl bg-gray-600" onClick={handleConfirmBuyNow}>
              Xác nhận đơn hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetail;
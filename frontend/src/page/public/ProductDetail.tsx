import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cartService } from "@/services/cartService";
import { orderService } from "@/services/orderService";
import { getCart } from "@/stores/actions/cartActions";
import { getProductDetail } from "@/stores/actions/productActions";
import { IconCash, IconCreditCard } from "@tabler/icons-react";
import { CreditCard, ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProductDetail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { productDetail } = useSelector((state: any) => state.products);
  const id = location.pathname.split("/")[2];

  const [quantity, setQuantity] = useState(1);
  const [openBuyNow, setOpenBuyNow] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "PAPAL">("COD");

  useEffect(() => {
    dispatch(getProductDetail(id) as any);
  }, [dispatch, id]);

  const images = productDetail?.images ?? [];

  const handleAddToCart = async () => {
    try {
      await cartService.addToCart({
        productId: Number(id),
        quantity,
      });
      toast.success("Thêm vào giỏ hàng thành công");
      dispatch(getCart() as any);
    } catch {
      toast.error("Lỗi khi thêm vào giỏ hàng");
    }
  };

  const handleConfirmBuyNow = async () => {
    try {
      await orderService.buyNow({
        productId: Number(id),
        quantity,
        paymentMethod,
      });

      toast.success("Mua hàng thành công");
      setOpenBuyNow(false);
      dispatch(getProductDetail(id) as any);
      navigate("/order-product");
    } catch {
      toast.error("Không thể mua ngay");
    }
  };

  return (
    <div className="px-16 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{productDetail?.name}</h1>

      <div className="mt-3 flex flex-col lg:flex-row gap-6">
        {/* IMAGES */}
        <div className="w-full md:w-8/12 aspect-video">
          <Carousel className="aspect-video">
            <CarouselContent>
              {images.map((image: any, index: number) => (
                <CarouselItem key={index}>
                  <div className="p-1 h-full w-full">
                    <div className="w-full h-full overflow-hidden rounded-2xl shadow-md border">
                      <img
                        src={`${import.meta.env.VITE_SERVER_API}${image.url}`}
                        alt={`image-${index}`}
                        className="w-full h-full object-cover aspect-video"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>

        {/* INFO */}
        <div className="w-full md:w-4/12">
          <Card className="rounded-2xl border-none shadow-none h-full">
            <CardContent className="px-8 py-2 space-y-3">
              <div className="border-b pb-2">
                <p className="text-2xl font-semibold">{productDetail?.name}</p>
                <p className="text-sm text-muted-foreground bg-gray-100 inline-block px-3 py-1 rounded-full">
                  {productDetail?.category?.name}
                </p>
              </div>

              <p className="text-3xl font-bold text-gray-400">
                {productDetail?.price?.toLocaleString()}₫
              </p>

              <p>{productDetail?.description}</p>

              <p
                className={`font-medium ${
                  productDetail?.stock > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {productDetail?.stock > 0
                  ? `Còn ${productDetail.stock} sản phẩm`
                  : "Hết hàng"}
              </p>

              <div className="flex flex-col md:flex-row gap-3 pt-3">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="px-6 text-lg"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Thêm về giỏ hàng
                </Button>

                <Button
                  onClick={() => setOpenBuyNow(true)}
                  disabled={productDetail?.stock <= 0}
                  className="px-6 text-lg"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Mua ngay
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
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
              onClick={() => setPaymentMethod("PAPAL")}
              className={`border rounded-lg p-4 cursor-pointer flex items-center ${
                paymentMethod === "PAPAL" ? "border-green-600 bg-green-50" : ""
              }`}
            >
              <IconCreditCard className="mr-2" /> Chuyển khoản ngân hàng
            </div>

            <div className="text-right font-semibold">
              Tổng tiền:{" "}
              <span className="text-green-700">
                {(productDetail?.price * quantity).toLocaleString()}₫
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

export default ProductDetail;

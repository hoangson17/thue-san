import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cartService } from "@/services/cartService";
import { getCart } from "@/stores/actions/cartActions";
import { getProductDetail } from "@/stores/actions/productActions";
import { CreditCard, ShoppingCart } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

const ProductDetail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { productDetail } = useSelector((state: any) => state.products);
  const id = location.pathname.split("/")[2];
  const [quantity, setQuantity] = React.useState(1);
  

  useEffect(() => {
    dispatch(getProductDetail(id) as any);
  }, [dispatch, id]);

  const images = productDetail?.images ?? [];

  // console.log(productDetail);
  
  const handleAddToCart = async (id: string) => {
    try {
      await cartService.addToCart({ productId: id, quantity });
      toast.success("Thêm vào giỏ hàng thành công");
      dispatch(getCart() as any);
    } catch (error) {
      toast.error("Lỗi khi thêm vào giỏ hàng");
    }
  };

  return (
    <div className="px-16 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{productDetail?.name}</h1>
      <div className="mt-3 flex flex-col lg:flex-row gap-6">
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

        <div className="w-full md:w-4/12">
          <Card className="rounded-2xl border-none shadow-none h-full">
            <CardContent className="px-8 py-2 space-y-2">
              <div className="border-b-2 border-gray-300 pb-2">
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
                <Button onClick={() => {handleAddToCart(id)}} variant="outline" className="px-6 text-lg">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Thêm về giỏ hàng
                </Button>
                <Button className="px-6 text-lg"><CreditCard className="mr-2 h-4 w-4" /> Mua ngay </Button>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

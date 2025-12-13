import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getProductDetail } from "@/stores/actions/productActions";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const ProductDetail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { productDetail } = useSelector((state: any) => state.products);
  const id = location.pathname.split("/")[2];

  useEffect(() => {
    dispatch(getProductDetail(id) as any);
  }, [dispatch, id]);

  const images = productDetail?.images ?? [];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{productDetail?.name}</h1>
      <div className="mt-3 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/6 aspect-square">
          <Carousel>
            <CarouselContent>
              {images.map((image: any, index: number) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <div className="w-full aspect-square overflow-hidden rounded-2xl shadow-md border">
                      <img
                        src={`${import.meta.env.VITE_SERVER_API}${image.url}`}
                        alt={`image-${index}`}
                        className="w-full h-full object-cover"
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
        <div className="w-full">
          <Card className="rounded-2xl shadow-sm h-full">
            <CardContent className="p-6 space-y-5">
              <p className="text-2xl font-semibold">{productDetail?.name}</p>
              <p className="text-sm text-muted-foreground bg-gray-100 inline-block px-3 py-1 rounded-full">
                {productDetail?.category}
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {productDetail?.price?.toLocaleString()}₫
              </p>
                <p>
                    {productDetail?.description}
                </p>
              <p
                className={`font-medium ${
                  productDetail?.stock > 0
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {productDetail?.stock > 0
                  ? `Còn ${productDetail.stock} sản phẩm`
                  : "Hết hàng"}
              </p>
              <div className="flex gap-3 pt-3">
                <Button className="px-6 text-lg">Buy Now</Button>
                <Button variant="outline" className="px-6 text-lg">
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useDispatch, useSelector } from "react-redux";
import { getCarosel } from "@/stores/actions/caroselActions";
import type { CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Carosel = () => {
  const dispatch = useDispatch();
  const { carosels } = useSelector((state: any) => state.carosels);

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    dispatch(getCarosel() as any);
  }, [dispatch]);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 2500,
            stopOnInteraction: false,
          }),
        ]}
        setApi={setApi}
      >
        <CarouselContent>
          {Array.isArray(carosels) &&
            carosels.map((item: any) => (
              <CarouselItem key={item.id} className="md:h-[100vh] ">
                <img
                  src={`${import.meta.env.VITE_SERVER_API}${item.url}`}
                  alt={item.description}
                  className="w-full h-full object-cover"
                />
              </CarouselItem>
            ))}
        </CarouselContent>

        <CarouselPrevious className="left-3" />
        <CarouselNext className="right-3" />
      </Carousel>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-3 w-3 rounded-full transition-all ${
              current === index ? "bg-white scale-110" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carosel;

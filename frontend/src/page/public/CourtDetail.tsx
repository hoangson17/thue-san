import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDetailCourt } from "@/stores/actions/courtActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon, Phone } from "lucide-react";
import getDayType from "@/utils/isWeekend";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const CourtDetail = () => {
  const dispatch = useDispatch();
  const { court, loading } = useSelector((state: any) => state.courts);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const id = window.location.pathname.split("/")[2];

  useEffect(() => {
    dispatch(getDetailCourt(id) as any);
  }, [dispatch, id]);

  const dayType = getDayType(date);

  const filteredPricings = React.useMemo(() => {
    if (!dayType) return [];
    return court?.court_pricings?.filter(
      (item: any) => item.dayType === dayType
    ).reverse();
  }, [court, dayType]);
  

  // console.log(court);

  if (loading)
    return (
      <div className="px-10 py-24 flex justify-center">
        <div className="continuous-3" />
      </div>
    );

  if (!court) return <div className="px-10 py-24">Không tìm thấy sân</div>;

  return (
    <div className="px-6 md:px-16 py-14 max-w-7xl mx-auto space-y-10">
      <motion.div {...fadeUp} className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{court.name}</h1>
        <div className="flex flex-wrap gap-2">
          <Badge>{court.court_type?.sport_id?.name}</Badge>
          <Badge variant="outline">{court.court_type?.name}</Badge>
        </div>
        {court.note && (
          <p className="text-muted-foreground max-w-3xl">{court.note}</p>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {court.images?.length > 0 && (
            <motion.div {...fadeUp}>
              <Card className="overflow-hidden rounded-2xl shadow-lg">
                <CardContent className="p-0">
                  <Carousel>
                    <CarouselContent>
                      {court.images.map((img: any) => (
                        <CarouselItem key={img.id} className="h-[460px]">
                          <img
                            src={`${import.meta.env.VITE_SERVER_API}${img.url}`}
                            alt={court.name}
                            className="w-full h-full object-cover"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </Carousel>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
        <div className="space-y-6">
          {/* <motion.div {...fadeUp}>
            <Card className="rounded-2xl shadow-md sticky top-24">
              <CardHeader>
                <CardTitle>Đặt sân nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button size="lg" className="w-full">
                  Đặt sân ngay
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Phone className="w-4 h-4" /> Liên hệ chủ sân
                </Button>
              </CardContent>
            </Card>
          </motion.div> */}

          <motion.div {...fadeUp}>
            <Card className="rounded-2xl">
              <CardContent className="space-y-3">
                <Label>Ngày chơi</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {date ? date.toLocaleDateString() : "Chọn ngày"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => {
                        setDate(d);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...fadeUp}>
            <Card className="rounded-2xl gap-1">
              <CardHeader>
                <CardTitle className="text-sm">Bảng giá</CardTitle>
              </CardHeader>
              <CardContent>
                {!date && (
                  <p className="text-sm text-muted-foreground">
                    Vui lòng chọn ngày để xem giá
                  </p>
                )}

                {date && filteredPricings.length > 0 && (
                  <div>
                    <div className="gap-2 grid grid-cols-3">
                      {filteredPricings.map((item: any) => (
                        <button
                          key={item.id}
                          className="
                          rounded-lg border text-sm
                          flex flex-col items-center justify-between
                          py-2 hover:bg-muted transition
                        "
                        >
                          <span className="font-medium">
                            {item.timeStart} - {item.timeEnd}
                          </span>

                          <span className="font-semibold">
                            {item.price_per_hour.toLocaleString()}đ
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="mt-3">
                      <Button size="lg" className="w-full">
                        Đặt sân ngay
                      </Button>
                    </div>
                  </div>
                )}

                {date && filteredPricings.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Không có giá cho ngày đã chọn
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
          <motion.div {...fadeUp}>
            <Card className="rounded-2xl">
              <CardContent>
                <Button variant="outline" className="w-full gap-2">
                  <Phone className="w-4 h-4" /> Liên hệ chủ sân
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <div>
        {" "}
        <motion.div {...fadeUp}>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Mô tả sân</CardTitle>
            </CardHeader>
            <CardContent>
              {court.description ? (
                // <p className="leading-relaxed text-sm">{court.description}</p>
                <div
                  className="
                    text-sm leading-relaxed space-y-2
                    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4
                    [&_h4]:text-base [&_h4]:font-semibold [&_h4]:mt-3
                    [&_ul]:list-disc [&_ul]:pl-5
                    [&_li]:mb-1
                  "
                  dangerouslySetInnerHTML={{
                    __html: court.description,
                  }}
                />
              ) : (
                <p className="text-muted-foreground">Chưa có mô tả chi tiết</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CourtDetail;

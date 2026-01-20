import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDetailCourt } from "@/stores/actions/courtActions";
import {
  getBookings,
} from "@/stores/actions/bookingActions";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { bookingService } from "@/services/bookingService";


const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const timeToMinutes = (time?: string) => {
  if (!time) return 0;
  const [h, m] = time
    .trim()
    .replace(/\r?\n/g, "")
    .split(":")
    .slice(0, 2)
    .map(Number);
  return h * 60 + m;
};


const CourtDetail = () => {
  const dispatch = useDispatch();
  const { court, loading } = useSelector((state: any) => state.courts);
  const { bookings } = useSelector((state: any) => state.bookings);
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  const [selectedPricing, setSelectedPricing] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>();

  const id = window.location.pathname.split("/")[2];
  const canBooking = isAuthenticated && !!date && selectedPricing !== null;

  useEffect(() => {
    dispatch(getDetailCourt(id) as any);
    dispatch(getBookings() as any);
  }, [dispatch, id]);

  const dayType = getDayType(date);

  const filteredPricings = useMemo(() => {
    if (!dayType || !court?.court_pricings) return [];
    return [...court.court_pricings]
      .filter((p: any) => p.dayType === dayType)
      .reverse();
  }, [court, dayType]);

  const selectedPricingData = useMemo(() => {
    if (!selectedPricing) return null;
    return filteredPricings.find((p: any) => p.id === selectedPricing);
  }, [selectedPricing, filteredPricings]);

  const bookedSlots = useMemo(() => {
    if (!date || !bookings || !court) return [];
    const selectedDate = date.toLocaleDateString("en-CA");
    return bookings.filter(
      (b: any) =>
        b.court?.id === court.id &&
        b.date === selectedDate &&
        b.status !== "cancel"
    );
  }, [bookings, date, court]);

  const isTimeBooked = (pricing: any) => {
    const ps = timeToMinutes(pricing.timeStart);
    const pe = timeToMinutes(pricing.timeEnd);

    return bookedSlots.some((b: any) => {
      const bs = timeToMinutes(b.time_start);
      const be = timeToMinutes(b.time_end);
      return ps < be && pe > bs;
    });
  };

  const handleBooking = async () => {
    if (!selectedPricingData || !date) return;

    const payload = {
      court_id: court.id,
      date: date.toLocaleDateString("en-CA"),
      time_start: `${selectedPricingData.timeStart}`,
      time_end: `${selectedPricingData.timeEnd}`,
      total_price: selectedPricingData.price_per_hour,
    };

    try {
      await bookingService.create((payload) as any);
      toast.success("Đặt sân thành công");
      setSelectedPricing(null);
      dispatch(getBookings() as any);
    } catch {
      toast.error("Khung giờ đã được đặt");
    }
  };

  if (loading) {
    return (
      <div className="px-10 py-24 flex justify-center">
        <div className="continuous-3" />
      </div>
    );
  }

  if (!court) return <div className="px-10 py-24">Không tìm thấy sân</div>;

  return (
    <div className="px-6 md:px-16 py-10 max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <motion.div {...fadeUp} className="space-y-2">
        <h1 className="text-4xl font-bold">{court.name}</h1>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2">
            <Badge>{court.court_type?.sport_id?.name}</Badge>
            <Badge variant="outline">{court.court_type?.name}</Badge>
          </div>
          {court.note && (
            <p className="text-muted-foreground">{court.note}</p>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Images */}
        <div className="lg:col-span-2">
          {court.images?.length > 0 && (
            <Card className="overflow-hidden rounded-2xl">
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
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking */}
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-3">
              <Label>Ngày chơi</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {date ? date.toLocaleDateString() : "Chọn ngày"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                      setDate(d);
                      setSelectedPricing(null);
                      setOpen(false);
                    }}
                    disabled={(d) =>
                      d < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Bảng giá</CardTitle>
            </CardHeader>
            <CardContent>
              {!date && (
                <p className="text-sm text-muted-foreground">
                  Vui lòng chọn ngày
                </p>
              )}

              {date && filteredPricings.length > 0 && (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {filteredPricings.map((item: any) => {
                      const booked = isTimeBooked(item);
                      return (
                        <button
                          key={item.id}
                          disabled={booked}
                          onClick={() =>
                            !booked &&
                            setSelectedPricing(
                              selectedPricing === item.id ? null : item.id
                            )
                          }
                          className={cn(
                            "rounded-lg border text-sm py-2 flex flex-col items-center transition",
                            booked
                              ? "bg-muted opacity-50 cursor-not-allowed"
                              : selectedPricing === item.id
                              ? "border-primary bg-primary/10"
                              : "hover:bg-muted"
                          )}
                        >
                          <span className="font-medium">
                            {item.timeStart} - {item.timeEnd}
                          </span>
                          <span className="font-semibold">
                            {item.price_per_hour.toLocaleString()}đ
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    className="w-full mt-3"
                    disabled={!canBooking}
                    onClick={handleBooking}
                  >
                    {!isAuthenticated
                      ? "Đăng nhập để đặt sân"
                      : !selectedPricing
                      ? "Chọn khung giờ"
                      : "Đặt sân ngay"}
                  </Button>
                </>
              )}

              {date && filteredPricings.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Không có giá cho ngày đã chọn
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Button variant="outline" className="w-full gap-2">
                <Phone className="w-4 h-4" /> Liên hệ chủ sân
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardContent>
          <h3 className="text-xl font-bold mb-4">Mô tả chi tiết</h3>
          {court.description ? (
            <div
              className="text-sm leading-relaxed space-y-2
                [&_h1]:text-2xl [&_h1]:font-bold
                [&_h2]:text-xl [&_h2]:font-semibold
                [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: court.description }}
            />
          ) : (
            <p className="text-muted-foreground">Chưa có mô tả</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourtDetail;

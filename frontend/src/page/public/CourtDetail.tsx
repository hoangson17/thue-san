import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDetailCourt } from "@/stores/actions/courtActions";
import { getBookings } from "@/stores/actions/bookingActions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon, Phone, MapPin, Info, CalendarDays, Zap, Star, ShieldCheck, Users } from "lucide-react";
import getDayType from "@/utils/isWeekend";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { bookingService } from "@/services/bookingService";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

const timeToMinutes = (time?: string) => {
  if (!time) return 0;
  const [h, m] = time.trim().replace(/\r?\n/g, "").split(":").slice(0, 2).map(Number);
  return h * 60 + m;
};

const CourtDetail = () => {
  const dispatch = useDispatch();
  const { court, loading } = useSelector((state: any) => state.courts);
  const { bookings } = useSelector((state: any) => state.bookings);
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  const [selectedPricing, setSelectedPricing] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

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
      .sort((a, b) => timeToMinutes(a.timeStart) - timeToMinutes(b.timeStart));
  }, [court, dayType]);

  const selectedPricingData = useMemo(() => {
    return filteredPricings.find((p: any) => p.id === selectedPricing) || null;
  }, [selectedPricing, filteredPricings]);

  const bookedSlots = useMemo(() => {
    if (!date || !bookings || !court) return [];
    const selectedDate = format(date, "yyyy-MM-dd");
    return bookings.filter(
      (b: any) => b.court?.id === court.id && b.date === selectedDate && b.status !== "cancel"
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
    try {
      const payload = {
        court_id: court.id,
        date: format(date, "yyyy-MM-dd"),
        time_start: selectedPricingData.timeStart,
        time_end: selectedPricingData.timeEnd,
        total_price: selectedPricingData.price_per_hour,
      };
      await bookingService.create(payload as any);
      toast.success("Đặt sân thành công! Chúc bạn chơi vui vẻ.");
      setSelectedPricing(null);
      dispatch(getBookings() as any);
    } catch {
      toast.error("Khung giờ này vừa có người nhanh tay hơn rồi!");
    }
  };

  if (loading) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground animate-pulse font-medium">Đang tải sân siêu phẩm...</p>
    </div>
  );

  if (!court) return <div className="px-10 py-24 text-center">Không tìm thấy sân</div>;

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 space-y-8">
        
        <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b pb-8">
          <div className="flex gap-2">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-none">
              {court.name}
            </h1>
            <div className="">
              <Badge className="bg-orange-500 hover:bg-orange-600 border-none px-3 py-1">
                <Zap className="w-3 h-3 mr-1 fill-current" /> {court.court_type?.sport_id?.name || "Sport"}
              </Badge>
            </div>
            
            

           
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-green-600 dark:text-green-400 font-bold text-sm uppercase tracking-wider">Đang hoạt động</span>
            </div>  
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
              <div className="relative group">
                <Carousel className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-none border-[6px] border-white dark:border-slate-900">
                  <CarouselContent>
                    {court.images?.map((img: any) => (
                      <CarouselItem key={img.id}>
                        <div className="aspect-[16/10] relative">
                          <img
                            src={`${import.meta.env.VITE_SERVER_API}${img.url}`}
                            alt={court.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-6 h-12 w-12 bg-white/20 hover:bg-white/40 border-none text-white backdrop-blur-md" />
                  <CarouselNext className="right-6 h-12 w-12 bg-white/20 hover:bg-white/40 border-none text-white backdrop-blur-md" />
                </Carousel>
                <Badge className="absolute top-8 right-8 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md px-4 py-2 rounded-full border-none shadow-xl">
                   {court.images?.length || 0} Hình ảnh
                </Badge>
              </div>
            </motion.div>

            <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none rounded-3xl overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50 px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Mô tả chi tiết</CardTitle>
                    <CardDescription>Thông tin về cơ sở vật chất và quy định</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {court.description ? (
                  <div
                    className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed
                    [&_strong]:text-slate-900 dark:[&_strong]:text-white [&_ul]:space-y-2"
                    dangerouslySetInnerHTML={{ __html: court.description }}
                  />
                ) : (
                  <div className="flex flex-col items-center py-10 text-muted-foreground">
                     <Info className="w-12 h-12 mb-2 opacity-20" />
                     <p>Đang cập nhật nội dung mô tả...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 relative">
            <div className="sticky top-24 space-y-6">
              <Card className="border-none shadow-2xl shadow-primary/10 rounded-[2.5rem] overflow-hidden">
                <div className="bg-primary p-8 text-primary-foreground">
                  <h3 className="text-2xl font-black uppercase italic leading-none mb-2">Đặt lịch ngay</h3>
                  <p className="text-primary-foreground/70 text-sm">Nhanh chóng - Tiết kiệm - Uy tín</p>
                </div>
                
                <CardContent className="p-6 space-y-6 bg-white dark:bg-slate-900">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">01. Chọn ngày</Label>
                      {date && <Badge variant="secondary" className="text-[10px] rounded-sm">{format(date, "MMM yyyy")}</Badge>}
                    </div>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between h-14 rounded-2xl border-2 hover:border-primary/50 hover:bg-primary/5 transition-all text-base font-bold">
                          <span className="flex items-center">
                            <CalendarDays className="mr-3 h-5 w-5 text-primary" />
                            {date ? format(date, "EEEE, dd/MM", { locale: vi }) : "Chọn ngày chơi"}
                          </span>
                          <ChevronDownIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden shadow-2xl border-none" align="end">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(d) => { setDate(d); setSelectedPricing(null); setOpen(false); }}
                          disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
                          locale={vi}
                          className="p-4"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">02. Chọn khung giờ</Label>
                       <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/20">{dayType === 'weekend' ? 'Cuối tuần' : 'Ngày thường'}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <AnimatePresence mode="popLayout">
                        {filteredPricings.map((item: any) => {
                          const booked = isTimeBooked(item);
                          const isSelected = selectedPricing === item.id;
                          return (
                            <motion.button
                              whileHover={!booked ? { scale: 1.02, y: -2 } : {}}
                              whileTap={!booked ? { scale: 0.98 } : {}}
                              key={item.id}
                              disabled={booked}
                              onClick={() => setSelectedPricing(isSelected ? null : item.id)}
                              className={cn(
                                "relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300",
                                booked 
                                  ? "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-60 cursor-not-allowed" 
                                  : isSelected 
                                    ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                                    : "border-slate-100 dark:border-slate-800 hover:border-primary/30 bg-slate-50/50 dark:bg-slate-900"
                              )}
                            >
                              <span className="text-[11px] font-bold mb-1 opacity-80 uppercase tracking-tighter">{item.timeStart} - {item.timeEnd}</span>
                              <span className={cn("text-base font-black", isSelected ? "text-primary-foreground" : "text-slate-900 dark:text-white")}>
                                {Math.round(item.price_per_hour / 1000)}K
                              </span>
                              {booked && (
                                <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
                                  <Badge variant="destructive" className="text-[9px] px-2 py-0 h-5">HẾT SÂN</Badge>
                                </div>
                              )}
                            </motion.button>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    <div className="flex items-center justify-between px-2">
                       <span className="text-sm font-medium text-slate-500 font-bold uppercase tracking-widest">Tổng cộng:</span>
                       <span className="text-2xl font-black text-primary">
                         {selectedPricingData ? `${selectedPricingData.price_per_hour.toLocaleString()}đ` : "---"}
                       </span>
                    </div>
                    <Button 
                      size="lg"
                      className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-95"
                      disabled={!canBooking}
                      onClick={handleBooking}
                    >
                      {!isAuthenticated ? "Đăng nhập ngay" : !selectedPricing ? "Chọn giờ chơi" : "Đặt sân ngay"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 h-12 rounded-xl gap-2 font-bold border-2">
                   <Phone className="w-4 h-4 text-primary" /> Liên hệ
                </Button>
                {/* <Button variant="outline" className="h-12 w-12 rounded-xl p-0 border-2">
                   <Zap className="w-4 h-4 text-orange-500 fill-current" />
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtDetail;
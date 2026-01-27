import { getTournamentDetail } from "@/stores/actions/tournamentActions";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"; // Khuyên dùng thay vì window.location
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { tournamentService } from "@/services/tournamentService";
import { toast } from "sonner";
import { CalendarDays, MapPin, ShieldCheck, Trophy, Users } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const TournamentDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); 
  const { tournamentDetail } = useSelector((state: any) => state.tournaments);
  const { user } = useSelector((state: any) => state.auth);

  const isRegistered = tournamentDetail?.users?.some(
    (u: any) => u.id === user?.id
  );

  useEffect(() => {
    if (id) {
      dispatch(getTournamentDetail(id as any) as any);
    }
  }, [dispatch, id]);

  const handleRegister = async (tournamentId: number) => {
    try {
      await tournamentService.tournamentRegister(tournamentId);
      dispatch(getTournamentDetail(tournamentId as any) as any);
      toast.success("Đăng ký tham gia thành công!");
    } catch (err) {
      toast.error("Không thể đăng ký lúc này. Vui lòng thử lại!");
    }
  };

  if (!tournamentDetail) return <div className="h-screen flex items-center justify-center">Đang tải...</div>;

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      <div className="px-4 px-6 py-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-8">
            <motion.div {...fadeUp} className="overflow-hidden rounded-3xl shadow-xl bg-white p-2">
              <Carousel className="w-full">
                <CarouselContent>
                  {tournamentDetail?.images?.map((item: any, index: number) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-video overflow-hidden rounded-2xl">
                        <img
                          src={`${import.meta.env.VITE_SERVER_API}${item.url}`}
                          alt={tournamentDetail.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
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
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
              <Card className="border-none shadow-md rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <ShieldCheck className="text-primary w-6 h-6" />
                    Mô tả chi tiết
                  </h3>
                  {tournamentDetail.details ? (
                    <div
                      className="prose prose-blue max-w-none text-gray-600
                      [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4
                      [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3
                      [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2
                      [&_p]:leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: tournamentDetail.details }}
                    />
                  ) : (
                    <p className="text-muted-foreground italic text-center py-10">
                      Chưa có thông tin chi tiết về giải đấu này.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="lg:col-span-5">
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="sticky top-24 space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
                  {tournamentDetail?.name}
                </h1>
                
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-50 text-red-600 font-bold border border-red-100">
                  <Trophy className="w-5 h-5 mr-2" />
                  Giải thưởng: {Number(tournamentDetail?.price).toLocaleString('vi-VN')} VNĐ
                </div>
              </div>

              <Card className="border-none shadow-lg rounded-3xl bg-white">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                        <CalendarDays className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Thời gian bắt đầu</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(tournamentDetail?.start_date).toLocaleDateString("vi-VN", {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Địa điểm tổ chức</p>
                        <p className="font-semibold text-gray-800">{tournamentDetail?.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-50 rounded-2xl text-green-600">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Đơn vị tổ chức</p>
                        <p className="font-semibold text-gray-800">{tournamentDetail?.organizer}</p>
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {!isRegistered ? (
                      <Button
                        onClick={() => handleRegister(Number(id))}
                        className="w-full h-12 text-lg font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all hover:scale-[1.02]"
                      >
                        Đăng ký ngay
                      </Button>
                    ) : (
                      <Button
                        disabled
                        className="w-full h-12 text-lg font-bold rounded-2xl bg-emerald-500 disabled:opacity-100 text-white"
                      >
                        <ShieldCheck className="w-5 h-5 mr-2" /> Đã đăng ký
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full h-12 text-lg font-bold rounded-2xl border-2 hover:bg-gray-50"
                    >
                      Lưu giải đấu
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-blue-600 rounded-3xl p-6 text-white flex justify-between items-center overflow-hidden relative">
                <div className="z-10">
                  <p className="text-blue-100 text-sm">Cộng đồng</p>
                  <p className="text-xl font-bold">{tournamentDetail?.users?.length || 0} Người đã đăng ký</p>
                </div>
                <Users className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-500 opacity-50" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;
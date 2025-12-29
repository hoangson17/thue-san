import { getTournamentDetail } from "@/stores/actions/tournamentActions";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};


const TournamentDetail = () => {
  const dispatch = useDispatch();
  const id = window.location.pathname.split("/")[2];
  const { tournamentDetail } = useSelector((state: any) => state.tournaments);

  useEffect(() => {
    dispatch(getTournamentDetail(id as unknown as number) as any);
  }, [dispatch, id]);

  // console.log(tournamentDetail);

  return (
    <div>
      <div className="px-6 md:px-16 py-10 max-w-7xl mx-auto space-y-10">
        <div className="flex gap-2">
          <div className="w-full md:max-w-7/12">
            <Carousel className="w-full aspect-video">
              <CarouselContent>
                {tournamentDetail?.images?.map((item: any, index: number) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <div className="m-auto overflow-hidden rounded-2xl h-full w-full">
                        <img
                          src={`${import.meta.env.VITE_SERVER_API}${item.url}`}
                          alt={`image-${index}`}
                          className="w-full h-full object-cover aspect-video"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-3 cursor-pointer" />
              <CarouselNext className="right-3 cursor-pointer" />
            </Carousel>
          </div>
          <div className="w-full md:max-w-5/12 ml-4 flex flex-col gap-3">
            <h1 className="text-3xl font-bold">
              {tournamentDetail?.name}
            </h1>
            <p className="text-xl font-medium">Tổng giải thưởng: <b className="text-red-500">{tournamentDetail?.price} vnđ</b></p>
            <p className="text-justify">{tournamentDetail?.description}</p>
            <b>
              Ngày bắt đầu: {new Date(tournamentDetail?.start_date).toLocaleDateString("vi-VN")}
            </b>
            <b>Địa điểm tổ chức: {tournamentDetail?.address}</b>
            <p>Đơn vị tổ chức: {tournamentDetail?.organizer}</p>
            <div className="w-full grid grid-cols-2 gap-4 ">
              <Button className="text-white py-2 px-4 rounded-md cursor-pointer">
                Đăng ký
              </Button>
              <Button className="text-black bg-white border border-black hover:bg-gray-900 hover:text-white cursor-pointer py-2 px-4 rounded-md">
                Lưu lại
              </Button>
            </div>
          </div>
        </div>
        <div>
        {" "}
        <motion.div {...fadeUp}>
          <Card className="rounded-2xl">
            <CardContent>
              <h3 className="text-xl font-bold">Mô tả chi tiết</h3>
              {tournamentDetail.details ? (
                <div
                  className="
                    text-sm leading-relaxed space-y-2
                    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4
                    [&_h4]:text-base [&_h4]:font-semibold [&_h4]:mt-3
                    [&_ul]:list-disc [&_ul]:pl-5
                    [&_li]:mb-1
                  "
                  dangerouslySetInnerHTML={{
                    __html: tournamentDetail.details,
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
    </div>
  );
};

export default TournamentDetail;

import { getOneUser } from "@/stores/actions/authActions";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trophy, CalendarDays } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const RegisterTounament = () => {
  const dispatch = useDispatch();
  const { userDetail } = useSelector((state: any) => state.auth);

  useEffect(() => {
    dispatch(getOneUser() as any);
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-7xl px-16 py-10">
      <div className="mb-8 flex items-center gap-2">
        <Trophy className="h-7 w-7 text-primary" />
        <h1 className="text-xl font-semibold">Giải đấu đã đăng ký</h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {userDetail?.toumaments?.length > 0 ? (
          userDetail.toumaments.map((item: any) => (
            <Link to={`/tournaments/${item.id}`} key={item.id}>
              <Card
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border-none shadow-sm transition hover:shadow-lg"
              >
                <img
                  src={`${import.meta.env.VITE_SERVER_API}${item.images?.[0]?.url}`}
                  alt={item.name}
                  className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                <Badge className="absolute right-4 top-4 bg-white/90 text-black">
                  Đã đăng ký
                </Badge>

                <div className="absolute bottom-0 p-4 text-white">
                  <p className="font-semibold leading-tight line-clamp-2">
                    {item.name}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-white/80">
                    <CalendarDays className="h-4 w-4" />
                    {new Date(item.start_date).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <Card className="col-span-full p-12 text-center text-muted-foreground">
            Bạn chưa đăng ký giải đấu nào
          </Card>
        )}
      </div>
    </div>
  );
};

export default RegisterTounament;

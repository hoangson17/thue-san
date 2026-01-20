import { getBookingsByUser } from "@/stores/actions/bookingActions";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Clock, MapPin, CreditCard, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

/* ===== helpers ===== */
const formatDate = (date: string) => new Date(date).toLocaleDateString("vi-VN");

const formatTime = (time: string) => time.slice(0, 5);

const formatPrice = (price: number) => price.toLocaleString("vi-VN") + " ₫";

/* ===== component ===== */
const BookingCourt = () => {
  const dispatch = useDispatch();
  const { bookingsByUser } = useSelector((state: any) => state.bookings);

  useEffect(() => {
    dispatch(getBookingsByUser() as any);
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-16 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/10 text-primary">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Lịch đặt sân của tôi</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý & theo dõi các lịch đã đặt
          </p>
        </div>
      </div>

      {(!bookingsByUser || bookingsByUser.length === 0) && (
        <Card className="py-10 text-center text-muted-foreground">
          Bạn chưa có lịch đặt nào
        </Card>
      )}

      <div className="grid gap-5">
        {bookingsByUser?.map((booking: any) => (
          <Link to={`/courts/${booking.court.id}`} key={booking.id}>
            <Card key={booking.id} className="group transition hover:shadow-lg">
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* LEFT */}
                <div className="space-y-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {booking.court.name}
                  </CardTitle>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(booking.date)}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(booking.time_start)} –{" "}
                      {formatTime(booking.time_end)}
                    </span>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-6 md:text-right">
                  <div>
                    <p className="text-lg font-semibold">
                      {formatPrice(booking.total_price)}
                    </p>
                    <Badge
                      className="mt-1"
                      variant={
                        booking.status === "pending" ? "secondary" : "default"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </div>

                  {booking.status === "pending" && (
                    <Button className="gap-2">
                      <Wallet className="w-4 h-4" />
                      Thanh toán
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BookingCourt;

import React, { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, ShoppingCart } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/stores/actions/authActions";
import { getBookings } from "@/stores/actions/bookingActions";

/* =======================
   Build chart data
======================= */
const buildWeeklyRevenue = (bookings: any[]) => {
  const map: Record<string, number> = {};

  bookings.forEach(b => {
    if (!b.date) return;
    map[b.date] = (map[b.date] || 0) + (b.total_price || 0);
  });

  return Object.keys(map)
    .sort()
    .slice(-7)
    .map(date => ({
      name: date,
      revenue: map[date],
    }));
};

const Dashboard = () => {
  const dispatch = useDispatch();

  const { getUsers } = useSelector((state: any) => state.users);
  const { bookings } = useSelector((state: any) => state.bookings);

  useEffect(() => {
    dispatch(getAllUsers() as any);
    dispatch(getBookings() as any);
  }, [dispatch]);

  const chartData = useMemo(
    () => buildWeeklyRevenue(bookings || []),
    [bookings]
  );

  const totalRevenue = bookings?.reduce(
    (total: number, b: any) => total + (b.total_price || 0),
    0
  );

  return (
    <div className="flex">
      <main className="w-full space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* ===== Stats ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-sm">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{getUsers?.length || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-sm">Số đơn đặt sân</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{bookings?.length || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-sm">Tổng tiền đặt sân</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {totalRevenue?.toLocaleString("vi-VN")} đ
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ===== Chart ===== */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu 7 ngày gần nhất</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) =>
                    value.toLocaleString("vi-VN") + " đ"
                  }
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ===== Recent Orders ===== */}
        <Card>
          <CardHeader>
            <CardTitle>Đơn đặt sân mới</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings?.slice(0, 5).map((b: any) => (
                  <TableRow key={b.id}>
                    <TableCell>#{b.id}</TableCell>
                    <TableCell>{b.user?.name}</TableCell>
                    <TableCell>
                      {b.total_price?.toLocaleString("vi-VN")} đ
                    </TableCell>
                    <TableCell>{b.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;

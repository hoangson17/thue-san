import React, { useEffect } from "react";
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

const chartData = [
  { name: "Mon", revenue: 400 },
  { name: "Tue", revenue: 300 },
  { name: "Wed", revenue: 500 },
  { name: "Thu", revenue: 200 },
  { name: "Fri", revenue: 700 },
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { getUsers } = useSelector((state: any) => state.users);

  useEffect(() => {
    dispatch(getAllUsers() as any);
  }, [dispatch]);
  
  return (
    <div className="flex">
      <main className=" w-full space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-sm">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{getUsers?.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-sm">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">320</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-sm">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$12,450</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu tuần</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng mới</CardTitle>
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
                <TableRow>
                  <TableCell>#001</TableCell>
                  <TableCell>Nguyễn Văn A</TableCell>
                  <TableCell>$120</TableCell>
                  <TableCell>Paid</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>#002</TableCell>
                  <TableCell>Trần Văn B</TableCell>
                  <TableCell>$89</TableCell>
                  <TableCell>Pending</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;

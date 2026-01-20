import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal } from "lucide-react";
import { getBookingAdmin } from "@/stores/actions/bookingActions";

const AdminBooking = () => {
  const dispatch = useDispatch();
  const { bookingAdmin, loading } = useSelector((state: any) => state.bookings);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getBookingAdmin(page, "desc", search) as any);
  }, [dispatch, page, search]);

  console.log(bookingAdmin);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Danh sách đặt sân</h1>
      <div className="flex justify-between">
        <Input
          placeholder="Tìm theo tên người đặt..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-[260px]"
        />
      </div>
      <div className="rounded-xl border bg-background shadow-sm">
        <div className="h-[450px] overflow-auto">
          <Table className="w-full table-fixed">
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow className="bg-muted/50">
                <TableHead className="w-[70px] text-center">ID</TableHead>
                <TableHead className="w-[180px]">Người đặt</TableHead>
                <TableHead className="w-[160px]">Sân</TableHead>
                <TableHead className="w-[120px] text-center">Ngày</TableHead>
                <TableHead className="w-[120px] text-center">Giờ</TableHead>
                <TableHead className="w-[140px] text-right">
                  Tổng tiền
                </TableHead>
                <TableHead className="w-[120px] text-center">
                  Trạng thái
                </TableHead>
                <TableHead className="w-[80px] text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!loading && bookingAdmin?.data?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-10 text-center text-muted-foreground"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                bookingAdmin?.data?.map((booking: any) => (
                  <TableRow
                    key={booking.id}
                    className="transition hover:bg-muted/40"
                  >
                    <TableCell className="text-center">#{booking.id}</TableCell>

                    <TableCell className="font-medium truncate">
                      {booking.user?.name}
                    </TableCell>

                    <TableCell className="truncate">
                      {booking.court?.name}
                    </TableCell>

                    <TableCell className="text-center text-sm text-muted-foreground">
                      {new Date(booking.date).toLocaleDateString("vi-VN")}
                    </TableCell>

                    <TableCell className="text-center">
                      {booking.time_start} - {booking.time_end}
                    </TableCell>

                    <TableCell className="text-right font-semibold">
                      {booking.total_price?.toLocaleString("vi-VN")}₫
                    </TableCell>

                    <TableCell className="text-center">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium
                        ${
                          booking.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Hủy đơn
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* PAGINATION */}
      {bookingAdmin?.pagination?.totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && setPage(page - 1)}
              />
            </PaginationItem>

            {Array.from({
              length: bookingAdmin.pagination.totalPages,
            }).map((_, i) => {
              const p = i + 1;
              return (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={page === p}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  page < bookingAdmin.pagination.totalPages && setPage(page + 1)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default AdminBooking;

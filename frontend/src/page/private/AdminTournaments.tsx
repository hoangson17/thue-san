import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Plus } from "lucide-react";
import { getTournament } from "@/stores/actions/tournamentActions";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

const formatDate = (date?: string | null) =>
  date ? new Date(date).toLocaleDateString("vi-VN") : "—";

const formatPrice = (price?: string | number) =>
  price ? Number(price).toLocaleString("vi-VN") + " ₫" : "—";

const AdminTournaments = () => {
  const dispatch = useDispatch();
  const { tournaments, loading } = useSelector(
    (state: any) => state.tournaments
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getTournament(page, "DESC", search) as any);
  }, [dispatch, page, search]);

  const data = tournaments?.data || [];
  const pagination = tournaments?.pagination;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Quản lý giải đấu</h1>
      </div>

      <div className="flex justify-between">
        <div className="w-[280px]">
          <Input
            placeholder="Tìm theo tên giải đấu..."
            value={search}
            onChange={(e) => {
              setPage(1); // reset page khi search
              setSearch(e.target.value);
            }}
          />
        </div>
        <div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm giải đấu
          </Button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
      )}

      {/* TABLE */}
      {!loading && data.length > 0 && (
        <div className="rounded-lg border bg-background overflow-y-auto h-[430px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Ảnh</TableHead>
                <TableHead>Tên giải</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Giải thưởng</TableHead>
                <TableHead>BTC</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((t: any, index: number) => (
                <TableRow key={t.id}>
                  <TableCell>
                    {(page - 1) * (pagination?.limit || 10) + index + 1}
                  </TableCell>

                  <TableCell>
                    <img
                      src={
                        t.images?.[0]?.url
                          ? `${import.meta.env.VITE_SERVER_API}${
                              t.images[0].url
                            }`
                          : "/placeholder.png"
                      }
                      className="h-12 w-20 rounded-md object-cover"
                    />
                  </TableCell>

                  <TableCell className="font-medium">{t.name}</TableCell>

                  <TableCell>{formatDate(t.start_date)}</TableCell>

                  <TableCell className="max-w-[220px] truncate">
                    {t.address || "—"}
                  </TableCell>

                  <TableCell>{formatPrice(t.price)}</TableCell>

                  <TableCell>{t.organizer || "—"}</TableCell>

                  <TableCell>
                    <Badge variant={t.deletedAt ? "destructive" : "default"}>
                      {t.deletedAt ? "Đã xóa" : "Hoạt động"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Xem</DropdownMenuItem>
                        <DropdownMenuItem>Sửa</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          Chưa có giải đấu nào
        </div>
      )}

      {/* PAGINATION */}
      {pagination?.totalPages > 1 && (
        <Pagination className="mt-10">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && setPage(page - 1)}
              />
            </PaginationItem>

            {Array.from({ length: pagination.totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    isActive={page === pageNumber}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  page < pagination.totalPages && setPage(page + 1)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default AdminTournaments;

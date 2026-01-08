import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { MoreHorizontal, Plus } from "lucide-react";

import { getCourts } from "@/stores/actions/courtActions";

const AdminCourts = () => {
  const dispatch = useDispatch();
  const { courts, loading } = useSelector((state: any) => state.courts);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Fetch data
  useEffect(() => {
    dispatch(getCourts(page, "desc", search) as any);
  }, [dispatch, page, search]);

  const handleSoftDelete = (id: number) => {
    dispatch(getCourts(page, search) as any);
  };

  const handleRestore = (id: number) => {
    dispatch(getCourts(page, search) as any);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Quản lý sân đấu</h1>
      </div>
      <div className="flex justify-between">
        <div className="w-[300px]">
          <input
            type="text"
            placeholder="Tìm kiếm sân..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-2 py-1 w-full"
          />
        </div>
        <div>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Thêm sân đấu
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-background shadow-sm">
        <div className="h-[450px] overflow-auto">
          <Table className="table-fixed w-full">
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow className="bg-muted/50">
                <TableHead className="w-[50px]">STT</TableHead>
                <TableHead className="w-[100px]">Ảnh</TableHead>
                <TableHead className="w-[230px]">Tên</TableHead>
                <TableHead>Loại sân</TableHead>
                <TableHead>Sân</TableHead>
                <TableHead className="">Note</TableHead>
                <TableHead>Tình trạng</TableHead>
                <TableHead className="text-center">Hoạt động</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!loading && courts?.data?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-muted-foreground"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}

              {courts?.data?.map((court: any) => (
                <TableRow
                  key={court.id}
                  className="hover:bg-muted/20 transition"
                >
                  <TableCell className="font-medium">{court.id}</TableCell>
                  <TableCell>
                    <img
                      src={`${import.meta.env.VITE_SERVER_API}${
                        court.images?.[0]?.url
                      }`}
                      className="h-12 w-20 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{court.name}</TableCell>
                  <TableCell className="font-medium">
                    {court.court_type?.name}
                  </TableCell>
                  <TableCell>{court.court_type?.sport_id?.name}</TableCell>
                  <TableCell className="font-medium">
                    {court.note?.slice(0, 10)}...
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={court.deletedAt ? "destructive" : "default"}
                    >
                      {court.deletedAt ? "Đã xóa" : "Hoạt động"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Xem</DropdownMenuItem>
                        <DropdownMenuItem>Sửa</DropdownMenuItem>
                        {court.deletedAt ? (
                          <DropdownMenuItem
                            className="text-success"
                            onClick={() => handleRestore(court.id)}
                          >
                            Khôi phục
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleSoftDelete(court.id)}
                          >
                            Xóa
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {courts?.pagination?.totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && setPage(page - 1)}
              />
            </PaginationItem>

            {Array.from({ length: courts.pagination.totalPages }).map(
              (_, i) => {
                const pageNumber = i + 1;
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
              }
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  page < courts.pagination.totalPages && setPage(page + 1)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default AdminCourts;

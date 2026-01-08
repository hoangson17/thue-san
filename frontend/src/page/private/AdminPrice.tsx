import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { getPrices } from "@/stores/actions/priceActions";

const AdminPrice = () => {
  const dispatch = useDispatch();
  const { prices, loading, pagination } = useSelector(
    (state: any) => state.prices
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getPrices(page, search) as any);
  }, [dispatch, page, search]);

  console.log(prices.data);
  

  const handleSoftDelete = async (id: number) => {
    // TODO: gọi action soft delete
    dispatch(getPrices(page, search) as any);
  };

  const handleRestore = async (id: number) => {
    // TODO: gọi action restore
    dispatch(getPrices(page, search) as any);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Quản lý bảng giá</h1>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Thêm bảng giá
        </Button>
      </div>

      {/* Search */}
      <div className="w-[300px]">
        <input
          type="text"
          placeholder="Tìm theo khung giờ..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border rounded-md px-2 py-1 w-full"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-background shadow-sm">
        <div className="overflow-auto">
          <Table className="table-auto w-full">
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow className="bg-muted/50">
                <TableHead className="w-[60px] text-center">ID</TableHead>
                <TableHead>Loại ngày</TableHead>
                <TableHead>Khung giờ</TableHead>
                <TableHead className="text-right">Giá / giờ</TableHead>
                <TableHead className="w-[120px] text-center">Hành động</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!loading && prices?.data?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-muted-foreground"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}

              {prices?.data?.map((price: any) => (
                <TableRow
                  key={price.id}
                  className="hover:bg-muted/20 transition"
                >
                  <TableCell className="text-center font-medium">
                    {price.id}
                  </TableCell>

                  <TableCell>
                    {price.dayType === "weekday"
                      ? "Ngày thường"
                      : "Cuối tuần"}
                  </TableCell>

                  <TableCell>
                    {price.timeStart} - {price.timeEnd}
                  </TableCell>

                  <TableCell className="text-right font-semibold">
                    {price.price_per_hour.toLocaleString()} đ
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

                        {price.deletedAt ? (
                          <DropdownMenuItem
                            className="text-success"
                            onClick={() => handleRestore(price.id)}
                          >
                            Khôi phục
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleSoftDelete(price.id)}
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
      {pagination?.totalPages > 1 && (
        <Pagination className="mt-4">
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

export default AdminPrice;

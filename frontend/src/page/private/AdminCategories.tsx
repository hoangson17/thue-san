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
import { getAllCategories } from "@/stores/actions/categoriesActions";
import categoriesService from "@/services/categoriesService";

const AdminCategories = () => {
  const dispatch = useDispatch();
  const { categories, loading, pagination } = useSelector(
    (state: any) => state.categories
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getAllCategories(page, search) as any);
  }, [dispatch, page, search]);

  const handleSoftDelete = async (id: number) => {
    dispatch(getAllCategories(page, search) as any);
  };

  const handleRestore = async (id: number) => {
    dispatch(getAllCategories(page, search) as any);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Quản lý danh mục</h1>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Thêm danh mục
        </Button>
      </div>

      <div className="w-[300px]">
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
                <TableHead className="text-left">Tên danh mục</TableHead>
                <TableHead className="w-[150px] text-center">Hoạt động</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!loading && categories?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}

              {categories?.map((category: any) => (
                <TableRow key={category.id} className="hover:bg-muted/20 transition">
                  <TableCell className="text-center font-medium">{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
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
                        {category.deletedAt ? (
                          <DropdownMenuItem
                            className="text-success"
                            onClick={() => handleRestore(category.id)}
                          >
                            Khôi phục
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleSoftDelete(category.id)}
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
              <PaginationPrevious onClick={() => page > 1 && setPage(page - 1)} />
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

export default AdminCategories;

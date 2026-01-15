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
import { getAllCategories } from "@/stores/actions/categoriesActions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import categoriesService from "@/services/categoriesService";
import { toast } from "sonner";

const AdminCategories = () => {
  const dispatch = useDispatch();
  const { categories, loading, pagination } = useSelector(
    (state: any) => state.categories
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  useEffect(() => {
    if (editingCategory) {
      setCategoryId(editingCategory.id);
      setName(editingCategory.name || "");
      setIsModalOpen(true);
    }
  }, [editingCategory]);

  const resetForm = () => {
    setName("");
    setEditingCategory(null);
  };

  const handleSave = async () => {
    try {
      if (!name.trim()) return;

      const data = { name };
      if (editingCategory) {
        await categoriesService.updateCategory(categoryId, data);
        toast.success("Đã cập nhật danh mục");
      } else {
        await categoriesService.createCategory(data);
        toast.success("Đã tạo danh mục");
      }
    } catch (error) {
      toast.error(`Không thể ${editingCategory ? "cập nhật" : "tạo"} danh mục`);
    }

    setIsModalOpen(false);
    resetForm();

    dispatch(getAllCategories(page, search) as any);
  };

  useEffect(() => {
    dispatch(getAllCategories(page, search) as any);
  }, [dispatch, page, search]);

  const handleDelete = async (id: number) => {
    try {
      await categoriesService.deleteCategory(id);
      toast.success("Đã xóa danh mục");
    } catch (error) {
      toast.error("Không thể xóa danh mục");
    }
    dispatch(getAllCategories(page, search) as any);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Quản lý danh mục</h1>
      </div>

      <div className="flex justify-between">
        <div className="w-[300px]">
          <Input
            placeholder="Tìm kiếm danh mục..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>

        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-1"
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Thêm danh mục
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
              </DialogTitle>
              <DialogDescription>
                Nhập thông tin để lưu vào hệ thống
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Tên danh mục</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={!name.trim()}>
                {editingCategory ? "Cập nhật" : "Thêm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-background shadow-sm">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">ID</TableHead>
                <TableHead>Tên danh mục</TableHead>
                <TableHead className="w-[150px] text-center">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!loading && categories?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-10">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}

              {categories?.map((category: any) => (
                <TableRow key={category.id}>
                  <TableCell className="text-center">{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditingCategory(category)}
                        >
                          Sửa
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleDelete(category.id)}
                        >
                          xóa
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

      {pagination?.totalPages > 1 && (
        <Pagination>
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

export default AdminCategories;

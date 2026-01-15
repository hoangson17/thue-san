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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";

import { getProducts } from "@/stores/actions/productActions";
import { getAllCategories } from "@/stores/actions/categoriesActions";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state: any) => state.products);
  const { categories } = useSelector((state: any) => state.categories);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");

  const [viewProduct, setViewProduct] = useState<any>(null);
  const [editProduct, setEditProduct] = useState<any>(null);

  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<string>("active");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(getProducts(page, category, search) as any);
    }, 500);
    dispatch(getAllCategories() as any);
    return () => clearTimeout(delayDebounce);
  }, [dispatch, page, category, search]);

  console.log(categories);

  const handleDeleteProduct = async (product: any) => {
    // await dispatch(deleteProduct(product.id) as any);
    dispatch(getProducts(page, category, search) as any);
  };

  const handleEditProduct = async () => {
    if (!editProduct) return;
    // await dispatch(updateProduct(editProduct.id, { name: editName, price: editPrice, status: editStatus }) as any);
    dispatch(getProducts(page, category, search) as any);
    setEditProduct(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Danh sách sản phẩm</h1>
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Input
            placeholder="Tìm theo tên sản phẩm..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-[260px]"
          />

          <Select
            value={category}
            onValueChange={(v) => {
              setCategory(v === "all" ? "" : v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tất cả danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {categories?.map((category: any) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <Button>+ Thêm sản phẩm</Button>
        </div>
      </div>

      <div className="rounded-xl border bg-background shadow-sm">
        <div className="h-[450px] overflow-auto">
          <Table className="w-full table-fixed">
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow className="bg-muted/50">
                <TableHead className="w-[60px] text-center">ID</TableHead>
                <TableHead className="w-[80px] text-center">Ảnh</TableHead>
                <TableHead className="w-[200px] tex">Tên sản phẩm</TableHead>
                <TableHead className="w-[100px] text-left">Giá</TableHead>
                <TableHead className="w-[80px] text-center">Tồn kho</TableHead>
                <TableHead className="w-[100px]">Ngày tạo</TableHead>
                <TableHead className="w-[100px] text-center">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!loading && products?.data?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-muted-foreground"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}

              {products?.data?.map((product: any) => {
                const firstImage =
                  import.meta.env.VITE_SERVER_API + product.images[0]?.url ||
                  "";

                return (
                  <TableRow
                    key={product.id}
                    className="transition hover:bg-muted/40"
                  >
                    <TableCell className="text-center">{product.id}</TableCell>

                    <TableCell className="text-center">
                      <Avatar className="mx-auto h-9 w-9">
                        <AvatarImage src={firstImage} />
                        <AvatarFallback>
                          {product.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>

                    <TableCell className="truncate font-medium">
                      {product.name}
                    </TableCell>

                    <TableCell className="truncate text-muted-foreground">
                      {product.price.toLocaleString("vi-VN")}₫
                    </TableCell>

                    <TableCell className="text-center">
                      {product.stock}
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>

                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditProduct(product);
                              setEditName(product.name);
                              setEditPrice(product.price);
                              setEditStatus(product.status);
                            }}
                          >
                            Sửa
                          </DropdownMenuItem>

                          {/* Xóa */}
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteProduct(product)}
                          >
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* PAGINATION */}
      {products?.pagination?.totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && setPage(page - 1)}
              />
            </PaginationItem>

            {Array.from({ length: products?.pagination?.totalPages }).map(
              (_, i) => {
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
              }
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  page < products?.pagination?.totalPages && setPage(page + 1)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default AdminProducts;

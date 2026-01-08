import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MoreHorizontal, Check, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { getSupport } from "@/stores/actions/SupportAction";
import { supportService } from "@/services/supportService";
import { toast } from "sonner";

const Support = () => {
  const dispatch = useDispatch();
  const { supports, loading } = useSelector((state: any) => state.supports);

  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [localData, setLocalData] = useState<any[]>([]);

  useEffect(() => {
    dispatch(getSupport(page, "desc") as any);
  }, [dispatch, page]);

  useEffect(() => {
    if (Array.isArray(supports?.data)) {
      setLocalData(supports.data);
    }
  }, [supports?.data]);
  

  const truncate = (text = "", len = 30) =>
    text.length > len ? text.slice(0, len) + "..." : text;

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      await supportService.deleteSupport(selectedId);
      setLocalData((prev) => prev.filter((i) => i.id !== selectedId));
      toast.success("Đã xóa yêu cầu hỗ trợ");
    } catch {
      toast.error("Không thể xóa yêu cầu");
    } finally {
      setSelectedId(null);
    }
  };

  const handleUpdateStatus = async (id: number, status: boolean) => {
    setUpdatingId(id);

    setLocalData((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i))
    );

    try {
      await supportService.updateSupport(id, { status });
      toast.success("Cập nhật trạng thái thành công");
    } catch {
      setLocalData((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: !status } : i))
      );
      toast.error("Cập nhật trạng thái thất bại");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Quản lý hỗ trợ</h1>

      {loading && (
        <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
      )}

      {!loading && localData.length > 0 && (
        <div className="rounded-lg border bg-background h-[480px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {localData.map((t) => (
                <TableRow key={t.name} className="hover:bg-muted/40">
                  <TableCell>{t.id}</TableCell>
                  <TableCell>{t.name}</TableCell>
                  <TableCell className="truncate max-w-[200px]">
                    {t.email}
                  </TableCell>
                  <TableCell>{t.phone}</TableCell>
                  <TableCell className="max-w-[240px] truncate">
                    {truncate(t.message)}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={updatingId === t.id}
                          className="p-0"
                        >
                          <Badge variant={t.status ? "default" : "destructive"}>
                            {t.status ? "Đã phản hồi" : "Chưa phản hồi"}
                          </Badge>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="start">
                        <DropdownMenuItem
                          disabled={t.status}
                          onClick={() => handleUpdateStatus(t.id, true)}
                          className="flex gap-2"
                        >
                          {t.status && <Check className="h-4 w-4" />}
                          Đã phản hồi
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          disabled={!t.status}
                          onClick={() => handleUpdateStatus(t.id, false)}
                          className="flex gap-2"
                        >
                          {!t.status && <Check className="h-4 w-4" />}
                          Chưa phản hồi
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedId(t.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa yêu cầu hỗ trợ của{" "}
                            <b>{t.name}</b>? Hành động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive"
                            onClick={handleDelete}
                          >
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {supports?.pagination?.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && setPage(page - 1)}
              />
            </PaginationItem>

            {Array.from(
              { length: supports.pagination.totalPages },
              (_, i) => i + 1
            ).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={page === p}
                  onClick={() => setPage(p)}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  page < supports.pagination.totalPages && setPage(page + 1)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {!loading && localData.length === 0 && (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          Chưa có yêu cầu hỗ trợ nào
        </div>
      )}
    </div>
  );
};

export default Support;

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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { getCourts } from "@/stores/actions/courtActions";
import { TipTapEditor } from "@/components/TipTapEditor";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

const AdminCourts = () => {
  const dispatch = useDispatch();
  const { courts, loading } = useSelector((state: any) => state.courts);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Modal Thêm/Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<any>(null);

  // Form state
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [description, setDescription] = useState("");
  const [courtType, setCourtType] = useState(1);

  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    dispatch(getCourts(page, "desc", search) as any);
  }, [dispatch, page, search]);

  useEffect(() => {
    if (editingCourt) {
      setName(editingCourt.name || "");
      setNote(editingCourt.note || "");
      setDescription(editingCourt.description || "");
      setCourtType(editingCourt.court_type?.id || 1);
      setImages(
        editingCourt.images?.map((img: any) => ({ ...img, isOld: true })) || []
      );
      setIsModalOpen(true);
    }
  }, [editingCourt]);

  // Reset form khi đóng modal
  const resetForm = () => {
    setName("");
    setNote("");
    setDescription("");
    setCourtType(1);
    setImages([]);
    setEditingCourt(null);
  };

  // Upload ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Lưu dữ liệu
  const handleSave = () => {
    const data = { name, note, description, courtType, images };
    if (editingCourt) {
      // dispatch(updateCourt(editingCourt.id, data) as any);
    } else {
      // dispatch(addCourt(data) as any);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleSoftDelete = (id: number) => {
    // gọi API xóa
    dispatch(getCourts(page, search) as any);
  };

  const handleRestore = (id: number) => {
    // gọi API restore
    dispatch(getCourts(page, search) as any);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Quản lý sân đấu</h1>
      </div>

      {/* Search + Thêm */}
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

        <div className="flex gap-4">
          <Link to={"/admin/court-type"}>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Loại sân đấu
            </Button>
          </Link>
          <Link to={"/admin/sports"}>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Môn thể thao
            </Button>
          </Link>
          <Dialog
            open={isModalOpen}
            onOpenChange={(open) => {
              setIsModalOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Thêm sân đấu
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] h-[80vh] overflow-auto scrollbar-hide">
              <DialogHeader>
                <DialogTitle>
                  {editingCourt ? "Chỉnh sửa sân" : "Thêm sân đấu mới"}
                </DialogTitle>
                <DialogDescription>
                  Nhập thông tin sân đấu để lưu vào hệ thống.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-3">
                <Input
                  placeholder="Tên sân"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  placeholder="Note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Select
                  value={courtType.toString()}
                  onValueChange={(val) => setCourtType(Number(val))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn loại sân" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Sân đơn</SelectItem>
                    <SelectItem value="2">Sân đôi</SelectItem>
                  </SelectContent>
                </Select>
                {/* Upload ảnh */}
                <div>
                  <label className="mb-1 block font-medium">Ảnh sân</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mb-2"
                  />
                  <div className="flex gap-2 flex-wrap">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-20 h-20 rounded overflow-hidden border"
                      >
                        <img
                          src={
                            img.preview ||
                            `${import.meta.env.VITE_SERVER_API}${img.url}`
                          }
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TipTap description */}
                <div>
                  <label className="mb-1 block font-medium">Mô tả</label>
                  <TipTapEditor value={description} onChange={setDescription} />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Đóng</Button>
                </DialogClose>
                <Button onClick={handleSave}>
                  {editingCourt ? "Cập nhật" : "Thêm"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-background shadow-sm">
        <div className="h-[450px] overflow-auto scrollbar-hide">
          <Table className="table-fixed w-full">
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow className="bg-muted/50">
                <TableHead className="w-[50px]">STT</TableHead>
                <TableHead className="w-[100px]">Ảnh</TableHead>
                <TableHead className="w-[230px]">Tên</TableHead>
                <TableHead>Loại sân</TableHead>
                <TableHead>Sân</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Tình trạng</TableHead>
                <TableHead className="text-center">Hoạt động</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!loading && courts?.data?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
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
                  <TableCell>{court.court_type?.name}</TableCell>
                  <TableCell>{court.court_type?.sport_id?.name}</TableCell>
                  <TableCell>{court.note?.slice(0, 20)}...</TableCell>
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
                        <DropdownMenuItem
                          onClick={() => setEditingCourt(court)}
                        >
                          Sửa
                        </DropdownMenuItem>
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

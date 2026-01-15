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
import { getTournament} from "@/stores/actions/tournamentActions";
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
import { TipTapEditor } from "@/components/TipTapEditor";

const formatDate = (date?: string | null) =>
  date ? new Date(date).toLocaleDateString("vi-VN") : "—";
const formatPrice = (price?: string | number) =>
  price ? Number(price).toLocaleString("vi-VN") + " ₫" : "—";

const AdminTournaments = () => {
  const dispatch = useDispatch();
  const { tournaments, loading } = useSelector((state: any) => state.tournaments);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Modal Thêm/Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<any>(null);

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [images, setImages] = useState<any[]>([]); // file mới hoặc ảnh cũ

  // Load dữ liệu table
  useEffect(() => {
    dispatch(getTournament(page, "DESC", search) as any);
  }, [dispatch, page, search]);

  // Điền form khi sửa
  useEffect(() => {
    if (editingTournament) {
      setName(editingTournament.name || "");
      setPrice(editingTournament.price || "");
      setStartDate(
        editingTournament.start_date
          ? editingTournament.start_date.split("T")[0]
          : ""
      );
      setAddress(editingTournament.address || "");
      setDescription(editingTournament.description || "");
      setDetails(editingTournament.details || "");
      setImages(
        editingTournament.images?.map((img: any) => ({ ...img, isOld: true })) || []
      );
      setIsModalOpen(true);
    }
  }, [editingTournament]);

  // Reset form khi đóng modal
  const resetForm = () => {
    setName("");
    setPrice("");
    setStartDate("");
    setAddress("");
    setDescription("");
    setDetails("");
    setImages([]);
    setEditingTournament(null);
  };

  // Xử lý thêm/xóa ảnh
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
    const data = { name, price, start_date: startDate, address, description, details, images };
    if (editingTournament) {
      // dispatch(updateTournament(editingTournament.id, data) as any);
    } else {
      // dispatch(addTournament(data) as any);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const data = tournaments?.data || [];
  const pagination = tournaments?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Quản lý giải đấu</h1>
      </div>

      {/* Search + Thêm */}
      <div className="flex justify-between">
        <div className="w-[280px]">
          <Input
            placeholder="Tìm theo tên giải đấu..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>

        <div>
          <Dialog
            open={isModalOpen}
            onOpenChange={(open) => {
              setIsModalOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm giải đấu
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] h-[80vh] overflow-auto scrollbar-hide">
              <DialogHeader>
                <DialogTitle>
                  {editingTournament ? "Chỉnh sửa giải đấu" : "Thêm giải đấu mới"}
                </DialogTitle>
                <DialogDescription>
                  Nhập thông tin giải đấu để lưu vào hệ thống.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-3">
                <Input
                  placeholder="Tên giải đấu"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  placeholder="Giá (VND)"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <Input
                  placeholder="Ngày bắt đầu"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  placeholder="Địa điểm"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Input
                  placeholder="Mô tả ngắn"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                {/* Upload ảnh */}
                <div>
                  <label className="mb-1 block font-medium">Ảnh giải đấu</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mb-2"
                  />
                  <div className="flex gap-2 flex-wrap">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded overflow-hidden border">
                        <img
                          src={img.preview || `${import.meta.env.VITE_SERVER_API}${img.url}`}
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

                {/* TipTap details */}
                <div>
                  <label className="mb-1 block font-medium">Chi tiết giải đấu</label>
                  <TipTapEditor value={details} onChange={setDetails} />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Đóng</Button>
                </DialogClose>
                <Button onClick={handleSave}>
                  {editingTournament ? "Cập nhật" : "Thêm"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
      )}

      {/* Table */}
      {!loading && data.length > 0 && (
        <div className="rounded-lg border bg-background overflow-y-auto h-[430px] scrollbar-hide">
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
              {data.map((t: any) => (
                <TableRow key={t.id}>
                  <TableCell>{t.id}</TableCell>
                  <TableCell>
                    <img
                      src={
                        t.images?.[0]?.url
                          ? `${import.meta.env.VITE_SERVER_API}${t.images[0].url}`
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
                        <DropdownMenuItem onClick={() => setEditingTournament(t)}>
                          Sửa
                        </DropdownMenuItem>
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

      {/* Pagination */}
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

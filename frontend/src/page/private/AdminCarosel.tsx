import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { caroselService } from "@/services/caroselService";
import { getCarosel } from "@/stores/actions/caroselActions";
import { MoreHorizontal, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const AdminCarosel = () => {
  const dispatch = useDispatch();
  const { carosels, loading } = useSelector((state: any) => state.carosels);

  const [open, setOpen] = useState(false);
  const [editingCarosel, setEditingCarosel] = useState<any>(null);

  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    dispatch(getCarosel() as any);
  }, [dispatch]);

  useEffect(() => {
    if (editingCarosel) {
      setDescription(editingCarosel.description || "");
      setPreview(`${import.meta.env.VITE_SERVER_API}${editingCarosel.url}`);
      setImageFile(null);
      setOpen(true);
    }
  }, [editingCarosel]);
  const resetForm = () => {
    setDescription("");
    setImageFile(null);
    setPreview("");
    setEditingCarosel(null);
  };
  const handleSave = async () => {
    if (!imageFile && !editingCarosel) {
      toast.error("Vui lòng chọn hình ảnh");
      return;
    }

    try {
      const formData = new FormData();
      if (imageFile) formData.append("file", imageFile);
      formData.append("description", description);

      if (editingCarosel) {
        await caroselService.updateCarosel(editingCarosel.id, formData);
        toast.success("Đã cập nhật carousel");
      } else {
        await caroselService.createCarosel(formData);
        toast.success("Đã tạo carousel");
      }

      dispatch(getCarosel() as any);
      setOpen(false);
      resetForm();
    } catch (err) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await caroselService.deleteCarosel(id);
      toast.success("Đã xóa carousel");
      dispatch(getCarosel() as any);
    } catch (err) {
      toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Quản lý Carousel</h1>

        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex gap-1">
              <Plus className="h-4 w-4" />
              Thêm Carousel
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCarosel ? "Sửa Carousel" : "Thêm mới Carousel"}
              </DialogTitle>
              <DialogDescription>Upload hình ảnh carousel</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {preview && (
                <img
                  src={preview}
                  className="w-full h-[160px] object-cover rounded border"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setImageFile(file);
                  setPreview(URL.createObjectURL(file));
                }}
              />

              <textarea
                placeholder="Mô tả"
                className="w-full rounded border px-3 py-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Button onClick={handleSave}>
                {editingCarosel ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* TABLE */}
      <div className="rounded-xl border bg-background shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Hình ảnh</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!loading && carosels.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}

            {carosels.map((c: any) => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell>
                  <img
                    src={`${import.meta.env.VITE_SERVER_API}${c.url}`}
                    className="w-[140px] h-[70px] object-cover rounded"
                  />
                </TableCell>
                <TableCell>{c.description}</TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingCarosel(c)}>
                        Sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(c.id)}>
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
    </div>
  );
};

export default AdminCarosel;

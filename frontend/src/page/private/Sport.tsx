import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import sportService from "@/services/sportService";
import { getAllSports } from "@/stores/actions/sportAction";
import { MoreHorizontal, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Sport = () => {
  const dispatch = useDispatch();
  const { sports, loading } = useSelector((state: any) => state.sports);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSport, setEditingSport] = useState<any>(null);
  const [name, setName] = useState("");
  useEffect(() => {
    dispatch(getAllSports() as any);
  }, [dispatch]);

  const resetForm = () => {
    setName("");
    setEditingSport(null);
  };

  console.log(sports);

  useEffect(() => {
    if (editingSport) {
      setName(editingSport.name);
      setIsModalOpen(true);
    }
  }, [editingSport]);

  const handleSave = async () => {
    try {
      if (editingSport) {
        await sportService.updateSport(editingSport.id, { name });
        toast.success("Đã cập nhật môn thể thao");
      } else {
        await sportService.createSport({ name });
        toast.success("Đã tạo môn thể thao");
      }
    } catch (error) {
      toast.error(
        `Không thể ${editingSport ? "cập nhật" : "tạo"} môn thể thao`
      );
    }
    setIsModalOpen(false);
    resetForm();
    dispatch(getAllSports() as any);
  };

  const handleDelete = async (id: number) => {
    try {
      await sportService.deleteSport(id);
      toast.success("Đã xóa môn thể thao");
    } catch (error) {
      toast.error("Không thể xóa môn thể thao");
    }
    dispatch(getAllSports() as any);
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Quản lý danh mục</h1>
        </div>

        <div className="flex justify-between">
          <div></div>
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
                Thêm môn thể thao
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingSport ? "Sửa môn thể thao" : "Thêm môn thể thao"}
                </DialogTitle>
                <DialogDescription>
                  Nhập thông tin để lưu vào hệ thống
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Tên môn thể thao</Label>
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
                  {editingSport ? "Cập nhật" : "Thêm"}
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
                  <TableHead>Tên</TableHead>
                  <TableHead className="w-[150px] text-center">
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {!loading && sports?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}

                {sports?.map((sport: any) => (
                  <TableRow key={sport.id}>
                    <TableCell className="text-center">{sport.id}</TableCell>
                    <TableCell>{sport.name}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setEditingSport(sport)}
                          >
                            Sửa
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleDelete(sport.id)}
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
      </div>
    </div>
  );
};

export default Sport;

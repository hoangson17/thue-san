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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import courtTypeService from "@/services/courtTypeService";
import { getAllCourtTypes } from "@/stores/actions/courtTypeAction";
import { getAllSports } from "@/stores/actions/sportAction";
import { MoreHorizontal, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const CourtTypes = () => {
  const dispatch = useDispatch();
  const { courtTypes, loading } = useSelector((state: any) => state.courtTypes);
  const { sports } = useSelector((state: any) => state.sports);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingCourtType, setIsEditingCourtType] = useState<any>(null);

  const [name, setName] = useState("");
  const [id, setId] = useState(0);
  const [sportId, setSportId] = useState(0);

  const resetForm = () => {
    setName("");
    setSportId(0);
    setIsEditingCourtType(null);
  };

  useEffect(() => {
    if (isEditingCourtType) {
      setName(isEditingCourtType.name);
      setSportId(isEditingCourtType.sport_id.id);
      setId(isEditingCourtType.id);
      setIsModalOpen(true);
    }
  }, [isEditingCourtType]);

  const handleSave = async () => {
    try {
      if (isEditingCourtType) {
        await courtTypeService.update(isEditingCourtType.id, {
          name,
          sport_id: sportId,
        });
        toast.success("Đã cập nhật loại sân");
      } else {
        await courtTypeService.create({
          name,
          sport_id: sportId,
        });
        toast.success("Đã tạo loại sân");
      }

      dispatch(getAllCourtTypes() as any);
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(
        `Không thể ${isEditingCourtType ? "cập nhật" : "tạo"} loại sân`
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await courtTypeService.delete(id);
      toast.success("Đã xóa loại sân");
    } catch (error) {
      toast.error("Không thể xóa loại sân");
    }
    dispatch(getAllCourtTypes() as any);
  };

  useEffect(() => {
    dispatch(getAllCourtTypes() as any);
    dispatch(getAllSports() as any);
  }, [dispatch]);

  // console.log(courtTypes);
  console.log(sports);

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
                  {isEditingCourtType
                    ? "Sửa môn thể thao"
                    : "Thêm môn thể thao"}
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
                <div className="flex flex-col gap-2 w-full">
                  <Label>Loại sân</Label>
                  <Select
                    value={sportId ? sportId.toString() : ""}
                    onValueChange={(value) => setSportId(Number(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn loại sân" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {sports?.map((sport: any) => (
                        <SelectItem key={sport.id} value={sport.id.toString()}>
                          {sport.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSave} disabled={!name.trim()}>
                  {isEditingCourtType ? "Cập nhật" : "Thêm"}
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
                  <TableHead>Loại sân</TableHead>
                  <TableHead className="w-[150px] text-center">
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {!loading && courtTypes?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}

                {courtTypes?.map((type: any) => (
                  <TableRow key={type.id}>
                    <TableCell className="text-center">{type.id}</TableCell>
                    <TableCell>{type.name}</TableCell>
                    <TableCell>{type.sport_id.name}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setIsEditingCourtType(type)}
                          >
                            Sửa
                          </DropdownMenuItem>

                          <DropdownMenuItem
                          // onClick={() => handleDelete(sport.id)}
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

export default CourtTypes;

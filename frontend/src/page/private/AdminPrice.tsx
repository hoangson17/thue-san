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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { priceService } from "@/services/priceService";
import { toast } from "sonner";
import { getCourts } from "@/stores/actions/courtActions";

const AdminPrice = () => {
  const dispatch = useDispatch();
  const { prices, loading, pagination } = useSelector(
    (state: any) => state.prices
  );
  const { courts } = useSelector((state: any) => state.courts);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<any>(null);

  const [dayType, setDayType] = useState("weekday");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState(0);
  const [selectedCourts, setSelectedCourts] = useState<number[]>([]);

  const resetForm = () => {
    setDayType("weekday");
    setStartTime("");
    setEndTime("");
    setPrice(0);
    setSelectedCourts([]);
    setEditingPrice(null);
  };

  useEffect(() => {
    if (editingPrice) {
      setDayType(editingPrice.dayType);
      setStartTime(editingPrice.timeStart);
      setEndTime(editingPrice.timeEnd);
      setPrice(editingPrice.price_per_hour);
      setSelectedCourts(editingPrice.court?.map((c: any) => c.id) || []);
      setIsModalOpen(true);
    }
  }, [editingPrice]);

  useEffect(() => {
    dispatch(getPrices(page, search) as any);
    dispatch(getCourts(page, search) as any);
  }, [dispatch, page, search]);

  // console.log(prices);

  const handleSave = async () => {
    const data = {
      dayType,
      timeStart: startTime,
      timeEnd: endTime,
      price_per_hour: price,
      court: selectedCourts,
    };

    try {
      if (editingPrice) {
        await priceService.updatePrice(editingPrice.id, data);
        toast.success("Đã cập nhật bảng giá");
      } else {
        await priceService.createPrice(data);
        toast.success("Đã tạo bảng giá");
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    }

    setIsModalOpen(false);
    resetForm();
    dispatch(getPrices(page, search) as any);
  };

  const handleDelete = async (id: number) => {
    try {
      await priceService.deletePrice(id);
      toast.success("Đã xóa bảng giá");
    } catch (error) {
      toast.error("Không thể xóa bảng giá");
    }
    dispatch(getPrices(page, search) as any);
  };

  // console.log(courts);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Quản lý bảng giá</h1>
      </div>

      <div className="flex justify-between">
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
        <div>
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
                Thêm bảng giá
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingPrice ? "Sửa bảng giá" : "Thêm bảng giá"}
                </DialogTitle>
                <DialogDescription>Nhập dữ liệu bảng giá</DialogDescription>
              </DialogHeader>
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="dayType">Loại ngày</label>
                    <select
                      name="dayType"
                      id="dayType"
                      value={dayType}
                      onChange={(e) => setDayType(e.target.value)}
                      className="border rounded-md px-2 py-1"
                    >
                      <option value="weekday">Ngày thường</option>
                      <option value="weekend">Cuối tuần</option>
                    </select>
                  </div>
                  <div className="flex flex-col col-span-2">
                    <label htmlFor="court">Sân áp dụng</label>
                    <select
                      multiple
                      className="border rounded-md px-2 py-1"
                      value={selectedCourts.map(String)}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions).map(
                          (opt) => Number(opt.value)
                        );
                        setSelectedCourts(values);
                      }}
                    >
                      {courts?.data?.map((court: any) => (
                        <option key={court.id} value={court.id}>
                          {court.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="timeStart">Giờ bắt đầu</label>
                    <input
                      type="text"
                      name="timeStart"
                      id="timeStart"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="border rounded-md px-2 py-1"
                      placeholder="1:00"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="timeEnd">Giờ kết thúc</label>
                    <input
                      type="text"
                      name="timeEnd"
                      id="timeEnd"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="border rounded-md px-2 py-1"
                      placeholder="1:00"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="price_per_hour">Giá</label>
                    <input
                      type="number"
                      name="price_per_hour"
                      id="price_per_hour"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="border rounded-md px-2 py-1"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Hủy
                  </Button>
                </DialogClose>
                <Button onClick={handleSave}>
                  {editingPrice ? "Sửa bảng giá" : "Tạo bảng giá"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
                <TableHead className="">Giá / giờ</TableHead>
                <TableHead className="w-[250px] ">Sân</TableHead>
                <TableHead className="w-[120px] text-center">
                  Hành động
                </TableHead>
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
                    {price.dayType === "weekday" ? "Ngày thường" : "Cuối tuần"}
                  </TableCell>

                  <TableCell>
                    {price.timeStart} - {price.timeEnd}
                  </TableCell>

                  <TableCell className=" font-semibold">
                    {price.price_per_hour.toLocaleString()} đ
                  </TableCell>
                  <TableCell>
                    {price.court?.map((c: any) => c.name).join(", ")}
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
                          onClick={() => setEditingPrice(price)}
                        >
                          Sửa
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(price.id)}
                        >
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

      {prices?.pagination?.totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && setPage(page - 1)}
              />
            </PaginationItem>

            {Array.from({ length: prices?.pagination?.totalPages }).map((_, index) => {
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

import { getAllUsers } from "@/stores/actions/authActions";
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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Ban, MoreHorizontal } from "lucide-react";
import formatImg from "@/utils/fomatImg";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { getUsers, loading } = useSelector((state: any) => state.users);
  const { user: currentUser } = useSelector((state: any) => state.auth);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string | undefined>(undefined);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    dispatch(
      getAllUsers({
        page,
        search,
        role,
        order: "DESC",
      }) as any
    );
  }, [dispatch, page, search, role]);
  console.log(getUsers);

  const users = getUsers || [];
  const pagination = getUsers?.pagination;

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await authService.lockUser(selectedUser.id);
      toast.success("Khóa người dùng thành công");
    } catch (error) {
      toast.error("Khóa người dùng thất bại");
    }

    dispatch(
      getAllUsers({
        page,
        search,
        role,
        order: "DESC",
      }) as any
    );

    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Danh sách người dùng</h1>
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <Input
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-[260px]"
          />

          <Select
            value={role}
            onValueChange={(v) => {
              setPage(1);
              setRole(v === "all" ? undefined : v);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tất cả role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Link to={'/admin/users-locked'} ><Button>User đã khóa</Button></Link>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-xl border bg-background shadow-sm">
        <div className="h-[450px] overflow-auto">
          <Table className="w-full table-fixed">
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow className="bg-muted/50">
                <TableHead className="w-[60px] text-center">ID</TableHead>
                <TableHead className="w-[80px] text-center">Avatar</TableHead>
                <TableHead className="w-[220px]">Tên</TableHead>
                <TableHead className="w-[220px]">Email</TableHead>
                <TableHead className="w-[120px]">Role</TableHead>
                <TableHead className="w-[140px]">Ngày tạo</TableHead>
                <TableHead className="w-[100px] text-center">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!loading && users.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-muted-foreground"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}

              {users.map((user: any) => {
                const isSelf = currentUser?.id === user.id;

                return (
                  <TableRow
                    key={user.id}
                    className="transition hover:bg-muted/40"
                  >
                    <TableCell className="text-center">{user.id}</TableCell>

                    <TableCell className="text-center">
                      <Avatar className="mx-auto h-9 w-9">
                        <AvatarImage src={user?.avatar && formatImg(user?.avatar) || ""} />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TableCell>

                    <TableCell className="truncate font-medium">
                      {user.name}
                    </TableCell>

                    <TableCell className="truncate text-muted-foreground">
                      {user.email}
                    </TableCell>

                    <TableCell className="text-center">
                      <Select
                        value={user.role}
                        disabled={isSelf}
                        onValueChange={async (v) => {
                          if (v === user.role) return;
                          try {
                            (await authService.updateRole(user.id, v)) as any;
                            toast.success("Thêm sửa quyền thành công");
                          } catch (error) {
                            toast.error("Không thể sửa quyền");
                          }
                          dispatch(
                            getAllUsers({
                              page,
                              search,
                              role,
                              order: "DESC",
                            }) as any
                          );
                        }}
                      >
                        <SelectTrigger className="w-[90px]">
                          <SelectValue placeholder="Chọn role" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>

                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          {!isSelf ? (
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button variant="ghost" disabled size="icon">
                              <MoreHorizontal className="h-4 w-4 cursor-not-allowed" />
                            </Button>
                          )}
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          {!isSelf && user.role !== "admin" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    setSelectedUser(user);
                                  }}
                                >
                                  <Ban color="red" /> Khóa tài khoản
                                </DropdownMenuItem>
                              </AlertDialogTrigger>

                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Xác nhận khóa
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc chắn muốn Khóa{" "}
                                    <b>{user.name}</b>?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive"
                                    onClick={handleDeleteUser}
                                  >
                                    Khóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
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
      {pagination?.totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && setPage(page - 1)}
              />
            </PaginationItem>

            {Array.from({ length: pagination.totalPages }).map((_, i) => {
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

export default AdminUsers;

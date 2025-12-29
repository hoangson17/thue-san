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
import { Badge } from "@/components/ui/badge";

const AdminUsers = () => {
  const { getUsers } = useSelector((state: any) => state.users);
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAllUsers(page) as any);
  }, [dispatch, page]);

  console.log(getUsers);

  const users = getUsers?.data || [];
  const pagination = getUsers?.pagination;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Danh sách người dùng</h1>
      <div className="rounded-xl border bg-background shadow-sm">
        <div className="h-[450px] overflow-auto">
          <Table className="table-fixed w-full">
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow className="bg-muted/50">
                <TableHead className="w-[60px] text-center">ID</TableHead>
                <TableHead className="w-[80px] text-center">Avatar</TableHead>
                <TableHead className="w-[220px]">Tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-[120px] text-center">Role</TableHead>
                <TableHead className="w-[140px]">Ngày tạo</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-muted-foreground"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}

              {users.map((user: any) => (
                <TableRow
                  key={user.id}
                  className="transition hover:bg-muted/40"
                >
                  <TableCell className="w-[60px] text-center">
                    {user.id}
                  </TableCell>

                  <TableCell className="w-[80px] text-center">
                    <Avatar className="mx-auto h-9 w-9">
                      <AvatarImage src={user.avatar || ""} />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell className="w-[220px] truncate font-medium">
                    {user.name}
                  </TableCell>

                  <TableCell className="truncate text-muted-foreground">
                    {user.email}
                  </TableCell>

                  <TableCell className="w-[120px] text-center">
                    <Badge
                      variant={
                        user.role === "admin" ? "destructive" : "secondary"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>

                  <TableCell className="w-[140px] text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* PAGINATION */}
      {pagination && (
        <Pagination className="mt-6">
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

export default AdminUsers;

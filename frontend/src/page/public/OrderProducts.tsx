import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CreditCard, Calendar } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getOrders } from "@/stores/actions/orderActions";

const OrderProducts = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state: any) => state.orders);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getOrders(page, "desc") as any);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, page]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-muted-foreground animate-pulse">
        <div className="flex flex-col items-center gap-2">
          <Box className="h-8 w-8 animate-bounce" />
          <p>Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  const totalPages = orders?.pagination?.totalPages || 0;

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-16 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-3 text-primary">
          <Box className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Đơn hàng của tôi</h1>
          <p className="text-sm text-muted-foreground">Theo dõi lịch sử mua hàng</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders?.data?.length > 0 ? (
          orders.data.map((order: any) => (
            <Card key={order.id} className="transition-all hover:shadow-md border-muted/60">
              <CardHeader className="pb-3 flex flex-row items-start justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                    Mã đơn hàng
                  </p>
                  <CardTitle className="text-base font-mono">#{order.id}</CardTitle>
                </div>

                <div className="text-right space-y-2">
                  <p className="text-lg font-bold text-primary">
                    {order.total_price.toLocaleString()} ₫
                  </p>
                  <Badge variant="outline" className="capitalize">
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-muted/30">
                  {order.items.map((item: any, index: number) => (
                    <React.Fragment key={item.id}>
                      <div className="flex items-center justify-between px-4 py-3 text-sm">
                        <span className="text-muted-foreground">
                          {item.product.name} 
                          <span className="ml-2 font-semibold text-foreground">× {item.quantity}</span>
                        </span>
                        <span className="font-medium">{item.price.toLocaleString()} ₫</span>
                      </div>
                      {index < order.items.length - 1 && <Separator />}
                    </React.Fragment>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5" />
                    Thanh toán: <span className="text-foreground">{order.payment_method}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Ngày đặt: <span className="text-foreground">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString("vi-VN") : "--"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="flex flex-col items-center py-20 text-muted-foreground">
             <Box className="h-12 w-12 mb-4 opacity-20" />
             <p>Bạn chưa có đơn hàng nào</p>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    href="#"
                    isActive={page === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(i + 1);
                    }}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage(page + 1);
                  }}
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default OrderProducts;
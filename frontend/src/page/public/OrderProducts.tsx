import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getOrders } from "@/stores/actions/orderActions";
import {
  Box,
  DollarSign,
  CreditCard,
  Calendar,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const OrderProducts = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state: any) => state.orders);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getOrders(page, "desc") as any);
  }, [dispatch, page]);

  if (loading) {
    return (
      <div className="py-24 text-center text-muted-foreground animate-pulse">
        Đang tải đơn hàng...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-16 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center gap-1">
        <div className="rounded-xl bg-primary/10 p-3 text-primary">
          <Box className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Đơn hàng của tôi</h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi lịch sử mua hàng
          </p>
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {orders?.data?.length > 0 ? (
          orders.data.map((order: any) => (
            <Card
              key={order.id}
              className="transition hover:shadow-lg gap-2"
            >
              {/* Header */}
              <CardHeader className="pb-3 flex flex-row items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Mã đơn hàng
                  </p>
                  <CardTitle className="text-base">
                    #{order.id}
                  </CardTitle>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-lg font-semibold">
                    {order.total_price.toLocaleString()} ₫
                  </p>
                  <Badge variant="secondary">{order.status}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                {/* Items */}
                <div className="rounded-lg border">
                  {order.items.map((item: any, index: number) => (
                    <React.Fragment key={item.id}>
                      <div className="flex items-center justify-between px-4 py-3 text-sm">
                        <span className="text-muted-foreground">
                          {item.product.name} ×{" "}
                          <span className="font-medium text-foreground">
                            {item.quantity}
                          </span>
                        </span>

                        <span className="font-medium">
                          {item.price.toLocaleString()} ₫
                        </span>
                      </div>
                      {index < order.items.length - 1 && (
                        <Separator />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {order.payment_method}
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString(
                          "vi-VN"
                        )
                      : "--"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="py-16 text-center text-muted-foreground">
            Bạn chưa có đơn hàng nào
          </Card>
        )}
      </div>

      {/* Pagination */}
      {orders?.pagination?.totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage(page - 1)}
                />
              </PaginationItem>

              {Array.from({
                length: orders.pagination.totalPages,
              }).map((_, index) => {
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
                    page < orders.pagination.totalPages &&
                    setPage(page + 1)
                  }
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

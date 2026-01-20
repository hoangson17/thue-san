import AxiosInstance from "@/axiosConfig";

export const orderService = {
  checkout: (paymentMethod: string) => {
    return AxiosInstance.post(
      "/orders/checkout",
      {
        payment_method: paymentMethod,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
  },
  buyNow: ({
    productId,
    quantity,
    paymentMethod,
  }: {
    productId: number;
    quantity: number;
    paymentMethod: string;
  }) => {
    return AxiosInstance.post(
      "/orders/buy-now",
      {
        productId,
        quantity,
        paymentMethod,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      },
    );
  },

  findAll: (page?: number, limit?: number, order?: string, search?: string) => {
    return AxiosInstance.get("/orders", {
      params: {
        page,
        limit,
        order,
        search,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  },
};

import { ProductItem } from "@/components";
import {
  getProducts,
  getProductsByCategory,
} from "@/stores/actions/productActions";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Store = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const { products, productsByCategory } = useSelector(
    (state: any) => state.products
  );

  const params = new URLSearchParams(location.search);
  const category = params.get("category") || "";
  console.log(category);

  useEffect(() => {
    dispatch(getProducts(page, category) as any);
  }, [category, dispatch, page]);
  const handleCategoryChange = (category: string) => {
    navigate(`/products?category=${category}`);
  };
  console.log(products.data);

  const categories = [
    { label: "Nước", value: "nước" },
    { label: "Bánh", value: "snack" },
    { label: "Vợt", value: "vợt" },
  ];

  return (
    <div className="px-16 py-7 max-w-7xl mx-auto">
      <div>
        <NavigationMenu className="mb-5">
          <NavigationMenuList className="flex gap-2 bg-white border rounded-xl p-1 shadow-sm">
            <NavigationMenuItem>
              <NavigationMenuLink
                className="px-4 py-2 rounded-lg font-medium cursor-pointer transition-all"
                onClick={() => navigate("/products")}
              >
                All
              </NavigationMenuLink>
            </NavigationMenuItem>
            {categories.map((cat) => {
              const active = category === cat.value;
              return (
                <NavigationMenuItem key={cat.value}>
                  <NavigationMenuLink
                    onClick={() => handleCategoryChange(cat.value)}
                    className={`
                  px-4 py-2 rounded-lg font-medium cursor-pointer transition-all
                  ${
                    active
                      ? "bg-black text-white shadow"
                      : "text-gray-600 hover:text-black hover:shadow-600"
                  }
                `}
                  >
                    {cat.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
          {Array.isArray(products?.data) &&
            products.data.map((product: any) => (
              <ProductItem key={product.id} item={product} />
            ))}
        </div>
      </div>
      <div className="mt-[40px]">
        {products.pagination && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage(page - 1)}
                />
              </PaginationItem>

              {Array.from({ length: products.pagination.totalPages }).map(
                (_, index) => {
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
                }
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    page < products.pagination.totalPages && setPage(page + 1)
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default Store;

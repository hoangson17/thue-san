import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Filter, ChevronDown } from "lucide-react";

import { ProductItem } from "@/components";
import { getProducts } from "@/stores/actions/productActions";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getAllCategories } from "@/stores/actions/categoriesActions";
import { orderService } from "@/services/orderService";

const Store = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [page, setPage] = useState(1);
  const [openFilter, setOpenFilter] = useState(
    window.innerWidth >= 768
  );

  const { products } = useSelector((state: any) => state.products);
  const { categories } = useSelector((state: any) => state.categories);

  const params = new URLSearchParams(location.search);
  const category = params.get("category") || "";

  useEffect(() => {
    dispatch(getProducts(page, category) as any);
    dispatch(getAllCategories() as any);
  }, [dispatch, page, category]);

  const handleCategoryChange = (value?: string) => {
    setPage(1);
    if (value) {
      navigate(`/products?category=${value}`);
    } else {
      navigate("/products");
    }
    setOpenFilter(false);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <div className="max-w-7xl mx-auto px-6 md:px-16 py-8">
      {/*   FILTER TOGGLE  */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sản phẩm</h1>

        <button
          onClick={() => setOpenFilter(!openFilter)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full
            text-sm font-medium border transition-all
            ${
              openFilter
                ? "bg-black text-white shadow"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }
            focus:outline-none focus:ring-0
          `}
        >
          <Filter className="h-4 w-4" />
          Bộ lọc
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              openFilter ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* FILTER*/}
      <div
        className={`
          origin-top transition-all duration-300 ease-out overflow-hidden
          ${
            openFilter
              ? "max-h-[200px] opacity-100 scale-y-100"
              : "max-h-0 opacity-0 scale-y-95 pointer-events-none"
          }
        `}
      >
        <div className="mb-8 flex flex-wrap gap-3 rounded-2xl border bg-white/70 backdrop-blur-md p-4 shadow-sm">
          {/* ALL */}
          <button
            onClick={() => handleCategoryChange()}
            className={`
              px-6 py-2.5 rounded-full text-sm font-semibold transition-all
              ${
                !category
                  ? "bg-black text-white shadow-md scale-105"
                  : "text-gray-600 hover:bg-black/5 hover:scale-105"
              }
              focus:outline-none focus:ring-0
            `}
          >
            Tất cả
          </button>

          {categories?.map((cat:any) => {
            const active = category === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.name)}
                className={`
                  px-6 py-2.5 rounded-full text-sm font-semibold transition-all
                  ${
                    active
                      ? "bg-black text-white shadow-md scale-105"
                      : "text-gray-600 hover:bg-black/5 hover:scale-105"
                  }
                  focus:outline-none focus:ring-0
                `}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== PRODUCT GRID ===== */}
      {Array.isArray(products?.data) && products.data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.data.map((product: any) => (
            <ProductItem key={product.id} item={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-500">
          <p className="text-lg font-medium">Không có sản phẩm</p>
          <p className="text-sm mt-2">Hãy thử chọn danh mục khác</p>
        </div>
      )}

      {/* ===== PAGINATION ===== */}
      {products?.pagination && products.pagination.totalPages > 1 && (
        <Pagination className="mt-10">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && handlePageChange(page - 1)}
              />
            </PaginationItem>

            {Array.from(
              { length: products.pagination.totalPages },
              (_, i) => i + 1
            ).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={page === p}
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  page < products.pagination.totalPages &&
                  handlePageChange(page + 1)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Store;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Filter, ChevronDown, PackageSearch } from "lucide-react";

import { ProductItem } from "@/components";
import { getProducts } from "@/stores/actions/productActions";
import { getAllCategories } from "@/stores/actions/categoriesActions";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const Store = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Đồng bộ Page và Category trực tiếp từ URL
  const searchParams = new URLSearchParams(location.search);
  const categoryQuery = searchParams.get("category") || "";
  const pageQuery = parseInt(searchParams.get("page") || "1");

  const [openFilter, setOpenFilter] = useState(window.innerWidth >= 768);
  
  // Lấy dữ liệu từ Redux
  const { products, isLoading } = useSelector((state: any) => state.products);
  const { categories } = useSelector((state: any) => state.categories);

  useEffect(() => {
    // Mỗi khi URL thay đổi (page hoặc category), fetch lại dữ liệu
    dispatch(getProducts(pageQuery, categoryQuery) as any);
    dispatch(getAllCategories() as any);
  }, [dispatch, pageQuery, categoryQuery]);

  // 2. Xử lý chuyển danh mục
  const handleCategoryChange = (value?: string) => {
    const params = new URLSearchParams();
    if (value) params.set("category", value);
    params.set("page", "1"); // Luôn reset về trang 1 khi đổi loại sản phẩm
    navigate(`/products?${params.toString()}`);
    
    if (window.innerWidth < 768) setOpenFilter(false);
  };

  // 3. Xử lý chuyển trang
  const handlePageChange = (p: number) => {
    if (p < 1 || p > products?.pagination?.totalPages) return;
    const params = new URLSearchParams(location.search);
    params.set("page", p.toString());
    navigate(`/products?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 min-h-screen">
      {/* HEADER & FILTER TOGGLE */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cửa hàng</h1>
        </div>

        <button
          onClick={() => setOpenFilter(!openFilter)}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-full
            text-sm font-medium border transition-all duration-300
            ${openFilter ? "bg-black text-white shadow-lg" : "bg-white text-gray-700 hover:border-black"}
          `}
        >
          <Filter className="h-4 w-4" />
          Bộ lọc
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openFilter ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* CATEGORY FILTER BOX */}
      <div className={`
          transition-all duration-500 ease-in-out overflow-hidden
          ${openFilter ? "max-h-[500px] opacity-100 mb-10" : "max-h-0 opacity-0 pointer-events-none"}
        `}>
        <div className="flex flex-wrap gap-3 p-1">
          <button
            onClick={() => handleCategoryChange()}
            className={`px-6 py-2 rounded-full text-sm font-medium border transition-all
              ${!categoryQuery ? "bg-black text-white border-black" : "bg-white text-gray-600 hover:border-gray-400"}`}
          >
            Tất cả sản phẩm
          </button>
          {categories?.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.name)}
              className={`px-6 py-2 rounded-full text-sm font-medium border transition-all
                ${categoryQuery === cat.name ? "bg-black text-white border-black" : "bg-white text-gray-600 hover:border-gray-400"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        </div>
      ) : products?.data?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.data.map((product: any) => (
            <ProductItem key={product.id} item={product} />
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl bg-gray-50/50">
          <PackageSearch className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-lg font-medium text-gray-900">Rất tiếc, không tìm thấy sản phẩm</p>
          <p className="text-sm text-gray-500 mt-1">Vui lòng thử chọn danh mục khác hoặc quay lại sau.</p>
        </div>
      )}

      {/* PAGINATION */}
      {!isLoading && products?.pagination?.totalPages > 1 && (
        <div className="mt-16 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  className="cursor-pointer" 
                  onClick={() => handlePageChange(pageQuery - 1)} 
                />
              </PaginationItem>

              {/* Logic hiển thị số trang cơ bản */}
              {[...Array(products.pagination.totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <PaginationItem key={pageNum} className="hidden sm:block">
                    <PaginationLink
                      isActive={pageQuery === pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext 
                  className="cursor-pointer" 
                  onClick={() => handlePageChange(pageQuery + 1)} 
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default Store;
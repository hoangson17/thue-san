import { ProductItem } from "@/components";
import {
  getProducts,
  getProductsByCategory,
} from "@/stores/actions/productActions";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const Store = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { products, productsByCategory } = useSelector(
    (state: any) => state.products
  );

  const params = new URLSearchParams(location.search);
  const category = params.get("category");

  useEffect(() => {
    if (category) {
      dispatch(getProductsByCategory(category) as any);
    } else {
      dispatch(getProducts() as any);
    }
  }, [category, dispatch]);

  const handleCategoryChange = (category: string) => {
    navigate(`/products?category=${category}`);
  };

  const dataToRender = category ? productsByCategory : products;

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
              <NavigationMenuLink className="px-4 py-2 rounded-lg font-medium cursor-pointer transition-all" onClick={() => navigate("/products")}>All</NavigationMenuLink>
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

        <div className="grid grid-cols-4 gap-4">
          {dataToRender?.map((product: any) => (
            <ProductItem key={product.id} item={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Store;

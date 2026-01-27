import React, { useState } from "react";
import { Button } from "./ui/button";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/stores/actions/authActions";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, ShoppingCart } from "lucide-react";
import { Input } from "./ui/input";
import img3 from "@/assets/image_3.png";
import formatImg from "@/utils/fomatImg";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);

  const handleLogout = () => {
    dispatch(logout() as any);
    navigate("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  const menu = [
    { name: "Home", link: "/" },
    { name: "Giải đấu", link: "/tournaments" },
    { name: "Thuê sân", link: "/courts" },
    { name: "Cửa hàng", link: "/products" },
    { name: "Liên hệ", link: "/contact" },
  ];

  return (
    <header className="shadow-sm border-b border-gray-100 sticky top-0 left-0 right-0 bg-white z-50 w-full">
      <div className="mx-auto py-4 px-6 flex justify-between items-center max-w-7xl">
        {/* LOGO */}
        <Link to={"/"} className="flex items-center gap-4 shrink-0">
          <img src={img3} alt="Logo" className="h-10 w-auto object-contain" />
          <span className="text-2xl font-bold text-primary hidden lg:block">
            Thuê sân
          </span>
        </Link>

        {/* NAV & SEARCH */}
        <div className="flex items-center gap-8">
          <nav className="hidden xl:block">
            <ul className="flex gap-6 text-gray-700 font-medium">
              {menu.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.link}
                    className={({ isActive }) =>
                      `py-1 transition-colors hover:text-primary ${
                        isActive ? "border-b-2 border-primary text-black" : ""
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 w-64 focus-within:ring-1 focus-within:ring-primary"
          >
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm..."
              className="border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <Search className="w-5 h-5 text-gray-500" />
            </Button>
          </form>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          ) : (
            <>
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-6 h-6" />
                </Button>
              </Link>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="cursor-pointer border w-10 h-10 hover:opacity-80 transition-opacity">
                    <AvatarImage
                      src={user?.avatar && formatImg(user?.avatar)}
                    />
                    <AvatarFallback className="bg-primary text-white">
                      {user?.name?.[0].toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                {/* Dùng align="end" thay vì ml-40 để menu luôn nằm đúng dưới avatar */}
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Thông tin cá nhân</Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem asChild className="text-blue-600">
                      <Link to="/admin">Quản trị viên</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/booking-courts">Sân đã đặt</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/register-tournament">Giải đấu đã đăng kí</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/order-product">Đơn hàng</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:bg-red-50 focus:text-red-600"
                  >
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

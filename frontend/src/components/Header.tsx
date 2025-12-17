import React from "react";
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

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const menu = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Giải đấu",
      link: "/tournament",
    },
    {
      name: "Thuê sân",
      link: "/courts",
    },
    {
      name: "Cửa hàng",
      link: "/products",
    },
    {
      name: "Liên hệ",
      link: "/contact",
    }
  ]

  return (
    <header className="shadow border-gray-200 sticky top-0 left-0 right-0 bg-white z-50 w-full">
      <div className="mx-auto py-4 px-6 md:px-16 flex justify-between items-center max-w-7xl mx-auto">
        <Link to={"/"} className="flex items-center gap-4">
          <img src={img3} alt="Logo" className="h-10" />
          <span className="text-2xl font-medium">Thuê sân</span>
        </Link>

        <div className="flex items-center gap-7">
          <nav>
            <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
              {menu.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.link}
                    className={({ isActive }) =>
                      `py-[3px] rounded-none ${
                        isActive ? "border-gray-600 border-b-3" : ""
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

          </nav>

          <div className="hidden md:flex items-center rounded-full border border-gray-20 w-70">
            <Input
              placeholder="Search..."
              className="w-full border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              type="text"
            />
            <Button className="px-4 py-2 rounded-full cursor-pointer">
              <Search className="w-6 h-9" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <Button className="px-4 py-2 rounded cursor-pointer">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="px-4 py-2 rounded cursor-pointer">
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <>
              <div>
                <Link to="/cart">
                  <Button className="px-4 py-2 text-center rounded cursor-pointer">
                    <ShoppingCart className="w-6 h-9" />
                  </Button>
                </Link>
              </div>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="cursor-pointer w-10 h-10">
                    <AvatarImage src={user?.avatar || ""} />
                    <AvatarFallback>
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48 ml-35" sideOffset={5}>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Setting</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/team">Team</Link>
                  </DropdownMenuItem>
                  {
                    user?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Admin</Link>
                      </DropdownMenuItem>
                    )
                  }
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="font-medium text-gray-700 hidden md:block">
                {user?.name}
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

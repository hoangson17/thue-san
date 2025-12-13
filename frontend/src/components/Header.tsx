import React from "react";
import logo from "@/assets/react.svg";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
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
import { ShoppingCart } from "lucide-react";

const Header = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="shadow border-gray-200 sticky top-0 left-0 right-0 bg-white z-50 w-full">
      <div className="mx-auto py-4 px-6 md:px-16 flex justify-between items-center">
        
        <Link to={"/"}>
          <img src={logo} alt="Logo" className="h-10" />
        </Link>

        <nav>
          <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/products">Cửa Hàng</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <Button className="px-4 py-2 rounded cursor-pointer">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="px-4 py-2 rounded cursor-pointer">Register</Button>
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

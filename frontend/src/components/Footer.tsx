import { Facebook, Send, Youtube } from "lucide-react";
import logo from "@/assets/image_3.png";
import React from "react";

const Footer = () => {
  return (
    <footer className="mt-10 px-16 py-5 max-w-7xl mx-auto">
      <div className="container mx-auto ">
        
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1 h-px bg-gray-300" />
          <img src={logo} alt="logo" className="h-20" />
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <div className="flex gap-4">
              <Facebook className="h-6" />
              <Youtube className="h-6" />
            </div>
            <p className="text-sm text-gray-700">
              © 2025 PickleballPlus, All Rights Reserved.
            </p>
          </div>

          {/* MIDDLE */}
          <div className="space-y-2">
            <p>Giải đấu</p>
            <p>Vận động viên</p>
            <p>Cẩm nang</p>
            <p>Shop</p>
            <p>Liên hệ</p>
          </div>

          {/* RIGHT */}
          <div className="space-y-3">
            <p className="font-semibold text-lg">Đăng ký nhận tin mới nhất</p>

            <div className="flex">
              <input
                type="text"
                placeholder="Nhập email"
                className="border border-gray-300 px-3 py-2 flex-1 rounded-l"
              />
              <button className="bg-blue-700 text-white px-4 rounded-r cursor-pointer">
                <Send />
              </button> 
            </div>

            <p className="font-medium">
              Liên hệ hotline: <span className="font-bold">036 3593095</span>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;

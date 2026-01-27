import React from "react";
import { Link } from "react-router-dom";
import defaultImg from "../assets/image_3.png";
import { IconMedal } from "@tabler/icons-react";

const TournamentItem = ({ item }: any) => {
  const imageUrl = item.images?.[0]?.url
    ? `${import.meta.env.VITE_SERVER_API}${item.images[0].url}`
    : defaultImg;

  // Format tiền nhanh gọn
  const price = item.price?.toLocaleString("vi-VN");

  return (
    <Link 
      to={`/tournaments/${item.id}`} 
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
          <span className="text-xs font-bold text-red-600 flex items-center gap-1"><IconMedal /><span> {price}đ</span></span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 line-clamp-1 transition-colors">
          {item?.name}
        </h3>
        
        <p className="text-sm text-gray-500 mt-1 font-medium line-clamp-1">
          {item?.introduce}
        </p>

        <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed">
          {item?.description}
        </p>
      </div>
    </Link>
  );
};

export default TournamentItem;
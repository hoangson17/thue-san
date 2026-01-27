import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const CourtItem = ({ item }: any) => {
  const imageUrl = item.images?.length > 0 
    ? `${import.meta.env.VITE_SERVER_API}${item.images[0].url}` 
    : "https://images.unsplash.com/photo-1595435064219-c92c3a528347?q=80&w=800&auto=format&fit=crop";

  return (
    <Link to={`/courts/${item.id}`} className="block">
      <div className="group relative flex flex-col h-full overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-md hover:border-zinc-300">
        
        {/* Hình ảnh */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Badge loại thể thao - Nhỏ gọn ở góc */}
          <div className="absolute top-2 left-2">
            <span className="bg-white/90 backdrop-blur-sm border border-zinc-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-zinc-800">
              {item?.court_type.sport_id?.name || "Sport"}
            </span>
          </div>
        </div>

        {/* Nội dung */}
        <div className="flex flex-col flex-grow p-4">
          <div className="mb-2">
            <h3 className="text-base font-bold text-zinc-900 line-clamp-1  transition-colors">
              {item.name}
            </h3>
            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
              {item?.court_type.name}
            </span>
          </div>

          <div className="mt-auto flex items-start gap-1.5 text-zinc-400">
            <MapPin size={14} className="mt-0.5 shrink-0" />
            <p className="text-sm line-clamp-1 italic font-light">
              {item?.note || "Chưa có địa chỉ cụ thể"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourtItem;
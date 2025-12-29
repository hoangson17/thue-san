import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Link } from "react-router-dom";
import img from "../assets/image_3.png";

const TournamentItem = ({ item }: any) => {
  return (
    <Card className="overflow-hidden">
      <Link className="flex flex-col gap-2" to={`/tournaments/${item.id}`}>
        <CardHeader className="">
          <CardTitle>{item?.name}</CardTitle>
          {item.images?.length > 0 ? (
            <img
              src={`${import.meta.env.VITE_SERVER_API}${item.images[0].url}`}
              alt={item.name}
              className="w-full h-40 object-cover rounded-md"
            />
          ) : (
            <img
              src={img}
              alt={item.name}
              className="w-full h-40 object-cover rounded-md"
            />
          )}
        </CardHeader>
        <CardContent>
          <div className="mt-2 flex flex-col gap-0.5">
            <p>{item?.introduce}</p>
            <p>Giải thưởng: {item?.price}đ</p>
            <small className="truncate w-full text-gray-500">{item?.description}</small>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default TournamentItem;

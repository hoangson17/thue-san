import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import img from "../assets/image_3.png";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const CourtItem = ({ item }: any) => {
  return (
    <Card className="overflow-hidden">
      <Link to={`/courts/${item.id}`}>
        <CardHeader>
          <CardTitle>{item.name}</CardTitle>
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
          {item.court_type && (
            <div className="flex gap-2 mt-2">
              <Badge variant="destructive" className="text-sm ">
                {item?.court_type.sport_id?.name}
              </Badge>
              <Badge variant="outline" className="text-sm">{item?.court_type.name}</Badge>
            </div>
          )}
          <p className="text-sm text-muted-foreground truncate">{item?.note}</p>
        </CardContent>
      </Link>
    </Card>
  );
};

export default CourtItem;

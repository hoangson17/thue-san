import React from "react";
import CourtItem from "./CourtItem";

const ListCourt = ({ items = [] }: any) => {
  return (
    <div>
      <div className="grid grid-cols-4 gap-5">
        {items.map((item: any) => (
          <CourtItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ListCourt;

import { ListCourt } from "@/components";
import { getCourt } from "@/stores/actions/courtActions";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Court = () => {
  const dispatch = useDispatch();
  const { courts } = useSelector((state: any) => state.courts);

  useEffect(() => {
    dispatch(getCourt() as any);
  }, [dispatch]);

  console.log(courts);

  return (
    <div className="px-16 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-10">Các sân hiện có</h1>
      <ListCourt items={courts} />
    </div>
  );
};

export default Court;

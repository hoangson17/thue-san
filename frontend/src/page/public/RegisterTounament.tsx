import { getOneUser } from "@/stores/actions/authActions";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const RegisterTounament = () => {
  const dispatch = useDispatch();
  const { userDetail } = useSelector((state: any) => state.auth);

  useEffect(() => {
    dispatch(getOneUser() as any);
  }, [dispatch]);
  console.log(userDetail);

  return (
    <div className="m-auto max-w-7xl px-16 py-10">
      <div>
        <p className="text-2xl font-bold">Giải đấu đã đăng kí</p>
      </div>
      <div className="flex flex-col gap-3">
        {userDetail?.toumaments?.map((item: any) => (
          <div key={item.id} className="grid grid-cols-5 items-center">
            <p>{item.name}</p>
            <img
              className="w-40 h-30"
              src={`${import.meta.env.VITE_SERVER_API}${item.images[0].url}`}
              alt=""
            />
            <p>{new Date(item?.start_date).toLocaleDateString("vi-VN")}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegisterTounament;

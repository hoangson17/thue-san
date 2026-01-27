import { Volleyball } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import React from "react";
import img3 from "../assets/image_3.png";
import img4 from "../assets/image_4.png";
import img5 from "../assets/1.png";
import img6 from "../assets/2.png";
import img7 from "../assets/3.png";

const HomeIntro = () => {
  return (
    <div>
      <div className="px-6 pt-16 grid md:grid-cols-3 sm:grid-cols-1 max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 text-center justify-center md:px-5 md:border-r border-gray-300 w-full">
          <img src={img3} className="w-30 m-auto" alt="" />
          <h2 className="text-3xl font-bold">Tìm kiếm vị trí sân</h2>
          <p>
            Dữ liệu sân đấu dồi dào, liên tục cập nhật, giúp bạn dễ dàng tìm
            kiếm theo khu vực mong muốn
          </p>
        </div>
        <div className="flex flex-col gap-4 text-center  md:px-5 justify-center w-full">
          <img src={img4} className="w-30 m-auto" alt="" />
          <h2 className="text-3xl font-bold">Đặt lịch online</h2>
          <p>
            Không cần đến trực tiếp, không cần gọi điện đặt lịch, bạn
            có thể đặt sân ở bất kì đâu có internet
          </p>
        </div>
        <div className="flex flex-col gap-4 text-center justify-center md:px-5 md:border-l border-gray-300 w-full">
          <Volleyball size={120} className="m-auto" />
          <h2 className="text-3xl font-bold">Tìm đối, bắt cặp đấu</h2>
          <p>
            Tìm kiếm, giao lưu các đội thi đấu, kết nối, xây dựng cộng
            đồng thể thao sôi nổi, mạnh mẽ
          </p>
        </div>
      </div>
      <div className="px-6 pt-20">
        <div className="text-center">
          <h3 className="text-xl font-medium">Liên hệ</h3>
          <h1 className="text-3xl font-bold">Nhận báo giá</h1>
          <div className="continuous-3 m-auto mt-4"></div>
        </div>
        <div className="pt-5">
          <iframe
            className="m-auto w-full md:w-[800px] h-[400px]"
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14898.999482363508!2d105.79190254211427!3d21.002661359480147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135adcaeeb3b5cf%3A0xe480873c00de7333!2sBeta%20Cinemas%20Thanh%20Xu%C3%A2n!5e0!3m2!1svi!2s!4v1765763619817!5m2!1svi!2s"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <div className="px-6 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto text-center">
          <Card className="flex flex-col justify-between">
            <CardContent className="flex flex-col gap-4">
              <img className="mx-auto" src={img5} alt="Địa chỉ" />
              <h3 className="text-2xl font-bold">Địa Chỉ</h3>
              <p className="text-muted-foreground">
                Tầng hầm B1, tòa nhà Golden West, 2 P. Lê Văn Thiêm, Nhân Chính,
                Thanh Xuân, Hà Nội 100000
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-between">
            <CardContent className="flex flex-col gap-4">
              <img className="mx-auto" src={img6} alt="Số điện thoại" />
              <h3 className="text-2xl font-bold">Số Điện Thoại</h3>
              <p className="text-muted-foreground">
                0123456789 <br /> (Hoàng Sơn)
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-between">
            <CardContent className="flex flex-col gap-4">
              <img className="mx-auto" src={img7} alt="Email" />
              <h3 className="text-2xl font-bold">Email</h3>
              <p className="text-muted-foreground">
                Vui lòng dùng biểu mẫu liên hệ ở dưới.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeIntro;

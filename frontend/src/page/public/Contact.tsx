import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";
import { supportService } from "@/services/supportService";
import { toast } from "sonner";

const Contact = () => {
  const [data, setData] = React.useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSend = async () => {
    try {
      await supportService.createSupport(data);

      toast.success("Gửi thông tin thành công");

      setData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi gửi thông tin");
    }
  };

  return (
    <div className="relative px-6 md:px-16 py-14 max-w-7xl mx-auto">
      <div className="absolute inset-0 -z-10 from-primary/5 via-transparent to-secondary/10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <h1 className="text-4xl font-bold tracking-tight">
          Liên hệ Hoàng Sơn Sport
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn về đặt sân, giải đấu và hợp tác.
          Hãy để lại thông tin, đội ngũ sẽ phản hồi sớm nhất.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="h-full rounded-2xl shadow-md hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Hotline</p>
                  <p className="text-muted-foreground">0988 888 888</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">
                    contact@hoangsonsport.vn
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Địa chỉ</p>
                  <p className="text-muted-foreground">
                    Hoàng Sơn Sport, Hà Giang
                  </p>
                </div>
              </div>

              <div className="pt-6 text-muted-foreground leading-relaxed">
                Trung Đức Sport là tổ hợp Pickleball & Bóng chuyền hiện đại,
                mang đến trải nghiệm thể thao chuyên nghiệp và thân thiện.
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="h-full rounded-2xl shadow-md hover:shadow-lg transition">
            <CardHeader>
              <CardTitle>Gửi tin nhắn cho chúng tôi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={data.phone}
                    onChange={handleChange}
                    placeholder="0xxx xxx xxx"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Nội dung</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={data.message}
                  onChange={handleChange}
                  placeholder="Bạn cần hỗ trợ về đặt sân, giải đấu hay hợp tác?"
                  rows={5}
                />
              </div>

              <Button onClick={handleSend} className="w-full gap-2 text-base">
                <Send className="w-4 h-4" />
                Gửi liên hệ
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;

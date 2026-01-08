import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import formatImg from "@/utils/fomatImg";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import { setProfile } from "@/stores/actions/authActions";

const Profile = () => {
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];    
    if (!file) return;
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);

      if (password) {
        formData.append("password", password);
      }

      if (file) {
        formData.append("file", file);
      }

      const res = await authService.updateProfile(formData);
      console.log(res);
      
      toast.success("Cập nhật thông tin thành công");

      dispatch(setProfile(res.data) as any);


    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-muted/40 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="rounded-2xl shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Trang cá nhân</CardTitle>
          </CardHeader>

          <CardContent className="pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <Avatar className="w-32 h-32">
                    <AvatarImage
                      src={preview || formatImg(user?.avatar)}
                    />
                    <AvatarFallback>
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <label className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                    <Camera className="text-white" />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>

                <p className="text-sm text-muted-foreground">
                  JPG, PNG • Tối đa 2MB
                </p>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div className="space-y-3">
                  <Label>Họ và tên</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Phone</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Email</Label>
                  <Input
                    value={user?.email || ""}
                    readOnly
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Mật khẩu mới</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="rounded-xl px-8"
                  >
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

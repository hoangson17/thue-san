import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function About() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Phần giới thiệu chính */}
        <section className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Về Chúng Tôi</h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
            Chúng tôi là một đội ngũ đam mê công nghệ, chuyên xây dựng các sản phẩm web hiện đại bằng ReactJS và shadcn/ui. 
            Sứ mệnh của chúng tôi là mang đến trải nghiệm người dùng mượt mà, đẹp mắt và dễ tùy chỉnh.
          </p>
          <div className="mt-8">
            <Button size="lg">Liên hệ ngay</Button>
          </div>
        </section>

        {/* Giá trị cốt lõi */}
        <section className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Đổi mới</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Luôn áp dụng công nghệ mới nhất để tạo ra sản phẩm vượt trội.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chất lượng</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Tập trung vào accessibility và performance cao nhất.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cộng đồng</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Hỗ trợ và chia sẻ kiến thức với cộng đồng developer.
              </CardDescription>
            </CardContent>
          </Card>
        </section>

        {/* Đội ngũ */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-10">Đội Ngũ Của Chúng Tôi</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Thành viên 1 */}
            <Card className="text-center">
              <CardContent className="pt-6">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="/avatar1.jpg" alt="Member 1" />
                  <AvatarFallback>M1</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">Nguyễn Văn A</h3>
                <p className="text-muted-foreground">Founder & CEO</p>
                <div className="mt-4 flex justify-center gap-2">
                  <Badge>React</Badge>
                  <Badge>Tailwind</Badge>
                  <Badge>shadcn/ui</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Thành viên 2 */}
            <Card className="text-center">
              <CardContent className="pt-6">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="/avatar2.jpg" alt="Member 2" />
                  <AvatarFallback>M2</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">Trần Thị B</h3>
                <p className="text-muted-foreground">Lead Designer</p>
                <div className="mt-4 flex justify-center gap-2">
                  <Badge>Figma</Badge>
                  <Badge>Tailwind</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Thành viên 3 */}
            <Card className="text-center">
              <CardContent className="pt-6">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="/avatar3.jpg" alt="Member 3" />
                  <AvatarFallback>M3</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">Lê Văn C</h3>
                <p className="text-muted-foreground">Senior Developer</p>
                <div className="mt-4 flex justify-center gap-2">
                  <Badge>Next.js</Badge>
                  <Badge>TypeScript</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
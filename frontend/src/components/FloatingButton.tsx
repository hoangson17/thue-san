import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp, MessageCircle, SendHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function FloatingButton() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {showScrollTop && (
          <Button
            size="icon"
            onClick={scrollToTop}
            className="rounded-full h-10 w-10 shadow-lg hover:scale-110 transition"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        )}

        <Button
          size="icon"
          onClick={() => setOpenChat((prev) => !prev)}
          className="rounded-full h-10 w-10 shadow-lg hover:scale-110 transition"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>

      {openChat && (
        <div className="fixed bottom-12  right-18 z-50 w-80 rounded-xl shadow-xl border-2 bg-background">
          <div className="flex items-center justify-between p-3 border-b">
            <span className="font-semibold">Hỗ trợ trực tuyến</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setOpenChat(false)}
              className="cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-60 px-2 py-3 overflow-y-scroll text-sm text-muted-foreground flex flex-col">
            <p className="px-5 py-1 bg-gray-200 rounded-full w-fit">
              Xin chào !!!
              <br />
              Bạn cần hỗ trợ gì?
            </p>
          </div>

          <div className="p-3 items-center gap-2 flex bor">
            <Input
              className="flex-1 rounded-full px-4"
              placeholder="Nhập tin nhắn..."
            />

            <Button
              size="icon"
              className="
                rounded-full
                bg-primary
                text-primary-foreground
                shadow
                hover:opacity-90
                active:scale-95
                "
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

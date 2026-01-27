import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X, Lock } from "lucide-react"; // Thêm icon Lock
import { socketClient } from "@/utils/socket";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux"; // Import useSelector
import { toast } from "sonner"; // Hoặc thư viện thông báo bạn dùng

interface Message {
  id: number;
  senderType: "user" | "admin";
  content: string;
}

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  
  // Lấy trạng thái từ Redux
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  
  const socketRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  useEffect(() => {
    // Chỉ kết nối socket nếu ĐÃ MỞ và ĐÃ ĐĂNG NHẬP
    if (!open || !isAuthenticated) return;

    const socket = socketClient.getConnection();
    if (!socket) return;
    socketRef.current = socket;

    socket.emit("user-join");

    socket.on("message-list", (msgs: Message[]) => setMessages(msgs));
    socket.on("new-message", (msg: Message) => setMessages((prev) => [...prev, msg]));
    socket.on("start-typing", () => setTyping(true));
    socket.on("stop-typing", () => setTyping(false));

    return () => {
      socket.off("message-list");
      socket.off("new-message");
      socket.off("start-typing");
      socket.off("stop-typing");
    };
  }, [open, isAuthenticated]); // Theo dõi cả 2 trạng thái

  const handleOpenChat = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng hỗ trợ!");
      return;
    }
    setOpen(true);
  };

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;
    socketRef.current.emit("user-send", input.trim());
    setInput("");
    socketRef.current.emit("stop-typing");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    if (val.length > 0) {
      socketRef.current?.emit("start-typing");
    } else {
      socketRef.current?.emit("stop-typing");
    }
  };

  return (
    <>
      {/* Nút Floating Chat */}
      <Button 
        className={cn(
          "fixed bottom-6 right-6 rounded-full w-12 h-12 shadow-2xl transition-transform active:scale-90 z-50", 
          isAuthenticated ? "bg-gray-600 hover:bg-gray-700" : "bg-slate-400"
        )} 
        onClick={handleOpenChat}
      >
        {isAuthenticated ? <MessageCircle className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>
s   
      {/* Khung Chat */}
      {open && isAuthenticated && (
        <div className="fixed bottom-24 right-6 w-85 h-[500px] bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[9999]">
          <div className="p-4 bg-gray-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="font-semibold text-sm">Hỗ trợ trực tuyến</span>
            </div>
            <X className="w-5 h-5 cursor-pointer hover:bg-gray-500 rounded" onClick={() => setOpen(false)} />
          </div>

          <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-3 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={cn(
                "max-w-[85%] px-3 py-2 rounded-2xl text-sm shadow-sm", 
                m.senderType === "user" 
                  ? "ml-auto bg-gray-500 text-white rounded-tr-none" 
                  : "bg-white border text-slate-700 rounded-tl-none"
              )}>
                {m.content}
              </div>
            ))}
            {typing && (
              <div className="text-[10px] text-muted-foreground animate-pulse italic">
                Admin đang soạn văn bản...
              </div>
            )}
          </div>

          <div className="p-3 border-t bg-white flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Nhập nội dung câu hỏi..."
              className="bg-slate-50 focus-visible:ring-gray-500"
            />
            <Button onClick={sendMessage} size="icon" className="rounded-full bg-gray-600 shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
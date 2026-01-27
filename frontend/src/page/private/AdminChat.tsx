import { useEffect, useRef, useState } from "react";
import axios from "@/axiosConfig";
import { socketClient } from "@/utils/socket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Message {
  id: number;
  senderType: "user" | "admin";
  content: string;
  isRead: boolean;
  conversationId: number;
}

interface Conversation {
  id: number;
  userId: number;
  status: "waiting" | "active";
  messages: Message[];
}

export default function AdminChat() {
  const [waitingList, setWaitingList] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  
  // Khai báo kiểu Socket cụ thể để tránh lỗi 'any' hoặc 'null'
  const socketRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Hàm fetch danh sách hội thoại
  const fetchConversations = async () => {
    try {
      const res = await axios.get("admin/chat/conversations");
      setWaitingList(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách hội thoại");
    }
  };

  useEffect(() => {
    // CHẶN LOGOUT KHI F5: Kiểm tra token từ Storage trước
    const token = localStorage.getItem("accessToken");
    if (!token) return; 

    // Chỉ gọi API khi chắc chắn đã có token
    fetchConversations();
    
    // Kết nối Socket
    const socket = socketClient.getConnection();
    if (!socket) return;
    socketRef.current = socket;

    socket.emit("admin-join");

    socket.on("conversation-list", (list: Conversation[]) => {
      setWaitingList(list);
    });

    socket.on("new-waiting-conversation", (convo: Conversation) => {
      setWaitingList((prev) => {
        if (prev.find(c => c.id === convo.id)) return prev;
        return [convo, ...prev];
      });
    });

    socket.on("new-message", (msg: Message) => {
      // Cập nhật tin nhắn nếu đang mở đúng khung chat đó
      if (activeConversation?.id === msg.conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
      
      // Cập nhật lại preview/tin nhắn cuối trong danh sách bên trái
      setWaitingList((prev) =>
        prev.map((c) =>
          c.id === msg.conversationId
            ? { ...c, messages: [...(c.messages || []), msg] }
            : c
        )
      );
    });

    // Cleanup khi unmount hoặc đổi hội thoại
    return () => {
      socket.off("conversation-list");
      socket.off("new-waiting-conversation");
      socket.off("new-message");
    };
  }, [activeConversation?.id]); // Theo dõi id hội thoại để cập nhật listener

  const handleClaim = (convo: Conversation) => {
    setActiveConversation(convo);
    setMessages(convo.messages || []);
    // Dùng optional chaining để an toàn tuyệt đối
    socketRef.current?.emit("admin-claim", convo.id);
  };

  const sendMessage = () => {
    // Kiểm tra socketRef.current thay vì chỉ socketClient
    if (!input.trim() || !activeConversation || !socketRef.current) return;

    socketRef.current.emit("admin-send", {
      conversationId: activeConversation.id,
      content: input.trim(),
    });
    setInput("");
  };

  return (
    <div className="flex h-[600px] border rounded-xl overflow-hidden bg-white shadow-lg">
      {/* Sidebar: Danh sách khách hàng */}
      <div className="w-80 border-r flex flex-col bg-slate-50">
        <div className="p-4 border-b font-bold bg-white text-gray-600">Khách hàng đang chờ</div>
        <div className="flex-1 overflow-auto">
          {waitingList.map((c) => (
            <div
              key={c.id}
              onClick={() => handleClaim(c)}
              className={cn(
                "p-4 cursor-pointer border-b hover:bg-white transition-all",
                activeConversation?.id === c.id && "bg-white border-l-4 border-l-gray-600 shadow-sm"
              )}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm">User #{c.userId}</span>
                <Badge variant={c.status === "waiting" ? "destructive" : "secondary"}>
                  {c.status === "waiting" ? "Chờ" : "Đang chat"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 truncate">
                {c.messages && c.messages.length > 0 
                  ? c.messages[c.messages.length - 1].content 
                  : "Chưa có tin nhắn"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main: Khung chat */}
      <div className="flex-1 flex flex-col bg-white">
        {activeConversation ? (
          <>
            <div className="p-4 border-b font-bold flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Đang hỗ trợ User #{activeConversation.userId}
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-4 bg-slate-50">
              {messages.map((m) => (
                <div key={m.id} className={cn("flex", m.senderType === "admin" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm",
                    m.senderType === "admin" 
                      ? "bg-gray-600 text-white rounded-tr-none" 
                      : "bg-white border text-slate-800 rounded-tl-none"
                  )}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t flex gap-2 bg-white">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Nhập nội dung phản hồi..."
                className="focus-visible:ring-gray-600"
              />
              <Button onClick={sendMessage} className="bg-gray-600 hover:bg-gray-700 transition-colors">
                Gửi
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 italic">
            <div className="mb-2 opacity-20">
               {/* Icon chat trang trí */}
               <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
            </div>
            Chọn một khách hàng từ danh sách để bắt đầu hỗ trợ
          </div>
        )}
      </div>
    </div>
  );
}
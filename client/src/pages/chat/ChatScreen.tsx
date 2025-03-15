import { IMessage } from "@/types/message";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { Button, Input } from "@/components";
import { useUserStore } from "@/store/userStore";
import useFetch from "@/hooks/useFetch";
import { IUser } from "@/types/userInterface";

const ChatScreen: React.FC = () => {
  const { user } = useUserStore();
  const { otherUserId } = useParams();
  const [otherUser, setOtherUser] = useState<Partial<IUser>>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [roomId, setRoomId] = useState<string>();
  const { loading, error, triggerFetch } = useFetch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!otherUserId) return;
    const socket = io("http://localhost:3000/");
    socketRef.current = socket;

    const establishConnection = async () => {
      const result = await triggerFetch(
        `/user/${otherUserId}`,
        { method: "GET" },
        true,
      );
      if (result) {
        setOtherUser(result);
        socket.emit("joinRoom", {
          user1: {
            userId: user!.id,
            name: user?.username,
            profilePic:
              user?.imageUrl ??
              "https://www.vecteezy.com/free-vector/default-profile-picture",
          },
          user2: {
            userId: result._id,
            name: result.username,
            profilePic: result.profilePic,
          },
        });
      }
    };

    establishConnection();

    socket.on("previousMessages", (messages: IMessage[]) => {
      setMessages((prevMessages) => [...prevMessages, ...messages]);
    });

    socket.on("receiveMessage", (message: IMessage) => {
      if (message.sender !== user?.id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    setRoomId([user?.id, otherUserId].sort().join("_"));

    return () => {
      socket.disconnect();
    };
  }, [otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const messageData: IMessage = {
      message: newMessage,
      sender: user?.id!,
      timestamp: new Date().toISOString(),
    };
    socketRef.current?.emit("sendMessage", { ...messageData, roomId });
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setNewMessage("");
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-r from-indigo-50 to-blue-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
            {otherUser?.imageUrl ? (
              <img
                src={otherUser.imageUrl}
                alt={otherUser.username || ""}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold">
                {otherUser?.username?.charAt(0)}
              </span>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center text-gray-500">
          Loading messages...
        </div>
      ) : error ? (
        <div className="flex-1 flex justify-center items-center text-red-500">
          Error: {error}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 max-w-6xl w-full mx-auto">
          <div className="space-y-3 pb-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p className="text-center">No messages yet</p>
                <p className="text-sm text-center">
                  Say hello to start the conversation!
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === user?.id ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
                    <div
                      className={`px-4 py-2 rounded-2xl ${msg.sender === user?.id ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none shadow-sm"}`}
                    >
                      <p>{msg.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 bg-white p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 rounded-full px-4 py-3 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-sm transition-colors"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;

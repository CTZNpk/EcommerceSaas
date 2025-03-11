import { IMessage } from "@/types/message";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { Button, Input } from "@/components";
import { useUserStore } from "@/store/userStore";

const ChatScreen: React.FC = () => {
  const { user } = useUserStore();
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    if (!roomId) return;

    const socket = io();
    socketRef.current = socket;

    socket.emit("joinRoom", roomId);

    socket.on("previousMessages", (messages: IMessage[]) => {
      setMessages((prevMessages) => [...prevMessages, ...messages]);
    });

    socket.on("receiveMessage", (message: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData: IMessage = {
      text: newMessage,
      sender: user?.id!,
      timestamp: new Date().toISOString(),
    };

    // Emit the message to the server
    socketRef.current?.emit("sendMessage", messageData);
    // Optionally update the UI immediately
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setNewMessage("");
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-white">
      <h1 className="text-xl font-semibold p-4 border-b">Chat</h1>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 ${msg.sender === user?.id ? "text-right" : "text-left"}`}
            >
              <p className="inline-block bg-gray-200 p-2 rounded-lg">
                {msg.text}
              </p>
            </div>
          ))
        )}
      </div>
      {/* Message Input */}
      <div className="p-4 border-t flex gap-2">
        <Input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    </div>
  );
};

export default ChatScreen;

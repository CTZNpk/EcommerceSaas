import { IMessage } from "@/types/message";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { Button, Input } from "@/components";
import { useUserStore } from "@/store/userStore";
import useFetch from "@/hooks/useFetch";
import { IUser } from "@/types/userInterface";
import { ArrowLeft, Send, Paperclip, Smile, MoreVertical } from "lucide-react";
import { format } from "date-fns";

const ChatScreen: React.FC = () => {
  const { user } = useUserStore();
  const { otherUserId } = useParams();
  const navigate = useNavigate();
  const [otherUser, setOtherUser] = useState<Partial<IUser>>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [roomId, setRoomId] = useState<string>();
  const { loading, error, triggerFetch } = useFetch();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
            profilePic: user?.imageUrl ?? "/default-avatar.png",
          },
          user2: {
            userId: result._id,
            name: result.username,
            profilePic: result.profilePic || "/default-avatar.png",
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

    socket.on("userTyping", (typingUserId: string) => {
      if (typingUserId !== user?.id) {
        setIsTyping(true);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    });

    setRoomId([user?.id, otherUserId].sort().join("_"));

    return () => {
      socket.disconnect();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    socketRef.current?.emit("typing", { roomId, userId: user?.id });
  };

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

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), "h:mm a");
  };

  const groupMessagesByDate = () => {
    const groups: { date: string; messages: IMessage[] }[] = [];
    let currentDate = "";
    let currentGroup: IMessage[] = [];

    messages.forEach((message) => {
      const messageDate = format(new Date(message.timestamp), "MMMM d, yyyy");

      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: [...currentGroup] });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup });
    }

    return groups;
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>

              <div className="flex items-center">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {otherUser?.imageUrl ? (
                      <img
                        src={otherUser.imageUrl}
                        alt={otherUser.username || ""}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-gray-600">
                        {otherUser?.username?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                <div className="ml-3">
                  <h2 className="font-medium text-gray-900">
                    {otherUser?.username}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {isTyping ? (
                      <span className="text-blue-600">Typing...</span>
                    ) : (
                      "Online"
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading conversation...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg max-w-md text-center">
            <p className="font-medium">Failed to load messages</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              className="mt-3 text-sm bg-red-100 px-3 py-1 rounded hover:bg-red-200 transition-colors"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 max-w-3xl w-full mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 text-gray-500">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10 text-blue-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                  />
                </svg>
              </div>
              <p className="text-center font-medium">No messages yet</p>
              <p className="text-sm text-center max-w-xs">
                Start a conversation with {otherUser?.username} by sending a
                message below.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupMessagesByDate().map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-gray-100 text-gray-500 text-xs font-medium px-3 py-1 rounded-full">
                      {group.date}
                    </div>
                  </div>

                  {group.messages.map((msg, index) => {
                    const isCurrentUser = msg.sender === user?.id;
                    const showTime =
                      index === 0 ||
                      group.messages[index - 1].sender !== msg.sender ||
                      new Date(msg.timestamp).getTime() -
                        new Date(
                          group.messages[index - 1].timestamp,
                        ).getTime() >
                        5 * 60 * 1000;

                    return (
                      <div
                        key={index}
                        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                      >
                        <div className="max-w-xs md:max-w-md space-y-1">
                          <div
                            className={`px-4 py-2.5 rounded-2xl ${
                              isCurrentUser
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100"
                            }`}
                          >
                            <p>{msg.message}</p>
                          </div>
                          {showTime && (
                            <div
                              className={`text-xs text-gray-500 ${isCurrentUser ? "text-right pr-2" : "pl-2"}`}
                            >
                              {formatMessageTime(msg.timestamp)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <Paperclip size={20} />
            </button>

            <Input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 rounded-full px-4 py-3 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
            />

            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <Smile size={20} />
            </button>

            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`p-3 rounded-full shadow-sm transition-colors flex items-center justify-center ${
                newMessage.trim()
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;

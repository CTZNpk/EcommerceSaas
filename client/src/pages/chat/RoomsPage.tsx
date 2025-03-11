import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { IRoom } from "@/types/message";
import useFetch from "@/hooks/useFetch";
import { MessageCircle } from "lucide-react";

const RoomsPage = () => {
  const { user } = useUserStore();
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const { triggerFetch, loading, error } = useFetch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      const result = await triggerFetch(
        `/message/rooms/${user?.id}`,
        {
          method: "GET",
        },
        true,
      );
      setRooms(result);
    };
    fetchRooms();
  }, [user?.id]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if date is today
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    // Check if date is yesterday
    else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    // Otherwise show date
    else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              Messages
            </h1>
            {/* Optional: Add navigation or actions here */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading conversations...</span>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="border-b px-6 py-4">
              <h2 className="font-medium text-gray-700">Your Conversations</h2>
            </div>

            {rooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <MessageCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No conversations yet
                </h3>
                <p className="text-gray-500 max-w-sm">
                  When you contact vendors or other users, your conversations
                  will appear here.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-180px)]">
                <div className="divide-y">
                  {rooms.map((room) => {
                    const otherUser = room.users.find(
                      (tempUser) => tempUser.userId !== user?.id,
                    );
                    const lastMessage = room.latestMessage;
                    // const hasUnread = room.unreadCount > 0;

                    return (
                      <div
                        key={room.id}
                        className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/chat/${room.id}`)}
                      >
                        <div className="relative">
                          <img
                            src={otherUser?.profilePic || "/default-avatar.png"}
                            alt={otherUser?.name}
                            className="w-12 h-12 rounded-full object-cover border border-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/default-avatar.png";
                            }}
                          />
                          {/*otherUser?.isOnline && (
                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-white"></span>
                          )*/}
                        </div>

                        <div className="ml-4 flex-1">
                          <div className="flex justify-between items-baseline">
                            <h3 className="font-medium text-gray-900">
                              {otherUser?.name || "Unknown User"}
                            </h3>
                            {lastMessage && (
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(lastMessage.timestamp)}
                              </span>
                            )}
                          </div>

                          <div className="flex justify-between items-center mt-1">
                            <p
                              className={`text-sm truncate w-64 
  "text-gray-500"}`}
                            >
                              {lastMessage
                                ? lastMessage.text
                                : "No messages yet"}
                            </p>

                            {/*
                              <span className="ml-2 bg-blue-500 text-white text-xs font-medium rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
                                {room.unreadCount}
                              </span>
                            */}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default RoomsPage;

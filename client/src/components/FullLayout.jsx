import { useEffect } from "react";
import socket from "../socket";
import ChatBox from "./ChatBox";
import TaskManager from "./TaskManager";
import WeeklyPlanner from "./WeeklyPlanner";

function FullLayout({ username }) {
  // 👤 Karşı tarafı belirle
  const otherUser = username === "emir" ? "dilo" : "emir";

  useEffect(() => {
    const setOnline = () => {
      socket.emit("userStatus", { user: username, status: "online" });
    };

    const setOffline = () => {
      socket.emit("userStatus", { user: username, status: "offline" });
    };

    // Çevrim içi olarak başla
    setOnline();

    // Tab değişimi ile status gönder
    window.addEventListener("focus", setOnline);
    window.addEventListener("blur", setOffline);
    window.addEventListener("beforeunload", setOffline);

    return () => {
      window.removeEventListener("focus", setOnline);
      window.removeEventListener("blur", setOffline);
      window.removeEventListener("beforeunload", setOffline);
    };
  }, [username]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <div className="bg-white rounded-2xl shadow-md p-4">
        {/* 💬 ChatBox'a otherUser gönderiyoruz */}
        <ChatBox username={username} otherUser={otherUser} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-4">
          <TaskManager />
        </div>
        <div className="bg-white rounded-2xl shadow-md p-4">
          <WeeklyPlanner />
        </div>
      </div>
    </div>
  );
}

export default FullLayout;

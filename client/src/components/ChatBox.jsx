import { useEffect, useState, useRef } from "react";
import socket from "../socket";

function ChatBox({ username, otherUser }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [otherStatus, setOtherStatus] = useState("offline");
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef(null); // Chat'in sonuna referans ekliyoruz
  const chatContainerRef = useRef(null); // Chat container'ı referansla kontrol edeceğiz

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setChat((prev) => [...prev, data]);
    });

    socket.on("statusUpdate", (data) => {
      if (data.user === otherUser) {
        setOtherStatus(data.status);
      }
    });

    socket.on("typing", () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000); // Yazıyor efektinin kaybolması
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("statusUpdate");
      socket.off("typing");
    };
  }, [otherUser]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (trimmed !== "") {
      socket.emit("sendMessage", {
        user: username,
        text: trimmed,
      });
      socket.emit("typing", false); // Yazmayı bitirdik
      setMessage("");
    }
  };

  const handleTyping = () => {
    if (message.trim()) {
      socket.emit("typing", true); // Yazmaya başla
    }
  };

  // Chat'in sonuna kaydırma fonksiyonu
  useEffect(() => {
    // Chat'in sonuna kaydırma
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]); // her yeni mesajda kaydırma

  return (
    <div>
      <div className="mb-2">
        <h2 className="text-xl font-semibold inline-block mr-4">💬 Chat Alanı</h2>
        <span
          className={`text-sm font-medium ${
            otherStatus === "online" ? "text-green-500" : "text-red-500"
          }`}
        >
          {otherUser} {otherStatus === "online" ? "çevrimiçi 🟢" : "çevrimdışı 🔴"}
        </span>
      </div>

      {/* Yazıyor efekti */}
      {isTyping && (
        <div className="text-sm text-gray-500 mb-2">Yazıyor...</div>
      )}

      <div
        ref={chatContainerRef}
        className="h-60 overflow-y-auto bg-gray-100 p-4 rounded-xl mb-4"
      >
        {chat.map((msg, i) => {
          const isMine = msg.user === username;

          return (
            <div
              key={i}
              className={`mb-2 flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-2xl text-sm shadow ${
                  isMine
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
                }`}
              >
                {!isMine && (
                  <div className="text-xs text-gray-500 mb-1">{msg.user}</div>
                )}
                <div>{msg.text}</div>
              </div>
            </div>
          );
        })}
        {/* Chat sonu */}
        <div ref={chatEndRef} /> 
      </div>

      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping(); // her değişiklikte yazma durumu gönder
          }}
          className="flex-1 p-2 rounded-lg border"
          placeholder="Mesaj yaz..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600"
        >
          Gönder
        </button>
      </div>
    </div>
  );
}

export default ChatBox;

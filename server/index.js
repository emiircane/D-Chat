const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Diloro backend çalışıyor!");
});

// 💾 Aktif kullanıcı listesi
const onlineUsers = new Map(); // key: username, value: socket.id

io.on("connection", (socket) => {
  console.log("✔ Kullanıcı bağlandı:", socket.id);

  // 💬 Mesajları yay
  socket.on("sendMessage", (data) => {
    console.log("📩 Gelen mesaj:", data);
    io.emit("receiveMessage", data);
  });

  // 🔁 Kullanıcı online/offline durumu gönderdi
  socket.on("userStatus", (data) => {
    console.log("🟢 Durum güncellendi:", data);

    const { user, status } = data;

    if (status === "online") {
      onlineUsers.set(user, socket.id);
    } else {
      onlineUsers.delete(user);
    }

    // Herkese bu kullanıcının güncel durumunu bildir
    socket.broadcast.emit("statusUpdate", { user, status });
  });

  // 🔁 Yazma durumu gönderildi
  socket.on("typing", (status) => {
    socket.broadcast.emit("typing", status); // diğer kullanıcıya yay
  });

  socket.on("disconnect", () => {
    console.log("✘ Kullanıcı ayrıldı:", socket.id);

    // Map'ten kullanıcıyı kaldır
    for (let [user, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(user);
        socket.broadcast.emit("statusUpdate", {
          user,
          status: "offline",
        });
        break;
      }
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`✅ Backend çalışıyor: http://localhost:${PORT}`);
});

import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const allowedUsers = ["emir", "dilo"]; // sadece 2 kullanıcı

    // "o" yazan kimse "dilo" olarak geçsin
    let fixedUsername = username.trim().toLowerCase();
    if (fixedUsername === "o") fixedUsername = "dilo";

    if (allowedUsers.includes(fixedUsername)) {
      onLogin(fixedUsername); // "dilo" olarak girmesi sağlanacak
    } else {
      alert("Bu sistem sadece 'emir' ve 'dilo' kullanıcılarına açıktır.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Diloro Giriş</h1>
        <input
          type="text"
          placeholder="Kullanıcı adın"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
}

export default Login;

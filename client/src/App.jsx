import { useState, useEffect } from "react";
import Login from "./components/Login";
import FullLayout from "./components/FullLayout";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("diloro-user");
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogin = (usernameInput) => {
    let fixedUsername = usernameInput.trim().toLowerCase();

    // "o" yazan kişi de "dilo" olarak tanımlansın
    if (fixedUsername === "o") fixedUsername = "dilo";

    setUser(fixedUsername);
    localStorage.setItem("diloro-user", fixedUsername);
  };

  return user ? <FullLayout username={user} /> : <Login onLogin={handleLogin} />;
}

export default App;

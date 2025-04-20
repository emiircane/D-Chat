import { useState } from "react";

function TaskManager() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleAdd = () => {
    if (task.trim() !== "") {
      setTasks([...tasks, task]);
      setTask("");
    }
  };

  const handleDelete = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">✅ Görevler</h2>
      
      <div className="flex gap-2 mb-4">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Yeni görev ekle..."
          className="flex-1 p-2 rounded-lg border"
        />
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-4 rounded-lg hover:bg-green-600"
        >
          Ekle
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((t, i) => (
          <li key={i} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm">
            <span>{t}</span>
            <button
              onClick={() => handleDelete(i)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;

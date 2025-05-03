"use client";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import TaskForm from "../create-task/page";
// Make sure you have this component

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch tasks");

        const data = await res.json();
        setTasks(data || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTasks();
  }, []);

  const handleCreate = () => {
    setEditTask(null);
    setShowModal(true);
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          toast.success("Task deleted successfully!");
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task._id !== taskId)
          );
        } else {
          toast.error("Failed to delete task.");
        }
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("An error occurred while deleting the task.");
      }
    }
  };

  const handleSuccess = (newOrUpdatedTask) => {
    setShowModal(false);
    setEditTask(null);
    setTasks((prevTasks) => {
      const exists = prevTasks.find((t) => t._id === newOrUpdatedTask._id);
      if (exists) {
        return prevTasks.map((t) =>
          t._id === newOrUpdatedTask._id ? newOrUpdatedTask : t
        );
      } else {
        return [newOrUpdatedTask, ...prevTasks];
      }
    });
  };

  return (
    <main className="p-6 w-full flex flex-col">
      <div className="flex justify-between items-center w-full mb-6">
        <h1 className="text-3xl font-bold  ">Team Tasks</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg "
        >
          ➕ Create Task
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEdit(task)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mt-1">{task.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
            <span
              className={`inline-block mt-3 px-2 py-1 text-sm rounded-full ${
                task.priority === "high"
                  ? "bg-red-100 text-red-800"
                  : task.priority === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✖
            </button>
            <TaskForm task={editTask} onSuccess={handleSuccess} />
          </div>
        </div>
      )}
    </main>
  );
}

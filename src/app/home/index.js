"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TaskForm from "../create-task/page";
import TaskItem from "../components/TaskItem";
import useLocalStorage from "../hooks/useLocalStorage";

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ status: "", priority: "", due: "" });
   const { getItem } = useLocalStorage();

   const currentUser = getItem("user");


   


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

  // 🔎 Filtered tasks logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filters.status
      ? task.status === filters.status
      : true;
    const matchesPriority = filters.priority
      ? task.priority === filters.priority
      : true;
    const matchesDue =
      filters.due === "overdue"
        ? new Date(task.dueDate) < new Date() && task.status !== "completed"
        : true;

    return matchesSearch && matchesStatus && matchesPriority && matchesDue;
  });

  // 📊 Dashboard data
 const assignedTasks = tasks.filter(
   (task) => task.assignedTo === currentUser.name
 );
 const createdTasks = tasks.filter(
   (task) => task.createdBy === currentUser.name
 ); // Assuming `createdBy` is part of the task data
 const overdueTasks = tasks.filter(
   (task) => new Date(task.dueDate) < new Date() && task.status !== "completed"
 );

  return (
    <main className="p-6 w-full flex flex-col mt-15">
      <div className="flex justify-between items-center w-full mb-6">
        <h1 className="text-3xl font-bold">Team Tasks</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          ➕ Create Task
        </button>
      </div>

      {/* 🔍 Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title or description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border border-gray-300 rounded-lg p-2"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="border border-gray-300 rounded-lg p-2"
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={filters.due}
          onChange={(e) => setFilters({ ...filters, due: e.target.value })}
          className="border border-gray-300 rounded-lg p-2"
        >
          <option value="">All Due Dates</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* 📊 Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-md border">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            📌 Assigned to You
          </h2>
          <p className="text-2xl font-bold text-blue-600">
            {assignedTasks.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            📝 Created by You
          </h2>
          <p className="text-2xl font-bold text-green-600">
            {createdTasks.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md border">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            ⏰ Overdue Tasks
          </h2>
          <p className="text-2xl font-bold text-red-600">
            {overdueTasks.length}
          </p>
        </div>
      </div>

      {/* 📋 Task Grid */}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.map((task, id) => (
          <TaskItem
            key={id}
            task={task}
            index={task._id}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))}
      </div>

      {/* 📄 Modal */}
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

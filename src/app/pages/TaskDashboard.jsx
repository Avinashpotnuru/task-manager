"use client";

import { useEffect, useState } from "react";

const currentUser = "avinash"; // Replace with auth logic later

export default function TaskDashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("assigned");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "assigned") return task.assignedTo === currentUser;
    if (filter === "created") return task.createdBy === currentUser;
    if (filter === "overdue")
      return (
        task.dueDate &&
        new Date(task.dueDate) < new Date() &&
        task.status !== "done"
      );
    return true;
  });

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter("assigned")}
          className={`px-4 py-2 rounded ${
            filter === "assigned" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Assigned to Me
        </button>
        <button
          onClick={() => setFilter("created")}
          className={`px-4 py-2 rounded ${
            filter === "created" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Created by Me
        </button>
        <button
          onClick={() => setFilter("overdue")}
          className={`px-4 py-2 rounded ${
            filter === "overdue" ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
        >
          Overdue
        </button>
      </div>

      <div className="grid gap-4">
        {filteredTasks.length ? (
          filteredTasks.map((task) => (
            <div key={task._id} className="p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p>{task.description}</p>
              <p className="text-sm text-gray-600">
                Due:{" "}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "N/A"}{" "}
                | Priority: {task.priority} | Status: {task.status}
              </p>
              <p className="text-sm text-gray-500">
                Assigned to: {task.assignedTo} | Created:{" "}
                {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </div>
    </div>
  );
}

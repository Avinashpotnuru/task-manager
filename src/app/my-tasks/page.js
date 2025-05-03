"use client";

import { useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

// Replace with real auth logic

export default function MyTasks() {
  const [currentUser,setCurrentUser] = useState("");
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dueFilter, setDueFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const {getItem}= useLocalStorage();
  console.log(getItem("token"))


  useEffect(() => {
    const fetchTasks = async () => {
        const token = localStorage.getItem("token");
        const user= localStorage.getItem("user");
        // const token = getItem("token");
        // const user= getItem("user");
      

        console.log(user);
        if(user){
          try {
            const parsed = JSON.parse(user);
            setCurrentUser(parsed.name || "User");
          } catch {
            setCurrentUser("User");
          }
        }

        
      try {
        const res = await fetch("/api/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setTasks(data || []);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

 const filteredTasks = tasks.filter((task) => {
   const matchesUser = task.assignedTo === currentUser; // Only tasks assigned to this user
   const matchesStatus = statusFilter ? task.status === statusFilter : true;
   const matchesPriority = priorityFilter
     ? task.priority === priorityFilter
     : true;
   const isOverdue =
     dueFilter === "overdue"
       ? new Date(task.dueDate) < new Date() && task.status !== "completed"
       : true;

   return matchesUser && matchesStatus && matchesPriority && isOverdue;
 });

  if (loading) return <p className="text-center mt-10">Loading tasks...</p>;

  return (
    <div className="p-6 mt-20">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="px-3 py-2 border rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          className="px-3 py-2 border rounded"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          className="px-3 py-2 border rounded"
          value={dueFilter}
          onChange={(e) => setDueFilter(e.target.value)}
        >
          <option value="all">All Tasks</option>
          <option value="overdue">Overdue Only</option>
        </select>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length ? (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-gradient-to-br from-white via-gray-50 to-gray-100 p-5 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-800">
                  {task.title}
                </h2>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    task.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : task.priority === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {task.priority.toUpperCase()}
                </span>
              </div>

              <p className="text-gray-700 mb-3">{task.description}</p>

              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Status:</strong> {task.status}
                </p>
                <p>
                  <strong>Due:</strong>{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Assigned To:</strong> {task.assignedTo}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(task.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No tasks found.</p>
        )}
      </div>
    </div>
  );
}

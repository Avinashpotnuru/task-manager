"use client";

import { useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import TaskItem from "../components/TaskItem";


export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dueFilter, setDueFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const { getItem } = useLocalStorage();
  const token = getItem("token");
  const currentUser = getItem("user");

  useEffect(() => {
    const fetchTasks = async () => {
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
  }, [token]);

  const filteredTasks = tasks.filter((task) => {
    const matchesUser = task.assignedTo === currentUser?.name; // Only tasks assigned to this user
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

      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.length ? (
          filteredTasks.map((task, index) => (
            <TaskItem key={index} task={task} index={index} />
          ))
        ) : (
          <p className="text-gray-500">No tasks found.</p>
        )}
      </div>
    </div>
  );
}

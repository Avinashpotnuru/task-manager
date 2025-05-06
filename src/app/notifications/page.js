"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useLocalStorage from "../hooks/useLocalStorage";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import { ClientSegmentRoot } from "next/dist/client/components/client-segment";

function TaskForm() {
  const { register, handleSubmit, reset } = useForm();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]); // New state for users
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const { getItem } = useLocalStorage();
  const token = getItem("token");
  const currentUser = getItem("user");

  const SERVICE_ID = process.env.NEXT_PUBLIC_SERVICE_ID;
  const TEMPLATE_ID = process.env.NEXT_PUBLIC_TEMPLATE_ID;
  const PUBLIC_KEY = process.env.NEXT_PUBLIC_PUBLIC_KEY;

  const onSubmit = async (data) => {
    try {
      const getUser = users.find((user) => user.email === data.assignedTo);

      const sendDetails = {
        ...data,
        name: getUser?.name || "N/A",
        createdBy: currentUser?.name || "Unknown",
        createdEmail: currentUser?.email || "Unknown",
      };

      console.log("Sending email with details:", sendDetails);

      const response = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        sendDetails,
        PUBLIC_KEY
      );

      if (response.status === 200) {
        toast.success(" Email sent successfully!");
        reset();
      } else {
        toast.error(" Email not sent. Please try again.");
      }
    } catch (error) {
      toast.error(" Failed to send email.");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/register", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks", {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  const filterUsers = users.filter((user) => user.email !== currentUser?.email);

  return (
    <div className="max-w-xl mx-auto p-6 mt-20 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Send Alerts</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("title")}
          placeholder="Task title"
          required
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          {...register("description")}
          placeholder="Task description"
          rows={3}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          {...register("assignedTo")}
          required
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Assign to...</option>
          {filterUsers?.map((user, id) => (
            <option key={id} value={user.email}>
              {user.name.replace(/\b\w/g, (char) => char.toUpperCase())}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Send Alert
        </button>
      </form>
    </div>
  );
}

export default TaskForm;

"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useLocalStorage from "../hooks/useLocalStorage";

export default function TaskForm({ task = null, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: task || {},
  });

  const { getItem } = useLocalStorage();
  const currentUser = getItem("user");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (task) {
      const formattedTask = {
        ...task,
        dueDate: task.dueDate?.split("T")[0],
      };
      reset(formattedTask);
    }
  }, [task, reset]);

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/tasks${task ? `/${task._id}` : ""}`, {
        method: task ? "PUT" : "POST",
        body: JSON.stringify({ ...data, createdBy: currentUser.name }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Task save failed");

      const result = await response.json();
      toast.success(`Task ${task ? "updated" : "created"} successfully!`);
      reset();
      if (onSuccess) onSuccess(result);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save task.");
    }
  };

  return (
    <div className="mt-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          {task ? "✏️ Edit Task" : "📝 Create Task"}
        </h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register("title", { required: "Title is required" })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register("description", {
              maxLength: {
                value: 500,
                message: "Description too long (max 500 characters)",
              },
            })}
            rows={3}
            placeholder="Enter task details"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Status & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              {...register("status", { required: "Status is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              {...register("priority", { required: "Priority is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <p className="text-red-500 text-sm mt-1">
                {errors.priority.message}
              </p>
            )}
          </div>
        </div>

        {/* Due Date & Assigned To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("dueDate", {
                required: "Due date is required",
              })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dueDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned To <span className="text-red-500">*</span>
            </label>
            <input
              {...register("assignedTo", {
                required: "Assignee is required",
                minLength: {
                  value: 3,
                  message: "Assignee name should be at least 3 characters long",
                },
              })}
              placeholder="Assignee name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.assignedTo && (
              <p className="text-red-500 text-sm mt-1">
                {errors.assignedTo.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          {task ? "Update Task ✅" : "Create Task ➕"}
        </button>
      </form>
    </div>
  );
}

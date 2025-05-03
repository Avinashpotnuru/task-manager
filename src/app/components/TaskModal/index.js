"use client";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "react-hot-toast";

export default function TaskModal({ isOpen, onClose, task, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (task) reset(task);
    else reset({});
  }, [task, reset]);

  const onSubmit = async (data) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/tasks${task ? `/${task._id}` : ""}`, {
        method: task ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save task");

      const result = await response.json();
      toast.success(`Task ${task ? "updated" : "created"} successfully!`);
      onSuccess && onSuccess(result);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Error saving task");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl space-y-4">
          <Dialog.Title className="text-xl font-bold">
            {task ? "Edit Task" : "Create Task"}
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              {...register("title", { required: true })}
              placeholder="Title"
              className="w-full border p-2 rounded"
            />
            {errors.title && <p className="text-red-500 text-sm">Title is required</p>}

            <textarea
              {...register("description")}
              placeholder="Description"
              className="w-full border p-2 rounded"
            />

            <select {...register("status")} className="w-full border p-2 rounded">
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select {...register("priority")} className="w-full border p-2 rounded">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <input
              type="date"
              {...register("dueDate")}
              className="w-full border p-2 rounded"
            />

            <input
              {...register("assignedTo")}
              placeholder="Assigned To (name/email)"
              className="w-full border p-2 rounded"
            />

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {task ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

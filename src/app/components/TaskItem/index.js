"use client";

import { FaEdit, FaTrash } from "react-icons/fa";
import { usePathname } from "next/navigation";

const TaskItem = ({ task, index, handleEdit, handleDelete, currentUser }) => {
  const pathname = usePathname();

  const isOwner = task.createdBy === currentUser.name;

  const handleAction = (actionType) => {
    if (actionType === "edit") handleEdit(task);
    if (actionType === "delete") handleDelete(index);
  };

  return (
    <div
      key={index}
      className="bg-gradient-to-br from-white via-gray-50 to-gray-100 p-5 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-200"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-800">{task.title}</h2>
        {pathname === "/" && (
          <div className="flex space-x-3">
            <button
              onClick={() => handleAction("edit")}
              className={`${
                isOwner
                  ? "text-blue-600 hover:text-blue-800"
                  : "text-gray-400 cursor-pointer"
              }`}
              title={
                isOwner
                  ? "Edit task"
                  : "You don’t have access to edit others' tasks"
              }
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleAction("delete")}
              className={`${
                isOwner
                  ? "text-red-600 hover:text-red-800"
                  : "text-gray-400 cursor-pointer"
              }`}
              title={
                isOwner
                  ? "Delete task"
                  : "You don’t have access to delete others' tasks"
              }
            >
              <FaTrash />
            </button>
          </div>
        )}
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
            ? new Date(task.dueDate).toLocaleDateString("en-GB")
            : "N/A"}
        </p>
        <p>
          <strong>Assigned To:</strong> {task.assignedTo}
        </p>
        <p>
          <strong>Created:</strong>{" "}
          {new Date(task.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Created by:</strong>{" "}
          {task.createdBy === currentUser.name ? "You" : task.createdBy}
        </p>
      </div>
    </div>
  );
};

export default TaskItem;

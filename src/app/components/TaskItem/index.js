"use client"; // Ensuring client-side rendering

import { FaEdit, FaTrash } from "react-icons/fa";
import { usePathname } from "next/navigation";

const TaskItem = ({ task, index, handleEdit, handleDelete }) => {
  const pathname = usePathname();

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
              onClick={() => handleEdit(task)}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(index)}
              className="text-red-600 hover:text-red-800"
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
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-GB") : "N/A"}
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
  );
};

export default TaskItem;

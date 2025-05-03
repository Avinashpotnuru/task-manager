import { verifyTokenFromHeader } from "@/utils/verifyToken";


import { connectDB } from "@/lib/dbConnect";
import Task from "@/models/task";

export async function PUT(req, { params }) {
  await connectDB();

  const { id } = params;
  const { title, description, status, priority, dueDate, assignedTo } =
    await req.json();

  try {
    verifyTokenFromHeader(req)
    // Find the task by ID and update it
    const task = await Task.findByIdAndUpdate(
      id,
      { title, description, status, priority, dueDate, assignedTo },
      { new: true } // Return the updated task
    );

    if (!task) {
      return new Response("Task not found", { status: 404 });
    }

    return new Response(JSON.stringify(task), { status: 200 });
  } catch (error) {
    return new Response("Error updating task", { status: 500 });
  }
}



export async function DELETE(req, { params }) {
  await connectDB();

  const { id } = params;

  try {
    verifyTokenFromHeader(req)
    // Find the task by ID and remove it
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return new Response("Task not found", { status: 404 });
    }

    return new Response("Task deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Error deleting task", { status: 500 });
  }
}

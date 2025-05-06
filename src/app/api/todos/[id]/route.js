
import { connectDB } from "@/lib/dbConnect";
import Todo from "@/models/todo";

export async function GET(_, { params }) {
  await connectDB();
  const todo = await Todo.findById(params.id);
  return Response.json(todo);
}

export async function PUT(req, { params }) {
  await connectDB();
  const data = await req.json();
  const updated = await Todo.findByIdAndUpdate(params.id, data, { new: true });
  return Response.json(updated);
}

export async function DELETE(_, { params }) {
  await connectDB();
  await Todo.findByIdAndDelete(params.id);
  return Response.json({ message: "Deleted" });
}

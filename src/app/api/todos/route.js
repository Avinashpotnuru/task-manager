

import { connectDB } from "@/lib/dbConnect";
import Todo from "@/models/todo";


export async function GET() {
  await connectDB();
  const todos = await Todo.find();
  return Response.json(todos);
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const todo = await Todo.create(data);
  return Response.json(todo);
}

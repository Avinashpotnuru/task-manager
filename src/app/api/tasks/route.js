import { connectDB } from "@/lib/dbConnect";
import Task from "@/models/task";
import { verifyTokenFromHeader } from "@/utils/verifyToken";


export async function GET(req) {
  try {
    verifyTokenFromHeader(req); // 🔐
    await connectDB();
    const tasks = await Task.find();
    return Response.json(tasks);
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 401,
    });
  }
}

export async function POST(req) {
 
  try {
    verifyTokenFromHeader(req); 
    await connectDB();
    const body = await req.json();
    console.log(body,"body");
   
    const task = await Task.create(body);
    return Response.json(task, { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 401,
    });
  }
}


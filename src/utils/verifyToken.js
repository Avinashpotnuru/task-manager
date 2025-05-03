import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dummysecret123"; // use your real secret

export function verifyTokenFromHeader(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // { userId, name, ... }
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

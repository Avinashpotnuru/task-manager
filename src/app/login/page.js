"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useStorageAuth from "../hooks/useLocalStorage";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isError, setIsError] = useState(false);

  const { setItem } = useStorageAuth();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (response.ok) {
       

        setItem("token", result.token);
        setItem("user", JSON.stringify(result.user));

        toast.success("Login successful!"); 
        router.push("/"); 
      } else {
        setIsError(true); 
        toast.error(result.message || "Login failed"); 
      }
    } catch (error) {
      console.error("Login failed", error);
      setIsError(true); 
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm mx-auto bg-white p-8 rounded-xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

      {isError && (
        <p className="text-red-500 text-sm text-center">
          Invalid credentials. Please try again.
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          {...register("password", { required: "Password is required" })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
      >
        Login
      </button>

      <p className="text-center text-sm text-gray-600 mt-4">
        Don&apos;t have an account?{" "}
        <a href="/register" className="text-blue-600 hover:text-blue-700">
          Register here
        </a>
      </p>
    </form>
  );
}

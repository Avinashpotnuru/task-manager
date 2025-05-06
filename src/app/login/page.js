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
        // Store the token in localStorage
        //  setItem("token", result.token); // ✅ token (string)
        //  setItem("user", result.user);

        // localStorage.setItem("token", result.token);
        // localStorage.setItem("user", JSON.stringify(result.user));

        setItem("token", result.token);
        setItem("user", JSON.stringify(result.user));

        toast.success("Login successful!"); // Show success toast
        router.push("/"); // Navigate to home
      } else {
        setIsError(true); // Show error message
        toast.error(result.message || "Login failed"); // Show error toast
      }
    } catch (error) {
      console.error("Login failed", error);
      setIsError(true); // Handle any error during login
      toast.error("Something went wrong. Please try again."); // Show error toast
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm mx-auto bg-white p-8 rounded-xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

      {/* Error Message for Invalid Credentials */}
      {isError && (
        <p className="text-red-500 text-sm text-center">
          Invalid credentials. Please try again.
        </p>
      )}

      {/* Email Input */}
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

      {/* Password Input */}
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

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
      >
        Login
      </button>

      {/* Registration Link */}
      <p className="text-center text-sm text-gray-600 mt-4">
        Don&apos;t have an account?{" "}
        <a href="/register" className="text-blue-600 hover:text-blue-700">
          Register here
        </a>
      </p>
    </form>
  );
}

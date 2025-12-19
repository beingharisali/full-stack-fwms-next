"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/services/auth.api";

interface LoginForm {
	email: string;
	password: string;
}

export default function loginPage() {
	const router = useRouter();
	const [form, setForm] = useState<LoginForm>({
		email: "",
		password: "",
	});
	const [error, setError] = useState("");

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		try {
			const res = await login(form.email, form.password);
			localStorage.setItem("token", res.token);
			router.push("/admin");
		} catch (error: any) {
			setError(error.response?.data?.msg || "Login failed");
		}
	};

	return (
		<div
			className="min-h-screen flex items-center justify-center 
    bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 px-4">
			<div
				className="bg-white rounded-2xl shadow-xl border border-gray-200 
      p-8 w-full max-w-md animate-fade-in">
				<h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
					Login
				</h2>

				{error && <p className="text-red-500 text-center mb-4">{error}</p>}

				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<input
						type="email"
						name="email"
						placeholder="Email"
						value={form.email}
						onChange={handleChange}
						required
						className="bg-gray-50 border border-gray-300 text-gray-800 
            placeholder-gray-400 rounded-lg p-3
            focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-500
            transition"
					/>

					<input
						type="password"
						name="password"
						placeholder="Password"
						value={form.password}
						onChange={handleChange}
						required
						className="bg-gray-50 border border-gray-300 text-gray-800 
            placeholder-gray-400 rounded-lg p-3
            focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-500
            transition"
					/>

					<button
						type="submit"
						className="bg-gray-800 text-white rounded-lg p-3 font-semibold
            hover:bg-gray-900 transition transform hover:scale-[1.02]">
						Login
					</button>
				</form>

				<p className="mt-4 text-center text-gray-500">
					Don't have an account?{" "}
					<Link
						href="/signup"
						className="text-gray-800 font-medium hover:underline">
						signup
					</Link>
				</p>
			</div>
		</div>
	);
}

"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/services/auth.api";
import { motion } from "framer-motion";

interface LoginForm {
	email: string;
	password: string;
}

/* -------------------- Animations -------------------- */
const container = {
	hidden: { opacity: 0, y: 30 },
	show: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

export default function LoginPage() {
	const router = useRouter();

	const [form, setForm] = useState<LoginForm>({
		email: "",
		password: "",
	});

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await login(form.email, form.password);

			
			localStorage.setItem("token", res.token);
			document.cookie = `token=${res.token}; path=/; max-age=86400`;

			
			const role = res.user.role;
			localStorage.setItem("role", role);

			
			if (role === "driver") {
				router.push("/dashboard/driver");
			} else if (role === "manager") {
				router.push("/manager");
			} else {
				router.push("/admin");
			}
		} catch (err: any) {
			setError(err.response?.data?.msg || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="min-h-screen flex items-center justify-center px-4
      bg-gradient-to-br from-slate-200 via-gray-300 to-slate-400
      relative overflow-hidden"
		>
		
			<div className="absolute -top-32 -left-32 w-96 h-96 bg-gray-400/30 rounded-full blur-3xl" />
			<div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gray-500/30 rounded-full blur-3xl" />

			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 w-full max-w-md relative z-10"
			>
				<motion.h2
					variants={item}
					className="text-2xl font-semibold text-center mb-6 text-gray-800"
				>
					Login
				</motion.h2>

				{error && (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-red-500 text-center mb-4"
					>
						{error}
					</motion.p>
				)}

				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<motion.input
						variants={item}
						type="email"
						name="email"
						placeholder="Email"
						value={form.email}
						onChange={handleChange}
						required
						className="bg-gray-50 border border-gray-300 rounded-lg p-3 w-full text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400"
					/>

					<motion.input
						variants={item}
						type="password"
						name="password"
						placeholder="Password"
						value={form.password}
						onChange={handleChange}
						required
						className="bg-gray-50 border border-gray-300 rounded-lg p-3 w-full text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400"
					/>

					<motion.button
						variants={item}
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
						disabled={loading}
						type="submit"
						className="bg-gray-800 text-white rounded-lg p-3 font-semibold hover:bg-gray-900 transition disabled:opacity-60"
					>
						{loading ? "Logging in..." : "Login"}
					</motion.button>
				</form>

				<motion.p
					variants={item}
					className="mt-4 text-center text-gray-500"
				>
					Don't have an account?{" "}
					<Link
						href="/signup"
						className="text-gray-800 font-medium hover:underline"
					>
						signup
					</Link>
				</motion.p>
			</motion.div>
		</div>
	);
}

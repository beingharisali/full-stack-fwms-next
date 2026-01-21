"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { register as registerUser } from "@/services/auth.api";

/* -------------------- Validation Schema -------------------- */
const signupSchema = z.object({
	firstName: z.string().min(2, "First name must be at least 2 characters"),
	lastName: z.string().min(2, "Last name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	role: z.enum(["driver", "manager", "admin"]),
});

type SignupFormData = z.infer<typeof signupSchema>;

/* -------------------- Animations -------------------- */
const container = {
	hidden: { opacity: 0, y: 30 },
	show: {
		opacity: 1,
		y: 0,
		transition: { staggerChildren: 0.1 },
	},
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

export default function SignupPage() {
	const router = useRouter();
	const [apiError, setApiError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		defaultValues: { role: "driver" },
	});

	const onSubmit = async (data: SignupFormData) => {
		setApiError(null);
		setLoading(true);

		try {
			const res = await registerUser(
				data.firstName,
				data.lastName,
				data.email,
				data.password,
				data.role
			);

			localStorage.setItem("token", res.token);
			localStorage.setItem("role", data.role);

			router.push(
				data.role === "driver"
					? "/dashboard/driver"
					: data.role === "manager"
					? "/manager"
					: "/admin"
			);
		} catch (err: any) {
			setApiError(err.response?.data?.msg || "Registration failed");
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
			{/* Background glow / shadow */}
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
					Create Account
				</motion.h2>

				{apiError && (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-red-500 text-center mb-4"
					>
						{apiError}
					</motion.p>
				)}

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					{[
						{ name: "firstName", placeholder: "First Name" },
						{ name: "lastName", placeholder: "Last Name" },
						{ name: "email", placeholder: "Email", type: "email" },
						{ name: "password", placeholder: "Password", type: "password" },
					].map((field) => (
						<motion.div key={field.name} variants={item}>
							<input
								type={field.type || "text"}
								{...register(field.name as keyof SignupFormData)}
								placeholder={field.placeholder}
								className="bg-gray-50 border border-gray-300 rounded-lg p-3 w-full text-gray-800"
							/>
							{errors[field.name as keyof SignupFormData] && (
								<p className="text-red-500 text-sm mt-1">
									{
										errors[field.name as keyof SignupFormData]
											?.message as string
									}
								</p>
							)}
						</motion.div>
					))}

					<motion.select
						variants={item}
						{...register("role")}
						className="bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-700"
					>
						<option value="driver">Driver</option>
						<option value="manager">Manager</option>
						<option value="admin">Admin</option>
					</motion.select>

					<motion.button
						variants={item}
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
						disabled={loading}
						type="submit"
						className="bg-gray-800 text-white rounded-lg p-3 font-semibold hover:bg-gray-900 transition disabled:opacity-60"
					>
						{loading ? "Creating account..." : "Signup"}
					</motion.button>
				</form>

				<motion.p
					variants={item}
					className="mt-4 text-center text-gray-500"
				>
					Already have an account?{" "}
					<Link
						href="/"
						className="text-gray-800 font-medium hover:underline"
					>
						login
					</Link>
				</motion.p>
			</motion.div>
		</div>
	);
}

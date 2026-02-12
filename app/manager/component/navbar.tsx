"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ViewType = "none" | "trips" | "drivers" | "vehicles";

interface NavbarProps {
    setView: (view: ViewType) => void;
    currentView: ViewType;
}

export default function Navbar({ setView, currentView }: NavbarProps) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/");
            return;
        }
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUser(payload);
        } catch {
            localStorage.removeItem("token");
            router.push("/");
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/");
    };

    if (!user) return <div className="p-4">Loading...</div>;

    return (
        <header className="bg-white shadow-md border-b px-8 py-4 mb-6">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-6">
                    <h2 className="text-xl font-bold text-gray-800">Fleet Watch</h2>
                    <button
                        onClick={() => setView("trips")}
                        className={`px-3 py-1 rounded ${currentView === "trips" ? "bg-gray-800 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                    > Trips </button>
                    <button
                        onClick={() => setView("drivers")}
                        className={`px-3 py-1 rounded ${currentView === "drivers" ? "bg-gray-800 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                    > Drivers </button>
                    <button
                        onClick={() => setView("vehicles")}
                        className={`px-3 py-1 rounded ${currentView === "vehicles" ? "bg-gray-800 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                    > Vehicles </button>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium">{user.firstName} {user.lastName}</span>
                    <button onClick={handleLogout} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">Logout</button>
                </div>
            </div>
        </header>
    );
}

    "use client";
    
    import { useRouter } from "next/navigation";
    import { useEffect, useState } from "react";
    
    export default function Navbar () {
      const router = useRouter();
      const [user, setUser] = useState<any>(null);
      const [users, setUsers] = useState<any[]>([]);
      const [vehicles, setVehicles] = useState<any[]>([]);
      const [tasks, setTasks] = useState<any[]>([]);
    
      useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/");
          return;
        }
    
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUser(payload);
        } catch (error) {
          localStorage.removeItem("token");
          router.push("/");
        }
         const storedUsers = localStorage.getItem("users");
    const storedVehicles = localStorage.getItem("vehicles");
    const storedTasks = localStorage.getItem("tasks");

    setUsers(storedUsers ? JSON.parse(storedUsers) : []);
    setVehicles(storedVehicles ? JSON.parse(storedVehicles) : []);
    setTasks(storedTasks ? JSON.parse(storedTasks) : []);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (!user) return <div>Loading...</div>;

  
  const usersPercentage = users.length > 0 ? Math.min(users.length * 10, 100) : 0;
  const vehiclesPercentage = vehicles.length > 0 ? Math.min(vehicles.length * 15, 100) : 0;
  const tasksPercentage = tasks.length > 0 ? Math.min(tasks.length * 20, 100) : 0;
  const systemUsagePercentage = Math.floor(Math.random() * 100); // mock system usage
    
    return (

        <div className="flex-1 flex flex-col">
        
        <header className="bg-white shadow flex justify-between items-center px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user.firstName} {user.lastName} | Role: {user.role}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </header>
        </div>
  );
}


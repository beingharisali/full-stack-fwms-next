import React from 'react'

function Sidebar() {
  return (
       <div className="flex min-h-screen bg-gray-100">
      
      <aside className="w-64 bg-white shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <nav className="flex flex-col space-y-2">
          <a href="#dashboard" className="px-4 py-2 rounded hover:bg-gray-200">Dashboard</a>
          <a href="#users" className="px-4 py-2 rounded hover:bg-gray-200">Users</a>
          <a href="#vehicles" className="px-4 py-2 rounded hover:bg-gray-200">Vehicles</a>
          <a href="#tasks" className="px-4 py-2 rounded hover:bg-gray-200">Tasks</a>
        </nav>
      </aside>

    </div>
  )
}

export default Sidebar;

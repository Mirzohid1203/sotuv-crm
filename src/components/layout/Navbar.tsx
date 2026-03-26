"use client";

import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { Bell, Menu, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header className="flex h-16 flex-shrink-0 items-center border-b border-gray-200 bg-white px-4 md:px-6 shadow-sm z-10">
      <Button variant="ghost" size="icon" className="md:hidden mr-2">
        <Menu className="h-6 w-6" />
      </Button>

      <div className="flex flex-1 justify-between">
        <div className="flex w-full max-w-md items-center relative text-gray-400 focus-within:text-gray-600 hidden sm:flex">
          <Search className="absolute left-3 w-4 h-4" />
          <input
            type="text"
            placeholder="Search clients, tasks..."
            className="w-full h-10 rounded-full bg-gray-100 pl-10 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          />
        </div>

        <div className="flex flex-1 sm:flex-none justify-end gap-3 items-center">
          <Button variant="ghost" size="icon" className="relative group hover:bg-gray-100 rounded-full">
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <Bell className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
          </Button>

          <div className="h-5 w-[1px] bg-gray-200 mx-1"></div>

          <div className="flex items-center gap-3 pl-2">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-semibold text-gray-700">{user?.displayName || "Admin User"}</span>
              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center uppercase border border-indigo-200 shadow-sm">
              {user?.displayName ? user.displayName.charAt(0) : "A"}
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-400 hover:text-red-600 rounded-full ml-1" title="Sign out">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

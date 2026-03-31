"use client";

import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { Bell, Menu, LogOut, Search, User } from "lucide-react";
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
    <header className="flex h-20 flex-shrink-0 items-center bg-white/70 backdrop-blur-md px-6 md:px-10 z-30 transition-all duration-300">
      <Button variant="ghost" size="icon" className="md:hidden mr-4 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl">
        <Menu className="h-6 w-6" />
      </Button>

      <div className="flex flex-1 justify-between items-center">
        <div className="flex w-full max-w-sm items-center relative group hidden sm:flex">
          <Search className="absolute left-4 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Qidiruv..."
            className="w-full h-12 rounded-2xl bg-gray-50 border-none pl-12 pr-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 shadow-inner"
          />
        </div>

        <div className="flex flex-1 sm:flex-none justify-end gap-6 items-center">
          <Button variant="ghost" size="icon" className="relative group hover:bg-indigo-50 rounded-2xl h-11 w-11">
            <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600 border-2 border-white"></span>
            </span>
            <Bell className="h-6 w-6 text-gray-500 group-hover:text-indigo-600 transition-colors" />
          </Button>

          <div className="h-8 w-[1px] bg-gray-100 hidden md:block"></div>

          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-black text-gray-900 leading-none">{user?.displayName || "Admin User"}</span>
              <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">{user?.email?.split('@')[0] || "admin"}</span>
            </div>
            
            <div className="relative">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-black flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:shadow-indigo-200 transition-all duration-300 group-hover:-translate-y-0.5">
                {user?.displayName ? user.displayName.charAt(0) : <User className="w-5 h-5" />}
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout} 
              className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl ml-2 w-10 h-10 transition-all" 
              title="Chiqish"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Columns, CheckSquare, Settings, Briefcase, ChevronRight } from "lucide-react";

const navigation = [
  { name: "Asosiy", href: "/dashboard", icon: LayoutDashboard },
  { name: "Mijozlar", href: "/dashboard/customers", icon: Users },
  { name: "Sotuv (Kanban)", href: "/dashboard/pipeline", icon: Columns },
  { name: "Vazifalar", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Sozlamalar", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div className={cn("w-72 flex-col border-r border-gray-100 bg-white/80 backdrop-blur-xl shadow-2xl shadow-indigo-100/20 shrink-0 z-20", className)}>
      <div className="flex h-24 items-center flex-shrink-0 px-8 gap-4">
        <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200">
          <Briefcase className="h-6 w-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-gray-900 tracking-tighter uppercase italic">Sotuv <span className="text-indigo-600">CRM</span></span>
          <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Premium Edition</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-2">
        <div className="px-4 mb-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Asosiy Menyu</p>
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300",
                isActive
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 translate-x-1"
                  : "text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
              )}
            >
              <div className="flex items-center">
                <item.icon
                  className={cn(
                    "mr-3 flex-shrink-0 h-5 w-5 transition-colors",
                    isActive ? "text-white" : "text-gray-400 group-hover:text-indigo-500"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </div>
              {isActive && (
                <ChevronRight className="w-4 h-4 text-white/70" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-6">
        <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-3xl p-5 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <p className="text-xs font-bold text-indigo-300 relative z-10">Yordam kerakmi?</p>
          <p className="text-[10px] text-white/60 mt-1 relative z-10 font-medium">Qo'llab-quvvatlash jamoasi bilan bog'laning</p>
          <a 
            href="https://t.me/Mahmudaaliyev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-[10px] font-black rounded-xl transition-colors relative z-10 uppercase tracking-wider block text-center"
          >
            Yordam Markazi
          </a>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useAuth } from "@/context/AuthContext";
import { StatCard } from "@/components/ui/StatCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { Users, DollarSign, TrendingUp, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Dummy data representing typical CRM analytics
  const recentActivities = [
    { id: 1, text: "Closed deal with TechCorp", time: "2 hours ago", type: "success" },
    { id: 2, text: "New lead assigned: John Smith", time: "4 hours ago", type: "info" },
    { id: 3, text: "Meeting scheduled for next week", time: "5 hours ago", type: "warning" },
    { id: 4, text: "Follow up with Sarah Jenkins", time: "1 day ago", type: "info" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, {user?.displayName || "Admin"}. Here's what's happening today.
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Revenue" 
          value="$45,231.89" 
          icon={<DollarSign className="h-6 w-6" />} 
          trend="20.1% higher"
          trendPositive={true}
        />
        <StatCard 
          title="Active Clients" 
          value="235" 
          icon={<Users className="h-6 w-6" />} 
          trend="42 added this month"
          trendPositive={true}
        />
        <StatCard 
          title="Deals Won" 
          value="48" 
          icon={<TrendingUp className="h-6 w-6" />} 
          trend="12% vs last month"
          trendPositive={true}
        />
        <StatCard 
          title="Pending Tasks" 
          value="12" 
          icon={<CheckCircle className="h-6 w-6" />} 
          trend="3 overdue"
          trendPositive={false}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Chart */}
        <SalesChart />
        
        {/* Recent Activity */}
        <Card className="col-span-1 shadow-sm border-none ring-1 ring-gray-200/50 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <span className="flex h-2 w-2 mt-2 rounded-full relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none text-gray-900 text-balance">{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

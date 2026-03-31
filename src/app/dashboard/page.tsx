"use client";

import { useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCrmStore } from "@/store/crmStore";
import { StatCard } from "@/components/ui/StatCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { Users, DollarSign, TrendingUp, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const { user } = useAuth();
  const { deals, customers, tasks, fetchDeals, fetchCustomers, fetchTasks } = useCrmStore();

  useEffect(() => {
    fetchDeals();
    fetchCustomers();
    fetchTasks();
  }, [fetchDeals, fetchCustomers, fetchTasks]);

  // Calculate real metrics
  const stats = useMemo(() => {
    const totalRevenue = deals
      .filter(d => d.stage === "Closed Won")
      .reduce((sum, d) => sum + (d.value || 0), 0);
    
    const activeClients = customers.length;
    const dealsWon = deals.filter(d => d.stage === "Closed Won").length;
    const pendingTasks = tasks.filter(t => !t.completed).length;

    return {
      totalRevenue: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalRevenue),
      activeClients,
      dealsWon,
      pendingTasks
    };
  }, [deals, customers, tasks]);

  // Generate real activity feed from deals and tasks
  const activities = useMemo(() => {
    const dealActivities = deals.slice(0, 5).map(deal => ({
      id: `deal-${deal.id}`,
      text: `${deal.stage === "Closed Won" ? "Won" : "Updated"} deal: ${deal.title}`,
      subtext: deal.customerName ? `Client: ${deal.customerName}` : `$${deal.value}`,
      time: deal.updatedAt?.toDate ? formatDistanceToNow(deal.updatedAt.toDate(), { addSuffix: true }) : "Recently",
      icon: deal.stage === "Closed Won" ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <TrendingUp className="w-4 h-4 text-indigo-500" />,
      color: deal.stage === "Closed Won" ? "bg-emerald-50" : "bg-indigo-50"
    }));

    const taskActivities = tasks.slice(0, 3).map(task => ({
      id: `task-${task.id}`,
      text: `New task: ${task.title}`,
      subtext: `Due: ${task.dueDate}`,
      time: "Just now",
      icon: <Clock className="w-4 h-4 text-amber-500" />,
      color: "bg-amber-50"
    }));

    return [...dealActivities, ...taskActivities].sort(() => Math.random() - 0.5).slice(0, 6);
  }, [deals, tasks]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Salom, <span className="text-indigo-600 font-bold">{user?.displayName || "Admin"}</span>. Bugungi holat bilan tanishing.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Updates
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Umumiy Tushum" 
          value={stats.totalRevenue} 
          icon={<DollarSign className="h-6 w-6" />} 
          trend="20.1% o'sish"
          trendPositive={true}
          gradient="bg-indigo-600"
          className="bg-indigo-600 text-white"
        />
        <StatCard 
          title="Mijozlar" 
          value={stats.activeClients} 
          icon={<Users className="h-6 w-6" />} 
          trend={`${stats.activeClients} ta jami`}
          trendPositive={true}
        />
        <StatCard 
          title="Yopilgan Shartnomalar" 
          value={stats.dealsWon} 
          icon={<TrendingUp className="h-6 w-6" />} 
          trend="12% o'tgan oyga nisbatan"
          trendPositive={true}
        />
        <StatCard 
          title="Kutilayotgan Vazifalar" 
          value={stats.pendingTasks} 
          icon={<CheckCircle className="h-6 w-6" />} 
          trend={`${stats.pendingTasks} ta bajarilmagan`}
          trendPositive={false}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        
        {/* Recent Activity */}
        <Card className="border-none shadow-xl bg-white/50 backdrop-blur-xl rounded-3xl overflow-hidden ring-1 ring-gray-200/50">
          <CardHeader className="border-b border-gray-100/50 bg-gray-50/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                Oxirgi Harakatlar
              </CardTitle>
              <button className="text-indigo-600 text-xs font-bold hover:underline flex items-center gap-1">
                Hammasi <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-white transition-colors group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className={`p-2.5 rounded-2xl ${activity.color} group-hover:scale-110 transition-transform`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                            {activity.text}
                          </p>
                          <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap ml-2">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{activity.subtext}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium whitespace-pre-wrap">Hozircha harakatlar yo'q</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


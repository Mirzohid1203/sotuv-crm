"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useCrmStore } from "@/store/crmStore";

export function SalesChart() {
  const { deals } = useCrmStore();

  const realData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    
    // Initialize monthly totals
    const monthlyTotals: Record<string, number> = months.reduce((acc, month) => {
      acc[month] = 0;
      return acc;
    }, {} as Record<string, number>);

    // Populate with real data
    deals.filter(d => d.stage === "Closed Won" && d.updatedAt).forEach(deal => {
      const date = deal.updatedAt?.toDate ? deal.updatedAt.toDate() : new Date();
      if (date.getFullYear() === currentYear) {
        const monthName = months[date.getMonth()];
        monthlyTotals[monthName] += (deal.value || 0);
      }
    });

    return months.map(name => ({
      name,
      sales: monthlyTotals[name]
    }));
  }, [deals]);

  const totalThisYear = useMemo(() => 
    realData.reduce((sum, item) => sum + item.sales, 0), 
    [realData]
  );

  return (
    <Card className="col-span-1 md:col-span-2 shadow-xl border-none ring-1 ring-gray-200/50 rounded-3xl overflow-hidden bg-white/70 backdrop-blur-md">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-end">
          <div>
            <CardTitle className="text-xl font-black text-gray-900">Daromad Oqimi</CardTitle>
            <p className="text-xs text-gray-500 font-medium">Joriy yilgi tushumlar tahlili</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Jami</p>
            <p className="text-lg font-black text-indigo-600">
              ${totalThisYear.toLocaleString()}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="h-[320px] w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={realData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis
                hide={true}
              />
              <Tooltip
                cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                contentStyle={{ 
                  borderRadius: "16px", 
                  border: "none", 
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                  padding: "12px",
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)"
                }}
                itemStyle={{ color: "#4f46e5", fontWeight: "900", fontSize: "14px" }}
                labelStyle={{ color: "#64748b", fontSize: "11px", fontWeight: "700", marginBottom: "4px" }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Daromad']}
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#6366f1" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorSales)"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}


import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
  className?: string;
  gradient?: string;
}

export function StatCard({ title, value, icon, trend, trendPositive, className, gradient }: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden border-none shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group", className)}>
      {/* Background Decor */}
      <div className={cn("absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-110", gradient || "bg-indigo-500")}></div>
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className={cn("p-3 rounded-2xl shadow-inner transition-colors duration-300", 
            gradient ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100")}>
            {icon}
          </div>
          {trend && (
            <span
              className={cn(
                "text-xs font-bold rounded-full px-2.5 py-1 backdrop-blur-md",
                trendPositive
                  ? "text-emerald-700 bg-emerald-500/10 border border-emerald-500/20"
                  : "text-rose-700 bg-rose-500/10 border border-rose-500/20"
              )}
            >
              {trendPositive ? "↑" : "↓"} {trend}
            </span>
          )}
        </div>
        
        <div className="mt-5">
          <p className={cn("text-xs font-bold uppercase tracking-wider", gradient ? "text-white/70" : "text-gray-500")}>
            {title}
          </p>
          <h2 className={cn("text-3xl font-black mt-1", gradient ? "text-white" : "text-gray-900")}>
            {value}
          </h2>
        </div>
      </CardContent>
    </Card>
  );
}


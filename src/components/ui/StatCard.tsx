import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
  className?: string;
}

export function StatCard({ title, value, icon, trend, trendPositive, className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden border-none shadow-md ring-1 ring-gray-200/50", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <div className="flex items-baseline mt-1 space-x-2">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h2>
              {trend && (
                <span
                  className={cn(
                    "text-sm font-semibold rounded-full px-2 py-0.5",
                    trendPositive
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-rose-700 bg-rose-50"
                  )}
                >
                  {trendPositive ? "+" : ""}
                  {trend}
                </span>
              )}
            </div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

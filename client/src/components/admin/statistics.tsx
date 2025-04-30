import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Loader2, Package, Tag, Megaphone, MessageSquare, Image } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface AdminStats {
  productCount: number;
  categoryCount: number;
  offerCount: number;
  messageCount: number;
  mediaCount: number;
}

export default function Statistics() {
  const { data: stats, isLoading, error } = useQuery<AdminStats, Error>({
    queryKey: ["/api/admin/stats"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error.message || "Failed to load statistics."}
      </div>
    );
  }

  const statCards = [
    {
      title: "Products",
      value: stats?.productCount || 0,
      icon: <Package className="h-5 w-5 text-blue-500" />,
      bgClass: "bg-blue-50",
    },
    {
      title: "Categories",
      value: stats?.categoryCount || 0,
      icon: <Tag className="h-5 w-5 text-indigo-500" />,
      bgClass: "bg-indigo-50",
    },
    {
      title: "Offers",
      value: stats?.offerCount || 0,
      icon: <Megaphone className="h-5 w-5 text-yellow-500" />,
      bgClass: "bg-yellow-50",
    },
    {
      title: "Messages",
      value: stats?.messageCount || 0,
      icon: <MessageSquare className="h-5 w-5 text-emerald-500" />,
      bgClass: "bg-emerald-50",
    },
    {
      title: "Media Files",
      value: stats?.mediaCount || 0,
      icon: <Image className="h-5 w-5 text-rose-500" />,
      bgClass: "bg-rose-50",
    },
  ];

  const chartData = statCards.map((stat) => ({
    name: stat.title,
    value: stat.value,
  }));

  const COLORS = ["#3b82f6", "#6366f1", "#eab308", "#10b981", "#f43f5e"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bgClass}`}>{stat.icon}</div>
              <div>
                <p className="text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Share</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart width={400} height={300}>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
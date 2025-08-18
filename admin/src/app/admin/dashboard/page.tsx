"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Wrench,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  UserPlus,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DashboardStats {
  totalUsers: number;
  totalLabour: number;
  totalBookings: number;
  totalRevenue: number;
  totalReferrals: number;
  userGrowth: number;
  bookingGrowth: number;
  revenueGrowth: number;
  labourGrowth: number;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalLabour: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalReferrals: 0,
    userGrowth: 0,
    bookingGrowth: 0,
    revenueGrowth: 0,
    labourGrowth: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, activityRes] = await Promise.all([
        fetch("/api/admin/dashboard/stats"),
        fetch("/api/admin/dashboard/activity"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setRecentActivity(activityData);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      growth: stats.userGrowth,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Total Labour",
      value: stats.totalLabour.toLocaleString(),
      icon: Wrench,
      growth: stats.labourGrowth,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      icon: Calendar,
      growth: stats.bookingGrowth,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      growth: stats.revenueGrowth,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      title: "Total Referrals",
      value: stats.totalReferrals.toLocaleString(),
      icon: UserPlus,
      growth: 0,
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
    },
  ];

  const exportData = () => {
    toast({
      title: "Export",
      description: "Data exported successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchDashboardData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 mb-8">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                  <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          statCards.map((card) => (
            <Card key={card.title} className="hover:shadow-lg transition-all duration-200 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {card.value}
                    </p>
                    {card.growth !== 0 && (
                      <div className="flex items-center mt-2">
                        {card.growth >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1 flex-shrink-0" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1 flex-shrink-0" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            card.growth >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {card.growth > 0 ? '+' : ''}{card.growth.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    className={`${card.bgColor} p-3 rounded-xl ${card.color} flex-shrink-0`}
                  >
                    <card.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {activity.type}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col hover:bg-blue-50 hover:border-blue-200 transition-colors"
                onClick={() => window.location.href = '/admin/users'}
              >
                <Users className="h-6 w-6 mb-2 text-blue-600" />
                <span className="text-sm font-medium">Manage Users</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col hover:bg-green-50 hover:border-green-200 transition-colors"
                onClick={() => window.location.href = '/admin/labour'}
              >
                <Wrench className="h-6 w-6 mb-2 text-green-600" />
                <span className="text-sm font-medium">Manage Labour</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col hover:bg-purple-50 hover:border-purple-200 transition-colors"
                onClick={() => window.location.href = '/admin/bookings'}
              >
                <Calendar className="h-6 w-6 mb-2 text-purple-600" />
                <span className="text-sm font-medium">View Bookings</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col hover:bg-pink-50 hover:border-pink-200 transition-colors"
                onClick={() => window.location.href = '/admin/referrals'}
              >
                <UserPlus className="h-6 w-6 mb-2 text-pink-600" />
                <span className="text-sm font-medium">View Referrals</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
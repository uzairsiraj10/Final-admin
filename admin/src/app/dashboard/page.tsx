"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Plane,
  Hotel,
  Car,
  Map,
  Home,
  CalendarCheck,
  CreditCard,
} from "lucide-react";

interface Stats {
  flights: number;
  hotels: number;
  cars: number;
  tours: number;
  properties: number;
  bookings: number;
  payments: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    flights: 0,
    hotels: 0,
    cars: 0,
    tours: 0,
    properties: 0,
    bookings: 0,
    payments: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Flights",
      value: stats.flights,
      icon: Plane,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Hotels",
      value: stats.hotels,
      icon: Hotel,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Cars",
      value: stats.cars,
      icon: Car,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Tours",
      value: stats.tours,
      icon: Map,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Properties",
      value: stats.properties,
      icon: Home,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Bookings",
      value: stats.bookings,
      icon: CalendarCheck,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Payments",
      value: stats.payments,
      icon: CreditCard,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card
            key={card.title}
            className="airbnb-style-card flex items-center space-x-4"
          >
            <div
              className={`${card.bgColor} p-4 rounded-xl ${card.color}`}
            >
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                {card.title}
              </p>
              <h2 className="text-3xl font-bold">{card.value}</h2>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 
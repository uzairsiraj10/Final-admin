"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

export type Booking = {
  id: number;
  customer: string;
  labour: string;
  category: string;
  status: string;
  scheduled_date: string;
  amount: number;
};

export const columns: ColumnDef<Booking>[] = [
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "labour", header: "Labour" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge>{row.getValue("status")}</Badge> },
  { accessorKey: "scheduled_date", header: "Scheduled Date" },
  { accessorKey: "amount", header: "Amount" },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
        <Button size="icon" variant="ghost" className="text-red-600"><Trash className="h-4 w-4" /></Button>
      </div>
    ),
  },
];
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

export type Labour = {
  id: number;
  name: string;
  category: string;
  status: string;
  rating: number;
  city: string;
};

export const columns: ColumnDef<Labour>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge>{row.getValue("status")}</Badge> },
  { accessorKey: "rating", header: "Rating" },
  { accessorKey: "city", header: "City" },
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
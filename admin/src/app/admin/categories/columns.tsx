"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

export type Category = {
  id: number;
  name_en: string;
  name_ur: string;
  description_en: string;
  status: string;
};

export const columns: ColumnDef<Category>[] = [
  { accessorKey: "name_en", header: "Name (EN)" },
  { accessorKey: "name_ur", header: "Name (UR)" },
  { accessorKey: "description_en", header: "Description" },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge>{row.getValue("status")}</Badge> },
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
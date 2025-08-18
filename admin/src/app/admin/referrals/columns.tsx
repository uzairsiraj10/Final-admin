"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, Trash, MoreHorizontal, Phone, Mail } from "lucide-react";

export interface Referral {
  id: number;
  referrer_name: string;
  referrer_email: string;
  referrer_phone: string;
  referred_name: string;
  referred_email: string;
  referred_phone: string;
  referred_category: string;
  status: "pending" | "contacted" | "registered" | "rejected";
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface ColumnsProps {
  onEdit: (referral: Referral) => void;
  onDelete: (referralId: number) => void;
}

export const createColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Referral>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "referrer_name",
    header: "Referrer",
    cell: ({ row }) => {
      const referral = row.original;
      return (
        <div>
          <div className="font-medium">{referral.referrer_name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {referral.referrer_email}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <Phone className="h-3 w-3" />
            {referral.referrer_phone}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "referred_name",
    header: "Referred Person",
    cell: ({ row }) => {
      const referral = row.original;
      return (
        <div>
          <div className="font-medium">{referral.referred_name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {referral.referred_email}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <Phone className="h-3 w-3" />
            {referral.referred_phone}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "referred_category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        {row.getValue("referred_category")}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending" },
        contacted: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Contacted" },
        registered: { color: "bg-green-100 text-green-800 border-green-200", label: "Registered" },
        rejected: { color: "bg-red-100 text-red-800 border-red-200", label: "Rejected" },
      };
      
      const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
      
      return (
        <Badge className={config.color}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Submitted",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <div className="text-sm text-gray-600">{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const referral = row.original;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(referral)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(referral.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Backward compatibility - default columns without actions
export const columns: ColumnDef<Referral>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "referrer_name",
    header: "Referrer",
    cell: ({ row }) => {
      const referral = row.original;
      return (
        <div>
          <div className="font-medium">{referral.referrer_name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{referral.referrer_email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "referred_name",
    header: "Referred Person",
    cell: ({ row }) => {
      const referral = row.original;
      return (
        <div>
          <div className="font-medium">{referral.referred_name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{referral.referred_email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "referred_category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        {row.getValue("referred_category")}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig = {
        pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
        contacted: { color: "bg-blue-100 text-blue-800", label: "Contacted" },
        registered: { color: "bg-green-100 text-green-800", label: "Registered" },
        rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
      };
      
      const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
      
      return (
        <Badge className={config.color}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Submitted",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <div className="text-sm text-gray-600">{date.toLocaleDateString()}</div>;
    },
  },
];

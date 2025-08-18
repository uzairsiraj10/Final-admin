"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Plus, Search, Download, Wrench, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { LabourDialog } from "./labour-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Labour {
  id: number;
  name: string;
  category_id: number;
  category_name?: string;
  status: string;
  rating: number;
  city: string;
  phone: string;
  email?: string;
  description?: string;
  experience_years?: number;
  hourly_rate?: number;
  created_at: string;
}

export default function LabourPage() {
  const [labours, setLabours] = useState<Labour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLabour, setEditingLabour] = useState<Labour | null>(null);
  const { toast } = useToast();

  // Fetch labour profiles
  const fetchLabours = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/labour");
      if (!response.ok) throw new Error("Failed to fetch labour profiles");
      const data = await response.json();
      setLabours(data);
    } catch (error) {
      console.error("Error fetching labours:", error);
      toast({
        title: "Error",
        description: "Failed to load labour profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabours();
  }, []);

  // Filter labours based on search term
  const filteredLabours = useMemo(() => {
    return labours.filter(labour =>
      labour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (labour.category_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      labour.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      labour.phone.includes(searchTerm)
    );
  }, [labours, searchTerm]);

  // Handle labour creation/update
  const handleLabourSubmit = async (labourData: any) => {
    try {
      const url = editingLabour 
        ? `/api/admin/labour/${editingLabour.id}` 
        : "/api/admin/labour";
      
      const method = editingLabour ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(labourData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save labour profile");
      }

      toast({
        title: "Success",
        description: editingLabour ? "Labour profile updated successfully" : "Labour profile created successfully",
      });

      setIsDialogOpen(false);
      setEditingLabour(null);
      fetchLabours(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save labour profile",
        variant: "destructive",
      });
    }
  };

  // Handle labour deletion
  const handleDeleteLabour = async (labourId: number) => {
    if (!confirm("Are you sure you want to delete this labour profile?")) return;

    try {
      const response = await fetch(`/api/admin/labour/${labourId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete labour profile");
      }

      toast({
        title: "Success",
        description: "Labour profile deleted successfully",
      });

      fetchLabours(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete labour profile",
        variant: "destructive",
      });
    }
  };

  // Handle edit labour
  const handleEditLabour = (labour: Labour) => {
    setEditingLabour(labour);
    setIsDialogOpen(true);
  };

  // Create columns with action buttons
  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: any) => <div className="font-mono text-sm">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: any) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "category_name",
      header: "Category",
      cell: ({ row }: any) => (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {row.getValue("category_name") || "N/A"}
        </Badge>
      ),
    },
    {
      accessorKey: "city",
      header: "City",
      cell: ({ row }: any) => <div className="text-sm">{row.getValue("city")}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }: any) => <div className="text-sm font-mono">{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        return (
          <Badge
            variant={
              status === "approved" ? "default" : 
              status === "pending" ? "secondary" : "destructive"
            }
            className={
              status === "approved" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
              status === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
              "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }: any) => {
        const rating = row.getValue("rating");
        return (
          <div className="flex items-center">
            <span className="text-sm font-medium">{rating?.toFixed(1) || "0.0"}</span>
            <span className="text-xs text-gray-500 ml-1">★</span>
          </div>
        );
      },
    },
    {
      accessorKey: "hourly_rate",
      header: "Rate",
      cell: ({ row }: any) => {
        const rate = row.getValue("hourly_rate");
        return rate ? <div className="text-sm">PKR {rate}/hr</div> : <div className="text-sm text-gray-400">-</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const labour = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditLabour(labour)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDeleteLabour(labour.id)}
                className="text-red-600 dark:text-red-400"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], []);

  // Export labours to CSV
  const exportToCSV = () => {
    const headers = ["Name", "Category", "City", "Phone", "Email", "Status", "Rating", "Experience", "Rate", "Created At"];
    const csvContent = [
      headers.join(","),
      ...filteredLabours.map(labour => [
        labour.name,
        labour.category_name || "",
        labour.city,
        labour.phone,
        labour.email || "",
        labour.status,
        labour.rating?.toString() || "0",
        labour.experience_years?.toString() || "0",
        labour.hourly_rate?.toString() || "0",
        new Date(labour.created_at).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "labour-profiles.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Labour Profiles</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage skilled labour profiles and their information
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingLabour(null);
            setIsDialogOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Labour
        </Button>
      </div>

      <Card className="shadow-sm border-gray-200 dark:border-gray-700">
        <CardHeader className="bg-white dark:bg-gray-800 border-b">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            All Labour Profiles ({filteredLabours.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search labour profiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={exportToCSV}
              disabled={loading || filteredLabours.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          {!loading && filteredLabours.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Wrench className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No labour profiles found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-sm">
                {searchTerm ? "No profiles match your search criteria." : "Get started by adding your first labour profile."}
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => {
                    setEditingLabour(null);
                    setIsDialogOpen(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Labour Profile
                </Button>
              )}
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredLabours}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>

      <LabourDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingLabour(null);
        }}
        onSubmit={handleLabourSubmit}
        editingLabour={editingLabour}
      />
    </div>
  );
} 
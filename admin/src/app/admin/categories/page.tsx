"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Plus, Search, Download, FolderOpen, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CategoryDialog } from "./category-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: number;
  name: string;
  name_urdu?: string;
  description?: string;
  status: string;
  created_at: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.name_urdu?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (category.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      category.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  // Handle category creation/update
  const handleCategorySubmit = async (categoryData: any) => {
    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}` 
        : "/api/admin/categories";
      
      const method = editingCategory ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save category");
      }

      toast({
        title: "Success",
        description: editingCategory ? "Category updated successfully" : "Category created successfully",
      });

      setIsDialogOpen(false);
      setEditingCategory(null);
      fetchCategories(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save category",
        variant: "destructive",
      });
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete category");
      }

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });

      fetchCategories(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  // Handle edit category
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
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
      header: "Name (English)",
      cell: ({ row }: any) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "name_urdu",
      header: "Name (Urdu)",
      cell: ({ row }: any) => <div className="text-sm">{row.getValue("name_urdu") || "-"}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: any) => {
        const description = row.getValue("description");
        return (
          <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
            {description || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        return (
          <Badge
            variant={status === "active" ? "default" : "secondary"}
            className={
              status === "active" 
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }: any) => {
        const date = new Date(row.getValue("created_at"));
        return <div className="text-sm">{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const category = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDeleteCategory(category.id)}
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

  // Export categories to CSV
  const exportToCSV = () => {
    const headers = ["ID", "Name (English)", "Name (Urdu)", "Description", "Status", "Created At"];
    const csvContent = [
      headers.join(","),
      ...filteredCategories.map(category => [
        category.id,
        category.name,
        category.name_urdu || "",
        category.description || "",
        category.status,
        new Date(category.created_at).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "categories.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Categories</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage service categories and their information
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingCategory(null);
            setIsDialogOpen(true);
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card className="shadow-sm border-gray-200 dark:border-gray-700">
        <CardHeader className="bg-white dark:bg-gray-800 border-b">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            All Categories ({filteredCategories.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={exportToCSV}
              disabled={loading || filteredCategories.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          {!loading && filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No categories found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-sm">
                {searchTerm ? "No categories match your search criteria." : "Get started by creating your first category."}
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => {
                    setEditingCategory(null);
                    setIsDialogOpen(true);
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              )}
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredCategories}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>

      <CategoryDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleCategorySubmit}
        editingCategory={editingCategory}
      />
    </div>
  );
} 
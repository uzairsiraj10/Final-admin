"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Plus, Search, Download, Calendar, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { BookingDialog } from "./booking-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Booking {
  id: number;
  customer_id: number;
  labour_id?: number;
  category_id: number;
  status: string;
  scheduled_date: string;
  amount?: number;
  description?: string;
  address?: string;
  customer_name?: string;
  customer_email?: string;
  labour_name?: string;
  category_name?: string;
  created_at: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const { toast } = useToast();

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/bookings");
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings based on search term
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking =>
      (booking.customer_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (booking.labour_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (booking.category_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toString().includes(searchTerm)
    );
  }, [bookings, searchTerm]);

  // Handle booking creation/update
  const handleBookingSubmit = async (bookingData: any) => {
    try {
      const url = editingBooking 
        ? `/api/admin/bookings/${editingBooking.id}` 
        : "/api/admin/bookings";
      
      const method = editingBooking ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save booking");
      }

      toast({
        title: "Success",
        description: editingBooking ? "Booking updated successfully" : "Booking created successfully",
      });

      setIsDialogOpen(false);
      setEditingBooking(null);
      fetchBookings(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save booking",
        variant: "destructive",
      });
    }
  };

  // Handle booking deletion
  const handleDeleteBooking = async (bookingId: number) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete booking");
      }

      toast({
        title: "Success",
        description: "Booking deleted successfully",
      });

      fetchBookings(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete booking",
        variant: "destructive",
      });
    }
  };

  // Handle edit booking
  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
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
      accessorKey: "customer_name",
      header: "Customer",
      cell: ({ row }: any) => <div className="font-medium">{row.getValue("customer_name") || "N/A"}</div>,
    },
    {
      accessorKey: "labour_name",
      header: "Labour",
      cell: ({ row }: any) => <div className="text-sm">{row.getValue("labour_name") || "Unassigned"}</div>,
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        return (
          <Badge
            variant={
              status === "completed" ? "default" : 
              status === "confirmed" ? "secondary" :
              status === "in_progress" ? "secondary" :
              status === "cancelled" ? "destructive" : "secondary"
            }
            className={
              status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
              status === "confirmed" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
              status === "in_progress" ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" :
              status === "cancelled" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "scheduled_date",
      header: "Scheduled",
      cell: ({ row }: any) => {
        const date = new Date(row.getValue("scheduled_date"));
        return <div className="text-sm">{date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>;
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }: any) => {
        const amount = row.getValue("amount");
        return amount ? <div className="text-sm font-medium">PKR {amount}</div> : <div className="text-sm text-gray-400">-</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const booking = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditBooking(booking)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDeleteBooking(booking.id)}
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

  // Export bookings to CSV
  const exportToCSV = () => {
    const headers = ["ID", "Customer", "Labour", "Category", "Status", "Scheduled Date", "Amount", "Address", "Created At"];
    const csvContent = [
      headers.join(","),
      ...filteredBookings.map(booking => [
        booking.id,
        booking.customer_name || "",
        booking.labour_name || "",
        booking.category_name || "",
        booking.status,
        new Date(booking.scheduled_date).toLocaleDateString(),
        booking.amount?.toString() || "0",
        booking.address || "",
        new Date(booking.created_at).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookings.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Bookings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage service bookings and appointments
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingBooking(null);
            setIsDialogOpen(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Booking
        </Button>
      </div>

      <Card className="shadow-sm border-gray-200 dark:border-gray-700">
        <CardHeader className="bg-white dark:bg-gray-800 border-b">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            All Bookings ({filteredBookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={exportToCSV}
              disabled={loading || filteredBookings.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          {!loading && filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Calendar className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No bookings found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-sm">
                {searchTerm ? "No bookings match your search criteria." : "Get started by creating your first booking."}
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => {
                    setEditingBooking(null);
                    setIsDialogOpen(true);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Booking
                </Button>
              )}
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredBookings}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>

      <BookingDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingBooking(null);
        }}
        onSubmit={handleBookingSubmit}
        editingBooking={editingBooking}
      />
    </div>
  );
}
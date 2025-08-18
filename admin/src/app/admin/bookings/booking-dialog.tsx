"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const bookingSchema = z.object({
  customer_id: z.string().min(1, "Customer is required"),
  labour_id: z.string().optional(),
  category_id: z.string().min(1, "Category is required"),
  status: z.enum(["pending", "confirmed", "in_progress", "completed", "cancelled"]),
  scheduled_date: z.string().min(1, "Scheduled date is required"),
  amount: z.number().min(0).optional(),
  description: z.string().optional(),
  address: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

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
  labour_name?: string;
  category_name?: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
}

interface Labour {
  id: number;
  name: string;
  category_name: string;
}

interface Category {
  id: number;
  name: string;
}

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookingFormData) => Promise<void>;
  editingBooking: Booking | null;
}

export function BookingDialog({ isOpen, onClose, onSubmit, editingBooking }: BookingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [labours, setLabours] = useState<Labour[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customer_id: "",
      labour_id: "",
      category_id: "",
      status: "pending",
      scheduled_date: "",
      amount: 0,
      description: "",
      address: "",
    },
  });

  // Fetch data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customers
        const customersResponse = await fetch("/api/admin/users");
        if (customersResponse.ok) {
          const customersData = await customersResponse.json();
          setCustomers(customersData.filter((user: any) => user.role === "customer"));
        }

        // Fetch labour profiles
        const laboursResponse = await fetch("/api/admin/labour");
        if (laboursResponse.ok) {
          const laboursData = await laboursResponse.json();
          setLabours(laboursData.filter((labour: any) => labour.status === "approved"));
        }

        // Fetch categories
        const categoriesResponse = await fetch("/api/admin/categories");
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };
    fetchData();
  }, []);

  // Update form when editing booking changes
  useEffect(() => {
    if (editingBooking) {
      // Format date for datetime-local input
      const scheduledDate = new Date(editingBooking.scheduled_date);
      const formattedDate = scheduledDate.toISOString().slice(0, 16);

      form.reset({
        customer_id: editingBooking.customer_id.toString(),
        labour_id: editingBooking.labour_id?.toString() || "",
        category_id: editingBooking.category_id.toString(),
        status: editingBooking.status as any,
        scheduled_date: formattedDate,
        amount: editingBooking.amount || 0,
        description: editingBooking.description || "",
        address: editingBooking.address || "",
      });
    } else {
      form.reset({
        customer_id: "",
        labour_id: "",
        category_id: "",
        status: "pending",
        scheduled_date: "",
        amount: 0,
        description: "",
        address: "",
      });
    }
  }, [editingBooking, form]);

  const handleSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      // Convert string values to appropriate types
      const submitData = {
        ...data,
        customer_id: parseInt(data.customer_id),
        labour_id: data.labour_id ? parseInt(data.labour_id) : null,
        category_id: parseInt(data.category_id),
        amount: data.amount || 0,
      };
      await onSubmit(submitData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingBooking ? "Edit Booking" : "Create New Booking"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.name} ({customer.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="labour_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Labour (Optional)</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select labour" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">No labour assigned</SelectItem>
                        {labours.map((labour) => (
                          <SelectItem key={labour.id} value={labour.id.toString()}>
                            {labour.name} - {labour.category_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduled_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scheduled Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (PKR)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Service address"
                      className="min-h-[60px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional details about the booking"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingBooking ? "Update" : "Create"}
              </Button>
          </DialogFooter>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 
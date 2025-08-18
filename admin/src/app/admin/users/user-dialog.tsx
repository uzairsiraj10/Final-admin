"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User } from "./columns";

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  role: z.enum(["admin", "staff"]),
  status: z.enum(["active", "suspended"]),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  onSubmit: (data: UserFormData) => Promise<void>;
}

export function UserDialog({ open, onOpenChange, user, onSubmit }: UserDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema.refine((data) => {
      // If editing user, password is optional
      // If creating user, password is required
      if (!user && !data.password) {
        return false;
      }
      return true;
    }, {
      message: "Password is required for new users",
      path: ["password"]
    })),
    defaultValues: {
      name: "",
      email: "",
      role: "staff",
      status: "active",
      password: "",
    }
  });

  const { register, handleSubmit, reset, setValue, formState: { errors }, watch } = form;

  useEffect(() => {
    if (open) {
      if (user) {
        setValue("name", user.name);
        setValue("email", user.email);
        setValue("role", user.role as "admin" | "staff");
        setValue("status", user.status as "active" | "suspended");
        setValue("password", "");
      } else {
        reset({
          name: "",
          email: "",
          role: "staff",
          status: "active",
          password: "",
        });
      }
    }
  }, [user, setValue, reset, open]);

  const handleFormSubmit = async (data: UserFormData) => {
    setLoading(true);
    try {
      // Don't send empty password for existing users
      const submitData = { ...data };
      if (user && !submitData.password) {
        delete submitData.password;
      }
      
      await onSubmit(submitData);
      onOpenChange(false);
      reset();
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter full name"
              className={errors.name ? "border-red-500 focus:border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm flex items-center">
                {errors.name.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter email address"
              className={errors.email ? "border-red-500 focus:border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm flex items-center">
                {errors.email.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">
              {user ? "New Password (leave blank to keep current)" : "Password *"}
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder={user ? "Enter new password" : "Enter password"}
              className={errors.password ? "border-red-500 focus:border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-red-500 text-sm flex items-center">
                {errors.password.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select 
              onValueChange={(value) => setValue("role", value as "admin" | "staff")}
              value={watch("role")}
            >
              <SelectTrigger className={errors.role ? "border-red-500 focus:border-red-500" : ""}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-red-500 text-sm flex items-center">
                {errors.role.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select 
              onValueChange={(value) => setValue("status", value as "active" | "suspended")}
              value={watch("status")}
            >
              <SelectTrigger className={errors.status ? "border-red-500 focus:border-red-500" : ""}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-sm flex items-center">
                {errors.status.message}
              </p>
            )}
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {user ? "Updating..." : "Creating..."}
                </>
              ) : (
                user ? "Update User" : "Create User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
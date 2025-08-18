"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Referral } from "./columns";

const referralSchema = z.object({
  referrer_name: z.string().min(2, "Name must be at least 2 characters"),
  referrer_email: z.string().email("Invalid email address"),
  referrer_phone: z.string().min(10, "Phone number must be at least 10 characters"),
  referred_name: z.string().min(2, "Name must be at least 2 characters"),
  referred_email: z.string().email("Invalid email address"),
  referred_phone: z.string().min(10, "Phone number must be at least 10 characters"),
  referred_category: z.string().min(1, "Category is required"),
  status: z.enum(["pending", "contacted", "registered", "rejected"]),
  notes: z.string().optional(),
});

type ReferralFormData = z.infer<typeof referralSchema>;

interface ReferralDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referral?: Referral | null;
  onSuccess: () => void;
}

const categories = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Cleaning",
  "Gardening",
  "Construction",
  "Repair & Maintenance",
];

export function ReferralDialog({ open, onOpenChange, referral, onSuccess }: ReferralDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ReferralFormData>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      referrer_name: "",
      referrer_email: "",
      referrer_phone: "",
      referred_name: "",
      referred_email: "",
      referred_phone: "",
      referred_category: "",
      status: "pending",
      notes: "",
    }
  });

  const { register, handleSubmit, reset, setValue, formState: { errors }, watch } = form;

  useEffect(() => {
    if (open) {
      if (referral) {
        setValue("referrer_name", referral.referrer_name);
        setValue("referrer_email", referral.referrer_email);
        setValue("referrer_phone", referral.referrer_phone);
        setValue("referred_name", referral.referred_name);
        setValue("referred_email", referral.referred_email);
        setValue("referred_phone", referral.referred_phone);
        setValue("referred_category", referral.referred_category);
        setValue("status", referral.status);
        setValue("notes", referral.notes || "");
      } else {
        reset({
          referrer_name: "",
          referrer_email: "",
          referrer_phone: "",
          referred_name: "",
          referred_email: "",
          referred_phone: "",
          referred_category: "",
          status: "pending",
          notes: "",
        });
      }
    }
  }, [referral, setValue, reset, open]);

  const handleFormSubmit = async (data: ReferralFormData) => {
    setLoading(true);
    try {
      const url = referral ? `/api/admin/referrals/${referral.id}` : "/api/admin/referrals";
      const method = referral ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: referral ? "Referral updated successfully" : "Referral created successfully",
        });
        onSuccess();
        onOpenChange(false);
        reset();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{referral ? "Edit Referral" : "Add New Referral"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Referrer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b pb-2">
              Referrer Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referrer_name">Referrer Name *</Label>
                <Input
                  id="referrer_name"
                  {...register("referrer_name")}
                  placeholder="Enter referrer name"
                  className={errors.referrer_name ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.referrer_name && (
                  <p className="text-red-500 text-sm">{errors.referrer_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="referrer_email">Referrer Email *</Label>
                <Input
                  id="referrer_email"
                  type="email"
                  {...register("referrer_email")}
                  placeholder="Enter referrer email"
                  className={errors.referrer_email ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.referrer_email && (
                  <p className="text-red-500 text-sm">{errors.referrer_email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referrer_phone">Referrer Phone *</Label>
              <Input
                id="referrer_phone"
                {...register("referrer_phone")}
                placeholder="Enter referrer phone number"
                className={errors.referrer_phone ? "border-red-500 focus:border-red-500" : ""}
              />
              {errors.referrer_phone && (
                <p className="text-red-500 text-sm">{errors.referrer_phone.message}</p>
              )}
            </div>
          </div>

          {/* Referred Person Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b pb-2">
              Referred Person Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referred_name">Referred Name *</Label>
                <Input
                  id="referred_name"
                  {...register("referred_name")}
                  placeholder="Enter referred person name"
                  className={errors.referred_name ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.referred_name && (
                  <p className="text-red-500 text-sm">{errors.referred_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="referred_email">Referred Email *</Label>
                <Input
                  id="referred_email"
                  type="email"
                  {...register("referred_email")}
                  placeholder="Enter referred person email"
                  className={errors.referred_email ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.referred_email && (
                  <p className="text-red-500 text-sm">{errors.referred_email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referred_phone">Referred Phone *</Label>
                <Input
                  id="referred_phone"
                  {...register("referred_phone")}
                  placeholder="Enter referred person phone"
                  className={errors.referred_phone ? "border-red-500 focus:border-red-500" : ""}
                />
                {errors.referred_phone && (
                  <p className="text-red-500 text-sm">{errors.referred_phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="referred_category">Category *</Label>
                <Select 
                  onValueChange={(value) => setValue("referred_category", value)}
                  value={watch("referred_category")}
                >
                  <SelectTrigger className={errors.referred_category ? "border-red-500 focus:border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.referred_category && (
                  <p className="text-red-500 text-sm">{errors.referred_category.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Status and Notes */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select 
                onValueChange={(value) => setValue("status", value as "pending" | "contacted" | "registered" | "rejected")}
                value={watch("status")}
              >
                <SelectTrigger className={errors.status ? "border-red-500 focus:border-red-500" : ""}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Add any additional notes..."
                rows={3}
              />
            </div>
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
                  {referral ? "Updating..." : "Creating..."}
                </>
              ) : (
                referral ? "Update Referral" : "Create Referral"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

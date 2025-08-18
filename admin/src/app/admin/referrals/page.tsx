"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { createColumns, Referral } from "./columns";
import { ReferralDialog } from "./referral-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search, Download, Users } from "lucide-react";

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReferral, setEditingReferral] = useState<Referral | null>(null);
  const { toast } = useToast();

  // Fetch referrals
  const fetchReferrals = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      setTimeout(() => {
        setReferrals([
          {
            id: 1,
            referrer_name: "Ahmad Ali",
            referrer_email: "ahmad@example.com",
            referrer_phone: "+92-300-1234567",
            referred_name: "Hassan Khan",
            referred_email: "hassan@example.com",
            referred_phone: "+92-301-2345678",
            referred_category: "Plumbing",
            status: "pending",
            notes: "Friend needs plumbing work for new house",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 2,
            referrer_name: "Fatima Sheikh",
            referrer_email: "fatima@example.com",
            referrer_phone: "+92-302-3456789",
            referred_name: "Zara Ahmed",
            referred_email: "zara@example.com",
            referred_phone: "+92-303-4567890",
            referred_category: "Electrical",
            status: "contacted",
            notes: "Electrical work needed urgently",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      toast({
        title: "Error",
        description: "Failed to load referrals",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  // Filter referrals based on search term
  const filteredReferrals = referrals.filter(referral =>
    referral.referrer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    referral.referred_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    referral.referred_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    referral.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle referral creation/update
  const handleReferralSubmit = async (referralData: any) => {
    try {
      const url = editingReferral 
        ? `/api/admin/referrals/${editingReferral.id}` 
        : "/api/admin/referrals";
      
      const method = editingReferral ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(referralData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save referral");
      }

      toast({
        title: "Success",
        description: editingReferral ? "Referral updated successfully" : "Referral created successfully",
      });

      setIsDialogOpen(false);
      setEditingReferral(null);
      fetchReferrals(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save referral",
        variant: "destructive",
      });
    }
  };

  // Handle referral deletion
  const handleDeleteReferral = async (referralId: number) => {
    if (!confirm("Are you sure you want to delete this referral?")) return;

    try {
      const response = await fetch(`/api/admin/referrals/${referralId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete referral");

      toast({
        title: "Success",
        description: "Referral deleted successfully",
      });

      fetchReferrals(); // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete referral",
        variant: "destructive",
      });
    }
  };

  // Handle edit referral
  const handleEditReferral = (referral: Referral) => {
    setEditingReferral(referral);
    setIsDialogOpen(true);
  };

  // Export referrals to CSV
  const exportToCSV = () => {
    const headers = ["Referrer Name", "Referrer Email", "Referred Name", "Referred Email", "Category", "Status", "Created At"];
    const csvContent = [
      headers.join(","),
      ...filteredReferrals.map(referral => [
        referral.referrer_name,
        referral.referrer_email,
        referral.referred_name,
        referral.referred_email,
        referral.referred_category,
        referral.status,
        new Date(referral.created_at).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "referrals.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Referrals</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage referral submissions and track their status
          </p>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-pink-600 hover:bg-pink-700 text-white"
          disabled={loading}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Referral
        </Button>
      </div>

      <Card className="shadow-sm border-gray-200 dark:border-gray-700">
        <CardHeader className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              All Referrals ({filteredReferrals.length})
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search referrals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              <Button 
                variant="outline" 
                onClick={exportToCSV} 
                disabled={loading || filteredReferrals.length === 0}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!loading && referrals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No referrals found</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-sm">
                Start by adding your first referral submission
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add First Referral
              </Button>
            </div>
          ) : (
            <div className="p-6">
              <DataTable
                columns={createColumns({ onEdit: handleEditReferral, onDelete: handleDeleteReferral })}
                data={filteredReferrals}
                loading={loading}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <ReferralDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          setIsDialogOpen(false);
          setEditingReferral(null);
          fetchReferrals();
        }}
        referral={editingReferral}
      />
    </div>
  );
}
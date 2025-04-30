import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminSidebar from "@/components/layout/admin-sidebar";
import { Offer } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import OfferForm from "@/components/admin/offer-form";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminOffers() {
  const { toast } = useToast();
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<number | null>(null);
  const [openOfferDialog, setOpenOfferDialog] = useState(false);
  
  // Fetch offers
  const { data: offers, isLoading } = useQuery<Offer[]>({
    queryKey: ['/api/offers'],
    queryFn: async () => {
      const res = await fetch('/api/offers');
      if (!res.ok) throw new Error('Failed to fetch offers');
      return res.json();
    }
  });

  // Delete offer mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/offers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/offers'] });
      toast({
        title: "Offer deleted",
        description: "The offer has been deleted successfully",
      });
      setOpenDeleteDialog(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete offer: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle edit offer click
  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setOpenOfferDialog(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setEditingOffer(null);
    setOpenOfferDialog(false);
  };

  // Format date for display
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-dark">Special Offers</h2>
          
          <Dialog open={openOfferDialog} onOpenChange={setOpenOfferDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingOffer ? 'Edit Offer' : 'Add New Offer'}</DialogTitle>
                <DialogDescription>
                  {editingOffer 
                    ? 'Update the offer details and click save.' 
                    : 'Fill in the offer details and click add.'}
                </DialogDescription>
              </DialogHeader>
              <OfferForm 
                offer={editingOffer} 
                onSuccess={handleDialogClose} 
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Offers</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offers && offers.length === 0 ? (
                  <div className="md:col-span-2 p-8 text-center border border-dashed rounded-lg">
                    <p className="text-neutral-dark/70 mb-4">No offers found</p>
                    <Button onClick={() => setOpenOfferDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create your first offer
                    </Button>
                  </div>
                ) : (
                  offers?.map(offer => (
                    <Card key={offer.id} className="relative">
                      <CardContent className="pt-6">
                        <div className="absolute top-4 right-4">
                          <Badge variant={offer.isActive ? "default" : "outline"}>
                            {offer.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                        <p className="text-neutral-dark/70 mb-4">{offer.description}</p>
                        
                        {offer.expiryDate && (
                          <p className="text-sm text-neutral-dark/60 mb-4">
                            Expires: {formatDate(offer.expiryDate)}
                          </p>
                        )}
                        
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEditOffer(offer)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-destructive border-destructive hover:bg-destructive/10"
                            onClick={() => setOpenDeleteDialog(offer.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog 
          open={openDeleteDialog !== null} 
          onOpenChange={(open) => !open && setOpenDeleteDialog(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this offer. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  if (openDeleteDialog !== null) {
                    deleteMutation.mutate(openDeleteDialog);
                  }
                }}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

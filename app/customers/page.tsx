"use client"

import { useState } from "react"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

// Mock data - would be replaced with actual database calls
const initialCustomers = [
  { id: 1, name: "ABC Company", address: "123 Business Park", mobile: "9876543210", gst: "29ABCDE1234F1Z5" },
  { id: 2, name: "XYZ Enterprises", address: "456 Tech Hub", mobile: "8765432109", gst: "27FGHIJ5678K2Y6" },
  { id: 3, name: "PQR Solutions", address: "789 Corporate Tower", mobile: "7654321098", gst: "24KLMNO9012P3X7" },
]

interface Customer {
  id: number
  name: string
  address: string
  mobile: string
  gst: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [searchTerm, setSearchTerm] = useState("")
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, "id">>({ name: "", address: "", mobile: "", gst: "" })
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobile.includes(searchTerm) ||
      customer.gst.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddCustomer = () => {
    const newId = customers.length > 0 ? Math.max(...customers.map((c) => c.id)) + 1 : 1
    setCustomers([...customers, { id: newId, ...newCustomer }])
    setNewCustomer({ name: "", address: "", mobile: "", gst: "" })
    setIsAddDialogOpen(false)
    toast({
      title: "Customer Added",
      description: "The customer has been added successfully.",
    })
  }

  const handleEditCustomer = () => {
    if (editingCustomer) {
      setCustomers(customers.map((c) => (c.id === editingCustomer.id ? editingCustomer : c)))
      setEditingCustomer(null)
      setIsEditDialogOpen(false)
      toast({
        title: "Customer Updated",
        description: "The customer details have been updated successfully.",
      })
    }
  }

  const handleDeleteCustomer = () => {
    if (editingCustomer) {
      setCustomers(customers.filter((c) => c.id !== editingCustomer.id))
      setEditingCustomer(null)
      setIsDeleteDialogOpen(false)
      toast({
        title: "Customer Deleted",
        description: "The customer has been deleted successfully.",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Customer Database</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="w-full sm:w-[300px] pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>Enter the details of the new customer.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Customer Name</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  value={newCustomer.mobile}
                  onChange={(e) => setNewCustomer({ ...newCustomer, mobile: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gst">GST Number</Label>
                <Input
                  id="gst"
                  value={newCustomer.gst}
                  onChange={(e) => setNewCustomer({ ...newCustomer, gst: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCustomer}>Add Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Address</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead className="hidden md:table-cell">GST</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{customer.address}</TableCell>
                  <TableCell>{customer.mobile}</TableCell>
                  <TableCell className="hidden md:table-cell">{customer.gst}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingCustomer(customer)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingCustomer(customer)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Update the customer details.</DialogDescription>
          </DialogHeader>
          {editingCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Customer Name</Label>
                <Input
                  id="edit-name"
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={editingCustomer.address}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-mobile">Mobile Number</Label>
                <Input
                  id="edit-mobile"
                  value={editingCustomer.mobile}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, mobile: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-gst">GST Number</Label>
                <Input
                  id="edit-gst"
                  value={editingCustomer.gst}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, gst: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCustomer}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


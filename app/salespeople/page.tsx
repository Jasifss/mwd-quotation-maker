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
const initialSalespeople = [
  { id: 1, name: "John Doe", mobile: "9876543210", place: "North Region", email: "john.doe@example.com" },
  { id: 2, name: "Jane Smith", mobile: "8765432109", place: "South Region", email: "jane.smith@example.com" },
  { id: 3, name: "Robert Johnson", mobile: "7654321098", place: "East Region", email: "robert.j@example.com" },
]

interface Salesperson {
  id: number
  name: string
  mobile: string
  place: string
  email: string
}

export default function SalespeopleManagement() {
  const [salespeople, setSalespeople] = useState<Salesperson[]>(initialSalespeople)
  const [searchTerm, setSearchTerm] = useState("")
  const [newSalesperson, setNewSalesperson] = useState<Omit<Salesperson, "id">>({
    name: "",
    mobile: "",
    place: "",
    email: "",
  })
  const [editingSalesperson, setEditingSalesperson] = useState<Salesperson | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  const filteredSalespeople = salespeople.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.mobile.includes(searchTerm) ||
      person.place.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSalesperson = () => {
    const newId = salespeople.length > 0 ? Math.max(...salespeople.map((s) => s.id)) + 1 : 1
    setSalespeople([...salespeople, { id: newId, ...newSalesperson }])
    setNewSalesperson({ name: "", mobile: "", place: "", email: "" })
    setIsAddDialogOpen(false)
    toast({
      title: "Sales Person Added",
      description: "The sales person has been added successfully.",
    })
  }

  const handleEditSalesperson = () => {
    if (editingSalesperson) {
      setSalespeople(salespeople.map((s) => (s.id === editingSalesperson.id ? editingSalesperson : s)))
      setEditingSalesperson(null)
      setIsEditDialogOpen(false)
      toast({
        title: "Sales Person Updated",
        description: "The sales person details have been updated successfully.",
      })
    }
  }

  const handleDeleteSalesperson = () => {
    if (editingSalesperson) {
      setSalespeople(salespeople.filter((s) => s.id !== editingSalesperson.id))
      setEditingSalesperson(null)
      setIsDeleteDialogOpen(false)
      toast({
        title: "Sales Person Deleted",
        description: "The sales person has been deleted successfully.",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Sales Personnel Management</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search sales personnel..."
            className="w-full sm:w-[300px] pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Sales Person
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Sales Person</DialogTitle>
              <DialogDescription>Enter the details of the new sales person.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newSalesperson.name}
                  onChange={(e) => setNewSalesperson({ ...newSalesperson, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  value={newSalesperson.mobile}
                  onChange={(e) => setNewSalesperson({ ...newSalesperson, mobile: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="place">Place/Region</Label>
                <Input
                  id="place"
                  value={newSalesperson.place}
                  onChange={(e) => setNewSalesperson({ ...newSalesperson, place: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newSalesperson.email}
                  onChange={(e) => setNewSalesperson({ ...newSalesperson, email: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSalesperson}>Add Sales Person</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead className="hidden md:table-cell">Place/Region</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSalespeople.length > 0 ? (
              filteredSalespeople.map((person) => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.name}</TableCell>
                  <TableCell>{person.mobile}</TableCell>
                  <TableCell className="hidden md:table-cell">{person.place}</TableCell>
                  <TableCell className="hidden md:table-cell">{person.email}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingSalesperson(person)
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
                          setEditingSalesperson(person)
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
                  No sales personnel found.
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
            <DialogTitle>Edit Sales Person</DialogTitle>
            <DialogDescription>Update the sales person details.</DialogDescription>
          </DialogHeader>
          {editingSalesperson && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingSalesperson.name}
                  onChange={(e) => setEditingSalesperson({ ...editingSalesperson, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-mobile">Mobile Number</Label>
                <Input
                  id="edit-mobile"
                  value={editingSalesperson.mobile}
                  onChange={(e) => setEditingSalesperson({ ...editingSalesperson, mobile: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-place">Place/Region</Label>
                <Input
                  id="edit-place"
                  value={editingSalesperson.place}
                  onChange={(e) => setEditingSalesperson({ ...editingSalesperson, place: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingSalesperson.email}
                  onChange={(e) => setEditingSalesperson({ ...editingSalesperson, email: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSalesperson}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this sales person? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSalesperson}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


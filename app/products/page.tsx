"use client"

import { useState } from "react"
import { Plus, Search, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
const initialProducts = [
  {
    id: 1,
    name: "eGlu HUB-Pro (EGHB03M)",
    brand: "eGlu",
    specifications:
      "eGlu gateway manages up to 240 devices with a built-in rule engine, 24-hour backup, and advanced lighting features.",
    mrp: 31160,
    photoUrl: "",
  },
  {
    id: 2,
    name: "eGlu In-Wall Switch 16A (EGIW03R)",
    brand: "eGlu",
    specifications:
      "Automates one high-power load (e.g., geyser, A/C, motor) while working seamlessly with regular wall switches.",
    mrp: 6800,
    photoUrl: "",
  },
  {
    id: 3,
    name: "eGlu In-Wall Triple Switch (EGIW04R)",
    brand: "eGlu",
    specifications:
      "Automates up to 3 loads (e.g., lights, fans) and integrates seamlessly with regular wall switches.",
    mrp: 10120,
    photoUrl: "",
  },
  {
    id: 4,
    name: "eGlu Gate Controller DC (EGGC02R)",
    brand: "eGlu",
    specifications: "Automates motorized gates and includes open-close detection.",
    mrp: 10120,
    photoUrl: "",
  },
  {
    id: 5,
    name: "eGlu Pleated Curtain System - 4M (EGCS01R-4M)",
    brand: "eGlu",
    specifications: "Fully automated pleated curtain system with up to 4M track length, accessories, and devices.",
    mrp: 28000,
    photoUrl: "",
  },
]

interface Product {
  id: number
  name: string
  brand: string
  specifications: string
  mrp: number
  photoUrl?: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    brand: "",
    specifications: "",
    mrp: 0,
    photoUrl: "",
  })
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.specifications.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProduct = () => {
    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1
    setProducts([...products, { id: newId, ...newProduct }])
    setNewProduct({ name: "", brand: "", specifications: "", mrp: 0, photoUrl: "" })
    setIsAddDialogOpen(false)
    toast({
      title: "Product Added",
      description: "The product has been added successfully.",
    })
  }

  const handleEditProduct = () => {
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? editingProduct : p)))
      setEditingProduct(null)
      setIsEditDialogOpen(false)
      toast({
        title: "Product Updated",
        description: "The product details have been updated successfully.",
      })
    }
  }

  const handleDeleteProduct = () => {
    if (editingProduct) {
      setProducts(products.filter((p) => p.id !== editingProduct.id))
      setEditingProduct(null)
      setIsDeleteDialogOpen(false)
      toast({
        title: "Product Deleted",
        description: "The product has been deleted successfully.",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Product Database</h1>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full sm:w-[300px] pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Enter the details of the new product.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="specifications">Specifications</Label>
                <Textarea
                  id="specifications"
                  value={newProduct.specifications}
                  onChange={(e) => setNewProduct({ ...newProduct, specifications: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mrp">MRP (₹)</Label>
                <Input
                  id="mrp"
                  type="number"
                  value={newProduct.mrp}
                  onChange={(e) => setNewProduct({ ...newProduct, mrp: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="photo">Product Photo (URL)</Label>
                <Input
                  id="photo"
                  value={newProduct.photoUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, photoUrl: e.target.value })}
                  placeholder="Enter image URL or leave blank"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Photo</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead className="hidden md:table-cell">Specifications</TableHead>
              <TableHead className="text-right">MRP (₹)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.photoUrl ? (
                      <img
                        src={product.photoUrl || "/placeholder.svg"}
                        alt={product.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm">No image</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell className="hidden md:table-cell">{product.specifications}</TableCell>
                  <TableCell className="text-right">{product.mrp.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingProduct(product)
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
                          setEditingProduct(product)
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
                  No products found.
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
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product details.</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input
                  id="edit-name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-brand">Brand</Label>
                <Input
                  id="edit-brand"
                  value={editingProduct.brand}
                  onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-specifications">Specifications</Label>
                <Textarea
                  id="edit-specifications"
                  value={editingProduct.specifications}
                  onChange={(e) => setEditingProduct({ ...editingProduct, specifications: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-mrp">MRP (₹)</Label>
                <Input
                  id="edit-mrp"
                  type="number"
                  value={editingProduct.mrp}
                  onChange={(e) => setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-photo">Product Photo (URL)</Label>
                <Input
                  id="edit-photo"
                  value={editingProduct.photoUrl || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, photoUrl: e.target.value })}
                  placeholder="Enter image URL or leave blank"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


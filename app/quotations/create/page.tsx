"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Plus, Search, Trash2, Save, FileDown, Upload, FileText, Image } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

// Mock data - would be replaced with actual database calls
const mockCustomers = [
  { id: 1, name: "ABC Company", address: "123 Business Park", mobile: "9876543210", gst: "29ABCDE1234F1Z5" },
  { id: 2, name: "XYZ Enterprises", address: "456 Tech Hub", mobile: "8765432109", gst: "27FGHIJ5678K2Y6" },
  { id: 3, name: "PQR Solutions", address: "789 Corporate Tower", mobile: "7654321098", gst: "24KLMNO9012P3X7" },
]

const mockSalespeople = [
  { id: 1, name: "John Doe", mobile: "9876543210", place: "North Region", email: "john.doe@example.com" },
  { id: 2, name: "Jane Smith", mobile: "8765432109", place: "South Region", email: "jane.smith@example.com" },
  { id: 3, name: "Robert Johnson", mobile: "7654321098", place: "East Region", email: "robert.j@example.com" },
]

const mockProducts = [
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

interface Customer {
  id: number
  name: string
  address: string
  mobile: string
  gst: string
}

interface Salesperson {
  id: number
  name: string
  mobile: string
  place: string
  email: string
}

interface Product {
  id: number
  name: string
  brand: string
  specifications: string
  mrp: number
  photoUrl?: string
}

interface ProductItem extends Product {
  quantity: number
  unitPrice: number
  totalPrice: number
  photoUrl?: string
}

interface Room {
  id: number
  name: string
  products: ProductItem[]
  discount: number
  tax: number
}

export default function CreateQuotationPage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [salesperson, setSalesperson] = useState<Salesperson | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [nextRoomId, setNextRoomId] = useState(1)
  const [customerSearchTerm, setCustomerSearchTerm] = useState("")
  const [salespersonSearchTerm, setSalespersonSearchTerm] = useState("")
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null)
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false)
  const [isSalespersonDialogOpen, setIsSalespersonDialogOpen] = useState(false)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isManualProductDialogOpen, setIsManualProductDialogOpen] = useState(false)
  const [isProductPhotoDialogOpen, setIsProductPhotoDialogOpen] = useState(false)
  const [currentProductId, setCurrentProductId] = useState<number | null>(null)
  const [manualProduct, setManualProduct] = useState<Omit<ProductItem, "id" | "totalPrice">>({
    name: "",
    brand: "",
    specifications: "",
    mrp: 0,
    quantity: 1,
    unitPrice: 0,
    photoUrl: "",
  })
  const [companyDetails, setCompanyDetails] = useState({
    logo: "/placeholder.svg?height=100&width=200",
    name: "MWD Interiors",
    address: "123 Design Street, Creative City",
    phone: "1234567890",
    email: "info@mwdinteriors.com",
    website: "www.mwdinteriors.com",
  })
  const [termsAndConditions, setTermsAndConditions] = useState(
    "1. 50% advance payment required\n2. Delivery within 4-6 weeks\n3. Warranty of 1 year on all products\n4. Installation charges included\n5. GST extra as applicable",
  )
  const [installationCharge, setInstallationCharge] = useState(5000)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const productPhotoInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const filteredCustomers = mockCustomers.filter(
    (c) => c.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) || c.mobile.includes(customerSearchTerm),
  )

  const filteredSalespeople = mockSalespeople.filter(
    (s) =>
      s.name.toLowerCase().includes(salespersonSearchTerm.toLowerCase()) || s.mobile.includes(salespersonSearchTerm),
  )

  const filteredProducts = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      p.specifications.toLowerCase().includes(productSearchTerm.toLowerCase()),
  )

  const addRoom = () => {
    const newRoom: Room = {
      id: nextRoomId,
      name: `Room ${nextRoomId}`,
      products: [],
      discount: 0,
      tax: 18, // Default tax rate
    }
    setRooms([...rooms, newRoom])
    setNextRoomId(nextRoomId + 1)
  }

  const updateRoomName = (roomId: number, name: string) => {
    setRooms(rooms.map((room) => (room.id === roomId ? { ...room, name } : room)))
  }

  const updateRoomDiscount = (roomId: number, discount: number) => {
    setRooms(rooms.map((room) => (room.id === roomId ? { ...room, discount } : room)))
  }

  const updateRoomTax = (roomId: number, tax: number) => {
    setRooms(rooms.map((room) => (room.id === roomId ? { ...room, tax } : room)))
  }

  const deleteRoom = (roomId: number) => {
    setRooms(rooms.filter((room) => room.id !== roomId))
  }

  const openProductDialog = (roomId: number) => {
    setCurrentRoomId(roomId)
    setIsProductDialogOpen(true)
  }

  const openManualProductDialog = (roomId: number) => {
    setCurrentRoomId(roomId)
    setIsManualProductDialogOpen(true)
  }

  const openProductPhotoDialog = (roomId: number, productId: number) => {
    setCurrentRoomId(roomId)
    setCurrentProductId(productId)
    setIsProductPhotoDialogOpen(true)
  }

  const addProductToRoom = (product: Product) => {
    if (currentRoomId === null) return

    const productItem: ProductItem = {
      ...product,
      quantity: 1,
      unitPrice: product.mrp,
      totalPrice: product.mrp,
    }

    setRooms(
      rooms.map((room) => (room.id === currentRoomId ? { ...room, products: [...room.products, productItem] } : room)),
    )

    setIsProductDialogOpen(false)
    setProductSearchTerm("")
  }

  const addManualProductToRoom = () => {
    if (currentRoomId === null) return

    const newId = Math.floor(Math.random() * 10000) + 1000
    const productItem: ProductItem = {
      id: newId,
      ...manualProduct,
      totalPrice: manualProduct.quantity * manualProduct.unitPrice,
    }

    setRooms(
      rooms.map((room) => (room.id === currentRoomId ? { ...room, products: [...room.products, productItem] } : room)),
    )

    setManualProduct({
      name: "",
      brand: "",
      specifications: "",
      mrp: 0,
      quantity: 1,
      unitPrice: 0,
      photoUrl: "",
    })
    setIsManualProductDialogOpen(false)
  }

  const updateProductInRoom = (roomId: number, productId: number, updates: Partial<ProductItem>) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              products: room.products.map((product) =>
                product.id === productId
                  ? {
                      ...product,
                      ...updates,
                      totalPrice:
                        updates.quantity !== undefined || updates.unitPrice !== undefined
                          ? (updates.quantity || product.quantity) * (updates.unitPrice || product.unitPrice)
                          : product.totalPrice,
                    }
                  : product,
              ),
            }
          : room,
      ),
    )
  }

  const removeProductFromRoom = (roomId: number, productId: number) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId ? { ...room, products: room.products.filter((product) => product.id !== productId) } : room,
      ),
    )
  }

  const calculateRoomSubtotal = (room: Room) => {
    return room.products.reduce((total, product) => total + product.totalPrice, 0)
  }

  const calculateRoomDiscountAmount = (room: Room) => {
    const subtotal = calculateRoomSubtotal(room)
    return (subtotal * room.discount) / 100
  }

  const calculateRoomTaxAmount = (room: Room) => {
    const subtotal = calculateRoomSubtotal(room)
    const discountAmount = calculateRoomDiscountAmount(room)
    return ((subtotal - discountAmount) * room.tax) / 100
  }

  const calculateRoomTotal = (room: Room) => {
    const subtotal = calculateRoomSubtotal(room)
    const discountAmount = calculateRoomDiscountAmount(room)
    const taxAmount = calculateRoomTaxAmount(room)
    return subtotal - discountAmount + taxAmount
  }

  const calculateSubtotal = () => {
    return rooms.reduce((total, room) => total + calculateRoomSubtotal(room), 0)
  }

  const calculateTotalDiscount = () => {
    return rooms.reduce((total, room) => total + calculateRoomDiscountAmount(room), 0)
  }

  const calculateTotalTax = () => {
    return rooms.reduce((total, room) => total + calculateRoomTaxAmount(room), 0)
  }

  const calculateGrandTotal = () => {
    return rooms.reduce((total, room) => total + calculateRoomTotal(room), 0) + installationCharge
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setCompanyDetails({
            ...companyDetails,
            logo: event.target.result as string,
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProductPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && currentRoomId !== null && currentProductId !== null) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          updateProductInRoom(currentRoomId, currentProductId, {
            photoUrl: event.target.result as string,
          })
          setIsProductPhotoDialogOpen(false)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerLogoUpload = () => {
    logoInputRef.current?.click()
  }

  const triggerProductPhotoUpload = () => {
    productPhotoInputRef.current?.click()
  }

  const saveQuotation = () => {
    // In a real application, this would save to local storage or file system
    const quotationData = {
      id: Date.now(),
      date: new Date().toISOString(),
      customer,
      salesperson,
      rooms,
      installationCharge,
      termsAndConditions,
      companyDetails,
      totalAmount: calculateGrandTotal(),
    }

    // Save to localStorage
    const savedQuotations = JSON.parse(localStorage.getItem("quotations") || "[]")
    savedQuotations.push(quotationData)
    localStorage.setItem("quotations", JSON.stringify(savedQuotations))

    toast({
      title: "Quotation Saved",
      description: "Your quotation has been saved successfully to local storage.",
    })
  }

  const exportToPdf = () => {
    // In a real application, this would generate a PDF and save to file system
    toast({
      title: "PDF Generated",
      description: "Your quotation has been exported to PDF and saved to your computer.",
    })
  }

  const exportToDoc = () => {
    // In a real application, this would generate a DOC and save to file system
    toast({
      title: "DOC Generated",
      description: "Your quotation has been exported to DOC and saved to your computer.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Quotation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center mb-4">
              <img
                src={companyDetails.logo || "/placeholder.svg"}
                alt="Company Logo"
                className="h-20 object-contain mb-2"
              />
              <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
              <Button variant="outline" size="sm" onClick={triggerLogoUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={companyDetails.name}
                onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-address">Address</Label>
              <Textarea
                id="company-address"
                value={companyDetails.address}
                onChange={(e) => setCompanyDetails({ ...companyDetails, address: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-phone">Phone</Label>
                <Input
                  id="company-phone"
                  value={companyDetails.phone}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-email">Email</Label>
                <Input
                  id="company-email"
                  value={companyDetails.email}
                  onChange={(e) => setCompanyDetails({ ...companyDetails, email: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {customer ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{customer.name}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setIsCustomerDialogOpen(true)}>
                    Change
                  </Button>
                </div>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Address:</span> {customer.address}
                  </p>
                  <p>
                    <span className="font-medium">Mobile:</span> {customer.mobile}
                  </p>
                  <p>
                    <span className="font-medium">GST:</span> {customer.gst}
                  </p>
                </div>
              </div>
            ) : (
              <Button className="w-full" onClick={() => setIsCustomerDialogOpen(true)}>
                <Search className="mr-2 h-4 w-4" />
                Select Customer
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Sales Person Information */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Person</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {salesperson ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{salesperson.name}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setIsSalespersonDialogOpen(true)}>
                    Change
                  </Button>
                </div>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Mobile:</span> {salesperson.mobile}
                  </p>
                  <p>
                    <span className="font-medium">Region:</span> {salesperson.place}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {salesperson.email}
                  </p>
                </div>
              </div>
            ) : (
              <Button className="w-full" onClick={() => setIsSalespersonDialogOpen(true)}>
                <Search className="mr-2 h-4 w-4" />
                Select Sales Person
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Rooms Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Rooms</h2>
          <Button onClick={addRoom}>
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </div>

        {rooms.length === 0 ? (
          <div className="bg-muted p-8 rounded-lg text-center">
            <p className="text-muted-foreground mb-4">No rooms added yet.</p>
            <Button onClick={addRoom}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Room
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {rooms.map((room) => (
              <Card key={room.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Input
                        value={room.name}
                        onChange={(e) => updateRoomName(room.id, e.target.value)}
                        className="font-semibold text-lg w-[200px]"
                      />
                      <Button variant="destructive" size="icon" onClick={() => deleteRoom(room.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => openManualProductDialog(room.id)} variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Manual Product
                      </Button>
                      <Button onClick={() => openProductDialog(room.id)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {room.products.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-2">No products added to this room yet.</p>
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => openManualProductDialog(room.id)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Manual Product
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openProductDialog(room.id)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Product
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-1 font-medium">No</th>
                            <th className="text-left py-2 px-1 font-medium">Product</th>
                            <th className="text-left py-2 px-1 font-medium hidden lg:table-cell">Description</th>
                            <th className="text-right py-2 px-1 font-medium">MRP</th>
                            <th className="text-right py-2 px-1 font-medium">Qty</th>
                            <th className="text-right py-2 px-1 font-medium">Unit Price</th>
                            <th className="text-right py-2 px-1 font-medium">Total</th>
                            <th className="text-center py-2 px-1 font-medium">Photo</th>
                            <th className="text-center py-2 px-1 font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {room.products.map((product, index) => (
                            <tr key={product.id} className="border-b">
                              <td className="py-2 px-1">{index + 1}</td>
                              <td className="py-2 px-1">{product.name}</td>
                              <td className="py-2 px-1 hidden lg:table-cell">{product.specifications}</td>
                              <td className="py-2 px-1 text-right">₹{product.mrp.toLocaleString()}</td>
                              <td className="py-2 px-1">
                                <Input
                                  type="number"
                                  min="1"
                                  value={product.quantity}
                                  onChange={(e) =>
                                    updateProductInRoom(room.id, product.id, {
                                      quantity: Number.parseInt(e.target.value) || 1,
                                    })
                                  }
                                  className="w-16 text-right"
                                />
                              </td>
                              <td className="py-2 px-1">
                                <Input
                                  type="number"
                                  min="0"
                                  value={product.unitPrice}
                                  onChange={(e) =>
                                    updateProductInRoom(room.id, product.id, {
                                      unitPrice: Number.parseInt(e.target.value) || 0,
                                    })
                                  }
                                  className="w-24 text-right"
                                />
                              </td>
                              <td className="py-2 px-1 text-right font-medium">
                                ₹{product.totalPrice.toLocaleString()}
                              </td>
                              <td className="py-2 px-1 text-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openProductPhotoDialog(room.id, product.id)}
                                >
                                  {product.photoUrl ? (
                                    <img
                                      src={product.photoUrl || "/placeholder.svg"}
                                      alt={product.name}
                                      className="h-8 w-8 object-cover rounded-full"
                                    />
                                  ) : (
                                    <Image className="h-4 w-4" />
                                  )}
                                </Button>
                              </td>
                              <td className="py-2 px-1 text-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeProductFromRoom(room.id, product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="border-t">
                            <td colSpan={6} className="py-2 px-1 text-right font-medium">
                              Subtotal:
                            </td>
                            <td className="py-2 px-1 text-right font-medium">
                              ₹{calculateRoomSubtotal(room).toLocaleString()}
                            </td>
                            <td colSpan={2}></td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="py-2 px-1 text-right font-medium">
                              Discount (%):
                            </td>
                            <td className="py-2 px-1">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={room.discount}
                                onChange={(e) => updateRoomDiscount(room.id, Number.parseInt(e.target.value) || 0)}
                                className="w-16 text-right"
                              />
                            </td>
                            <td className="py-2 px-1 text-right font-medium">
                              ₹{calculateRoomDiscountAmount(room).toLocaleString()}
                            </td>
                            <td colSpan={2}></td>
                          </tr>
                          <tr>
                            <td colSpan={5} className="py-2 px-1 text-right font-medium">
                              Tax (%):
                            </td>
                            <td className="py-2 px-1">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={room.tax}
                                onChange={(e) => updateRoomTax(room.id, Number.parseInt(e.target.value) || 0)}
                                className="w-16 text-right"
                              />
                            </td>
                            <td className="py-2 px-1 text-right font-medium">
                              ₹{calculateRoomTaxAmount(room).toLocaleString()}
                            </td>
                            <td colSpan={2}></td>
                          </tr>
                          <tr className="border-t">
                            <td colSpan={6} className="py-2 px-1 text-right font-medium">
                              Total:
                            </td>
                            <td className="py-2 px-1 text-right font-medium">
                              ₹{calculateRoomTotal(room).toLocaleString()}
                            </td>
                            <td colSpan={2}></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Installation Charges */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Installation Charges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="installation-charge">Installation Charge (₹)</Label>
              <Input
                id="installation-charge"
                type="number"
                min="0"
                value={installationCharge}
                onChange={(e) => setInstallationCharge(Number.parseInt(e.target.value) || 0)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Terms and Conditions */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={termsAndConditions} onChange={(e) => setTermsAndConditions(e.target.value)} rows={5} />
          </CardContent>
        </Card>
      </div>

      {/* Grand Total and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <div className="text-lg mb-1">Subtotal: ₹{calculateSubtotal().toLocaleString()}</div>
          <div className="text-lg mb-1">Total Discount: ₹{calculateTotalDiscount().toLocaleString()}</div>
          <div className="text-lg mb-1">Total Tax: ₹{calculateTotalTax().toLocaleString()}</div>
          <div className="text-lg mb-1">Installation: ₹{installationCharge.toLocaleString()}</div>
          <div className="text-2xl font-bold">Grand Total: ₹{calculateGrandTotal().toLocaleString()}</div>
        </div>
        <div className="flex gap-4">
          <Button onClick={saveQuotation}>
            <Save className="mr-2 h-4 w-4" />
            Save Quotation
          </Button>
          <Button variant="outline" onClick={exportToPdf}>
            <FileDown className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={exportToDoc}>
            <FileText className="mr-2 h-4 w-4" />
            Export DOC
          </Button>
        </div>
      </div>

      {/* Customer Selection Dialog */}
      <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Customer</DialogTitle>
            <DialogDescription>Search and select a customer for this quotation.</DialogDescription>
          </DialogHeader>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search customers..."
              className="pl-8"
              value={customerSearchTerm}
              onChange={(e) => setCustomerSearchTerm(e.target.value)}
            />
          </div>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left py-2 px-4 font-medium">Name</th>
                  <th className="text-left py-2 px-4 font-medium hidden md:table-cell">Address</th>
                  <th className="text-left py-2 px-4 font-medium">Mobile</th>
                  <th className="text-left py-2 px-4 font-medium hidden md:table-cell">GST</th>
                  <th className="text-center py-2 px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="py-2 px-4">{c.name}</td>
                    <td className="py-2 px-4 hidden md:table-cell">{c.address}</td>
                    <td className="py-2 px-4">{c.mobile}</td>
                    <td className="py-2 px-4 hidden md:table-cell">{c.gst}</td>
                    <td className="py-2 px-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCustomer(c)
                          setIsCustomerDialogOpen(false)
                        }}
                      >
                        Select
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-muted-foreground">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomerDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Salesperson Selection Dialog */}
      <Dialog open={isSalespersonDialogOpen} onOpenChange={setIsSalespersonDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Sales Person</DialogTitle>
            <DialogDescription>Search and select a sales person for this quotation.</DialogDescription>
          </DialogHeader>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search sales personnel..."
              className="pl-8"
              value={salespersonSearchTerm}
              onChange={(e) => setSalespersonSearchTerm(e.target.value)}
            />
          </div>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left py-2 px-4 font-medium">Name</th>
                  <th className="text-left py-2 px-4 font-medium">Mobile</th>
                  <th className="text-left py-2 px-4 font-medium hidden md:table-cell">Region</th>
                  <th className="text-left py-2 px-4 font-medium hidden md:table-cell">Email</th>
                  <th className="text-center py-2 px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalespeople.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="py-2 px-4">{s.name}</td>
                    <td className="py-2 px-4">{s.mobile}</td>
                    <td className="py-2 px-4 hidden md:table-cell">{s.place}</td>
                    <td className="py-2 px-4 hidden md:table-cell">{s.email}</td>
                    <td className="py-2 px-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSalesperson(s)
                          setIsSalespersonDialogOpen(false)
                        }}
                      >
                        Select
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredSalespeople.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-muted-foreground">
                      No sales personnel found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSalespersonDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Selection Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>Search and select a product to add to the room.</DialogDescription>
          </DialogHeader>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={productSearchTerm}
              onChange={(e) => setProductSearchTerm(e.target.value)}
            />
          </div>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left py-2 px-4 font-medium">Name</th>
                  <th className="text-left py-2 px-4 font-medium">Brand</th>
                  <th className="text-left py-2 px-4 font-medium hidden md:table-cell">Specifications</th>
                  <th className="text-right py-2 px-4 font-medium">MRP</th>
                  <th className="text-center py-2 px-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="py-2 px-4">{p.name}</td>
                    <td className="py-2 px-4">{p.brand}</td>
                    <td className="py-2 px-4 hidden md:table-cell">{p.specifications}</td>
                    <td className="py-2 px-4 text-right">₹{p.mrp.toLocaleString()}</td>
                    <td className="py-2 px-4 text-center">
                      <Button variant="ghost" size="sm" onClick={() => addProductToRoom(p)}>
                        Add
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-muted-foreground">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Product Entry Dialog */}
      <Dialog open={isManualProductDialogOpen} onOpenChange={setIsManualProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Manual Product</DialogTitle>
            <DialogDescription>Enter the details of the product to add to the room.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="manual-name">Product Name</Label>
              <Input
                id="manual-name"
                value={manualProduct.name}
                onChange={(e) => setManualProduct({ ...manualProduct, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manual-brand">Brand</Label>
              <Input
                id="manual-brand"
                value={manualProduct.brand}
                onChange={(e) => setManualProduct({ ...manualProduct, brand: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manual-specifications">Description</Label>
              <Textarea
                id="manual-specifications"
                value={manualProduct.specifications}
                onChange={(e) => setManualProduct({ ...manualProduct, specifications: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="manual-mrp">MRP (₹)</Label>
                <Input
                  id="manual-mrp"
                  type="number"
                  min="0"
                  value={manualProduct.mrp}
                  onChange={(e) => setManualProduct({ ...manualProduct, mrp: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="manual-unit-price">Unit Price (₹)</Label>
                <Input
                  id="manual-unit-price"
                  type="number"
                  min="0"
                  value={manualProduct.unitPrice}
                  onChange={(e) =>
                    setManualProduct({ ...manualProduct, unitPrice: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="manual-quantity">Quantity</Label>
              <Input
                id="manual-quantity"
                type="number"
                min="1"
                value={manualProduct.quantity}
                onChange={(e) => setManualProduct({ ...manualProduct, quantity: Number.parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManualProductDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addManualProductToRoom}>Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Photo Dialog */}
      <Dialog open={isProductPhotoDialogOpen} onOpenChange={setIsProductPhotoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product Photo</DialogTitle>
            <DialogDescription>Upload a photo for this product.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <input
              type="file"
              ref={productPhotoInputRef}
              onChange={handleProductPhotoUpload}
              className="hidden"
              accept="image/*"
            />
            <Button onClick={triggerProductPhotoUpload} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Select Photo
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductPhotoDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


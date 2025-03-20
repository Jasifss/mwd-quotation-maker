"use client"

import { useRef } from "react"

interface Room {
  id: number
  name: string
  products: ProductItem[]
  discount: number
  tax: number
}

interface ProductItem {
  id: number
  name: string
  brand: string
  specifications: string
  mrp: number
  quantity: number
  unitPrice: number
  totalPrice: number
  photoUrl?: string
}

interface CompanyDetails {
  logo: string
  name: string
  address: string
  phone: string
  email: string
  website: string
}

interface QuotationData {
  quotationNumber: string
  date: string
  companyDetails: CompanyDetails
  customerName: string
  customerAddress: string
  customerGST: string
  rooms: Room[]
  installationCharge: number
  termsAndConditions: string
  salespersonName: string
  salespersonContact: string
}

export function PdfTemplate({ data }: { data: QuotationData }) {
  const templateRef = useRef<HTMLDivElement>(null)

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

  const calculateGrandTotal = () => {
    return data.rooms.reduce((total, room) => total + calculateRoomTotal(room), 0) + data.installationCharge
  }

  const numberToWords = (num: number) => {
    // This is a simplified version. In a real app, you'd use a library like number-to-words
    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ]
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

    if (num === 0) return "Zero"

    const convertLessThanOneThousand = (n: number) => {
      if (n === 0) return ""

      if (n < 10) return units[n]

      if (n < 20) return teens[n - 10]

      const digit = n % 10
      const ten = Math.floor(n / 10) % 10
      const hundred = Math.floor(n / 100) % 10

      let result = ""

      if (hundred > 0) {
        result += units[hundred] + " Hundred"
        if (ten > 0 || digit > 0) {
          result += " "
        }
      }

      if (ten > 1) {
        result += tens[ten]
        if (digit > 0) {
          result += "-" + units[digit]
        }
      } else if (ten === 1) {
        result += teens[digit]
      } else if (digit > 0) {
        result += units[digit]
      }

      return result
    }

    if (num < 1000) {
      return convertLessThanOneThousand(num)
    }

    const thousand = Math.floor(num / 1000) % 100
    const lakh = Math.floor(num / 100000) % 100
    const crore = Math.floor(num / 10000000) % 100

    let result = ""

    if (crore > 0) {
      result += convertLessThanOneThousand(crore) + " Crore"
      if (lakh > 0 || thousand > 0 || num % 1000 > 0) {
        result += " "
      }
    }

    if (lakh > 0) {
      result += convertLessThanOneThousand(lakh) + " Lakh"
      if (thousand > 0 || num % 1000 > 0) {
        result += " "
      }
    }

    if (thousand > 0) {
      result += convertLessThanOneThousand(thousand) + " Thousand"
      if (num % 1000 > 0) {
        result += " "
      }
    }

    if (num % 1000 > 0) {
      result += convertLessThanOneThousand(num % 1000)
    }

    return result
  }

  return (
    <div ref={templateRef} className="bg-white p-8 max-w-4xl mx-auto">
      {/* Header with Company Logo and Details */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <img
            src={data.companyDetails.logo || "/placeholder.svg"}
            alt="Company Logo"
            className="h-16 object-contain mb-2"
          />
          <h2 className="text-lg font-bold">{data.companyDetails.name}</h2>
          <p className="text-sm">{data.companyDetails.address}</p>
          <p className="text-sm">Phone: {data.companyDetails.phone}</p>
          <p className="text-sm">Email: {data.companyDetails.email}</p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold mb-2">Quotation</h1>
          <p className="text-sm">Quotation #: {data.quotationNumber}</p>
          <p className="text-sm">Date: {data.date}</p>
        </div>
      </div>

      {/* Customer Information */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-lg font-bold mb-2">Customer Information</h2>
        <p>
          <strong>Name:</strong> {data.customerName}
        </p>
        <p>
          <strong>Address:</strong> {data.customerAddress}
        </p>
        <p>
          <strong>GST:</strong> {data.customerGST}
        </p>
      </div>

      {/* Rooms and Products */}
      {data.rooms.map((room) => (
        <div key={room.id} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{room.name}</h2>
          <div className="border rounded overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-2 px-4 font-medium">No</th>
                  <th className="text-left py-2 px-4 font-medium">Product</th>
                  <th className="text-left py-2 px-4 font-medium">Description</th>
                  <th className="text-right py-2 px-4 font-medium">Qty</th>
                  <th className="text-right py-2 px-4 font-medium">Unit Price</th>
                  <th className="text-right py-2 px-4 font-medium">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {room.products.map((product, index) => (
                  <tr key={product.id} className="border-t">
                    <td className="py-2 px-4">{index + 1}</td>
                    <td className="py-2 px-4">{product.name}</td>
                    <td className="py-2 px-4">{product.specifications}</td>
                    <td className="py-2 px-4 text-right">{product.quantity}</td>
                    <td className="py-2 px-4 text-right">₹ {product.unitPrice.toLocaleString()}</td>
                    <td className="py-2 px-4 text-right">₹ {product.totalPrice.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t bg-gray-50">
                  <td colSpan={4}></td>
                  <td className="py-2 px-4 text-right font-bold">Subtotal:</td>
                  <td className="py-2 px-4 text-right font-bold">₹ {calculateRoomSubtotal(room).toLocaleString()}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td colSpan={4}></td>
                  <td className="py-2 px-4 text-right font-bold">Discount ({room.discount}%):</td>
                  <td className="py-2 px-4 text-right font-bold">
                    ₹ {calculateRoomDiscountAmount(room).toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td colSpan={4}></td>
                  <td className="py-2 px-4 text-right font-bold">Tax ({room.tax}%):</td>
                  <td className="py-2 px-4 text-right font-bold">₹ {calculateRoomTaxAmount(room).toLocaleString()}</td>
                </tr>
                <tr className="border-t bg-gray-100">
                  <td colSpan={4}></td>
                  <td className="py-2 px-4 text-right font-bold">Total:</td>
                  <td className="py-2 px-4 text-right font-bold">₹ {calculateRoomTotal(room).toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ))}

      {/* Installation Charges */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Installation Charges</h2>
        <div className="border rounded overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left py-2 px-4 font-medium">Description</th>
                <th className="text-right py-2 px-4 font-medium">Total Price</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-2 px-4">Installation and Setup</td>
                <td className="py-2 px-4 text-right">₹ {data.installationCharge.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Proposal Value */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">
          Proposal Value <span className="text-sm font-normal">(inclusive of applicable taxes)</span>
        </h2>
        <div className="flex justify-center items-center flex-col">
          <p className="text-3xl font-bold mb-2">₹{calculateGrandTotal().toLocaleString()}</p>
          <p className="text-lg">Rupees {numberToWords(calculateGrandTotal())} Only (Rounded)</p>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>
        <div className="border rounded p-4">
          <div className="whitespace-pre-line">{data.termsAndConditions}</div>
        </div>
      </div>

      {/* Sales Person */}
      <div className="mt-12 border-t pt-4">
        <p>
          <strong>Sales Person:</strong> {data.salespersonName}
        </p>
        <p>
          <strong>Contact:</strong> {data.salespersonContact}
        </p>
      </div>
    </div>
  )
}


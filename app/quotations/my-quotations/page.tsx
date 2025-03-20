"use client"

import { useState } from "react"
import { Search, Eye, Pencil, FileDown } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data - would be replaced with actual database calls
// Assuming these are quotations created by the current user
const mockMyQuotations = [
  {
    id: 1,
    quotationNumber: "Q-2023-001",
    date: "2023-10-15",
    customerName: "ABC Company",
    totalAmount: 125000,
    status: "Pending",
  },
  {
    id: 3,
    quotationNumber: "Q-2023-003",
    date: "2023-11-05",
    customerName: "PQR Solutions",
    totalAmount: 210000,
    status: "Rejected",
  },
  {
    id: 6,
    quotationNumber: "Q-2023-006",
    date: "2023-12-10",
    customerName: "HIJ Manufacturing",
    totalAmount: 95000,
    status: "Pending",
  },
]

export default function MyQuotationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const filteredQuotations = mockMyQuotations.filter((quotation) => {
    // Search term filter
    const matchesSearch =
      quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.customerName.toLowerCase().includes(searchTerm.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || quotation.status.toLowerCase() === statusFilter.toLowerCase()

    // Date filter (simplified for demo)
    let matchesDate = true
    const quotationDate = new Date(quotation.date)
    const today = new Date()
    const lastMonth = new Date()
    lastMonth.setMonth(today.getMonth() - 1)

    if (dateFilter === "thisMonth") {
      matchesDate = quotationDate.getMonth() === today.getMonth() && quotationDate.getFullYear() === today.getFullYear()
    } else if (dateFilter === "lastMonth") {
      matchesDate =
        quotationDate.getMonth() === lastMonth.getMonth() && quotationDate.getFullYear() === lastMonth.getFullYear()
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Quotations</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by quotation number or customer..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quotation #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotations.length > 0 ? (
              filteredQuotations.map((quotation) => (
                <TableRow key={quotation.id}>
                  <TableCell className="font-medium">{quotation.quotationNumber}</TableCell>
                  <TableCell>{new Date(quotation.date).toLocaleDateString()}</TableCell>
                  <TableCell>{quotation.customerName}</TableCell>
                  <TableCell className="text-right">₹{quotation.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        quotation.status === "Approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : quotation.status === "Rejected"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {quotation.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/quotations/${quotation.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/quotations/${quotation.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <FileDown className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No quotations found matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


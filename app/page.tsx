import Link from "next/link"
import { UserCircle, FileText, Search, Users, UserCog, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center mb-12">
        <h1 className="text-4xl font-bold text-center mb-6">MWD Quotation</h1>
        <p className="text-muted-foreground text-center max-w-2xl mb-8">
          Create professional quotations, manage customers, and track sales with our comprehensive quotation management
          system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Create Quotation
            </CardTitle>
            <CardDescription>Create a new quotation for your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add customer details, rooms, products, and calculate pricing with discounts.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/quotations/create" className="w-full">
              <Button className="w-full">Create New</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Quotations
            </CardTitle>
            <CardDescription>Find and manage existing quotations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Search, view, edit, and export your previously created quotations.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/quotations/search" className="w-full">
              <Button className="w-full" variant="outline">
                Search
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Database
            </CardTitle>
            <CardDescription>Manage your customer information</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add, edit, and delete customer details including contact information and GST.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/customers" className="w-full">
              <Button className="w-full" variant="outline">
                Manage
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Database
            </CardTitle>
            <CardDescription>Manage your product catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add, edit, and delete product details including specifications and pricing.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/products" className="w-full">
              <Button className="w-full" variant="outline">
                Manage
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Sales Personnel
            </CardTitle>
            <CardDescription>Manage your sales team</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add, edit, and delete sales personnel details including contact information.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/salespeople" className="w-full">
              <Button className="w-full" variant="outline">
                Manage
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              My Quotations
            </CardTitle>
            <CardDescription>View quotations created by you</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Access and manage all quotations that you have created.</p>
          </CardContent>
          <CardFooter>
            <Link href="/quotations/my-quotations" className="w-full">
              <Button className="w-full" variant="outline">
                View
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


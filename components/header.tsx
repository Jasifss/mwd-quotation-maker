import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 mr-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">MWD Quotation</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/quotations/create" className="text-sm font-medium transition-colors hover:text-primary">
            Create Quotation
          </Link>
          <Link href="/quotations/search" className="text-sm font-medium transition-colors hover:text-primary">
            Search Quotations
          </Link>
          <Link href="/customers" className="text-sm font-medium transition-colors hover:text-primary">
            Customers
          </Link>
          <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
            Products
          </Link>
          <Link href="/salespeople" className="text-sm font-medium transition-colors hover:text-primary">
            Sales Personnel
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/quotations/create" className="text-sm font-medium transition-colors hover:text-primary">
                  Create Quotation
                </Link>
                <Link href="/quotations/search" className="text-sm font-medium transition-colors hover:text-primary">
                  Search Quotations
                </Link>
                <Link href="/customers" className="text-sm font-medium transition-colors hover:text-primary">
                  Customers
                </Link>
                <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
                  Products
                </Link>
                <Link href="/salespeople" className="text-sm font-medium transition-colors hover:text-primary">
                  Sales Personnel
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}


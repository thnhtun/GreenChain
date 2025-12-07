"use client"

import type React from "react"
import { PRODUCT_STATUS_COLORS, PRODUCT_STATUS_LABELS, generateMockProducts } from "@/lib/constants"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, QrCode } from "lucide-react"
import { QRCodeDialog } from "@/components/qr-code-dialog"

interface ProductListProps {
  onProductSelect: (productId: string) => void
}

const products = generateMockProducts()

export function ProductList({ onProductSelect }: ProductListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProductForQR, setSelectedProductForQR] = useState<any>(null)

  const handleExportQR = (product: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedProductForQR(product)
  }

  return (
    <>
      <Card className="border-border bg-card">
        <div className="border-b border-gray-200 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Product Catalog</h2>
              <p className="text-sm text-muted-foreground">Manage and track your product batches</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products, batches, or IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-gray-200">
                <TableHead className="text-foreground">Product ID</TableHead>
                <TableHead className="text-foreground">Product Name</TableHead>
                <TableHead className="text-foreground">Farm</TableHead>
                <TableHead className="text-foreground">Harvest Date</TableHead>
                <TableHead className="text-foreground">Batch Number</TableHead>
                <TableHead className="text-foreground">Status</TableHead>
                <TableHead className="text-right text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: any) => (
                <TableRow
                  key={product.id}
                  className="cursor-pointer border-b border-gray-200"
                  onClick={() => onProductSelect(product.id)}
                >
                  <TableCell className="font-mono text-sm text-foreground">{product.metadata.product_id}</TableCell>
                  <TableCell className="font-medium text-foreground">{product.metadata.name}</TableCell>
                  <TableCell className="text-muted-foreground">{product.metadata.farm}</TableCell>
                  <TableCell className="text-muted-foreground">{product.metadata.harvest_date}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {product.metadata.batch_number}
                  </TableCell>
                  <TableCell>
                    <Badge className={PRODUCT_STATUS_COLORS[product.status]}>
                      {PRODUCT_STATUS_LABELS[product.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="gap-2" onClick={(e) => handleExportQR(product, e)}>
                      <QrCode className="h-4 w-4" />
                      QR
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="border-t border-gray-200 p-4">
          <p className="text-sm text-muted-foreground">
            Showing {products.length} of {products.length} products
          </p>
        </div>
      </Card>

      {selectedProductForQR && (
        <QRCodeDialog
          open={!!selectedProductForQR}
          onOpenChange={(open) => !open && setSelectedProductForQR(null)}
          productData={selectedProductForQR}
        />
      )}
    </>
  )
}

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ClipboardCheck, AlertCircle } from "lucide-react"
import { generateMockVerifications } from "@/lib/constants"
import { PRIORITY_COLORS, PRIORITY_LABELS } from "@/lib/constants"
import { VerificationDetailDialog } from "./verification-detail-dialog"
import type { PendingVerification } from "@/lib/types"

export function PendingVerifications() {
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<PendingVerification | null>(null)

  const mockData = generateMockVerifications()

  const filteredData = mockData.filter((item: any) => {
    const matchesSearch =
      item.metadata.product_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.metadata.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.metadata.farm.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter

    return matchesSearch && matchesPriority
  })

  return (
    <>
      <Card className="border-border bg-card">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardCheck className="size-5" />
            <h2 className="text-2xl font-semibold text-foreground">Pending Verifications</h2>
          </div>
          <p className="text-sm text-muted-foreground">Review and verify product quality submissions</p>

          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, product ID, farm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead>Product ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Farm</TableHead>
                <TableHead>Harvest Date</TableHead>
                <TableHead>Batch Number</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow className="border-gray-200">
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <AlertCircle className="size-8" />
                      <p>No pending verifications found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item: any) => (
                  <TableRow key={item.id} className="border-gray-200">
                    <TableCell className="font-mono text-sm">{item.metadata.product_id}</TableCell>
                    <TableCell className="font-medium">{item.metadata.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="size-2 rounded-full bg-primary" />
                        {item.metadata.farm}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <span>📅</span>
                        {item.metadata.harvest_date}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{item.metadata.batch_number}</TableCell>
                    <TableCell className="text-sm">{item.submitted_date}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={PRIORITY_COLORS[item.priority]}>
                        {PRIORITY_LABELS[item.priority]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedProduct(item)}>
                          <ClipboardCheck className="size-4 mr-2" />
                          Verify
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <VerificationDetailDialog
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      />
    </>
  )
}

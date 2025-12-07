"use client"

import { Input } from "@/components/ui/input"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, XCircle, FileText, ImageIcon, Calendar, MapPin, Package } from "lucide-react"
import QRCode from "react-qr-code"
import { PRIORITY_COLORS, PRIORITY_LABELS } from "@/lib/constants"
import type { PendingVerification } from "@/lib/types"

interface VerificationDetailDialogProps {
  product: PendingVerification | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VerificationDetailDialog({ product, open, onOpenChange }: VerificationDetailDialogProps) {
  const [reportFile, setReportFile] = useState<File | null>(null)
  const [notes, setNotes] = useState("")
  const [uploading, setUploading] = useState(false)

  if (!product) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReportFile(e.target.files[0])
    }
  }

  const handleVerify = async (passed: boolean) => {
    setUploading(true)
    // Simulate upload to IPFS and blockchain verification
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("[v0] Verifying product:", {
      product_id: product.metadata.product_id,
      report_cid: "QmExampleReportCID123",
      passed,
      notes,
    })

    setUploading(false)
    onOpenChange(false)

    // Show success message
    alert(`Product ${passed ? "passed" : "failed"} verification successfully!`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Product Verification</DialogTitle>
          <DialogDescription>Review product details and upload quality report</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground">Product ID</Label>
                      <p className="font-mono text-lg">{product.metadata.product_id}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Product Name</Label>
                      <p className="text-lg font-semibold">{product.metadata.name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Priority</Label>
                      <div className="mt-1">
                        <Badge variant="outline" className={PRIORITY_COLORS[product.priority]}>
                          {PRIORITY_LABELS[product.priority]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="size-5 text-muted-foreground mt-0.5" />
                      <div>
                        <Label className="text-muted-foreground">Farm</Label>
                        <p className="font-medium">{product.metadata.farm}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="size-5 text-muted-foreground mt-0.5" />
                      <div>
                        <Label className="text-muted-foreground">Harvest Date</Label>
                        <p className="font-medium">{product.metadata.harvest_date}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Package className="size-5 text-muted-foreground mt-0.5" />
                      <div>
                        <Label className="text-muted-foreground">Batch Number</Label>
                        <p className="font-medium font-mono">{product.metadata.batch_number}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {product.metadata.photos && product.metadata.photos.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <Label className="flex items-center gap-2 mb-3">
                    <ImageIcon className="size-4" />
                    Product Photos
                  </Label>
                  <div className="grid grid-cols-3 gap-4">
                    {product.metadata.photos.map((photo, index) => (
                      <div key={index} className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                        <ImageIcon className="size-12 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="report-upload" className="flex items-center gap-2 mb-2">
                    <FileText className="size-4" />
                    Upload Quality Report (PDF, DOCX)
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="report-upload"
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                    {reportFile && (
                      <Badge variant="outline" className="bg-chart-2/10 text-chart-2">
                        {reportFile.name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Report will be uploaded to IPFS and linked to the blockchain
                  </p>
                </div>

                <div>
                  <Label htmlFor="notes">Verification Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add inspection notes, observations, or comments..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <Button
                    onClick={() => handleVerify(true)}
                    disabled={!reportFile || uploading}
                    className="flex-1 bg-chart-2 hover:bg-chart-2/90"
                  >
                    <CheckCircle2 className="size-4 mr-2" />
                    {uploading ? "Processing..." : "Pass Verification"}
                  </Button>
                  <Button
                    onClick={() => handleVerify(false)}
                    disabled={!reportFile || uploading}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="size-4 mr-2" />
                    {uploading ? "Processing..." : "Fail Verification"}
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  Verification result will be recorded on the blockchain and cannot be reversed
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-white rounded-lg">
                    <QRCode
                      value={`https://verify.supply-chain.com/product/${product.metadata.product_id}`}
                      size={200}
                    />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-medium">Product Verification QR Code</p>
                    <p className="text-sm text-muted-foreground">
                      Scan to view product details and verification status
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

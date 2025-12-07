"use client"

import { useState } from "react"
import { Search, QrCode, Shield, CheckCircle2, Leaf, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ProductJourneyDialog from "./product-journey-dialog"
import type { Product } from "@/lib/types"

export default function CustomerVerification() {
  const [productId, setProductId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [error, setError] = useState("")

  const handleVerify = async () => {
    if (!productId.trim()) {
      setError("Please enter a product ID")
      return
    }

    setIsLoading(true)
    setError("")

    // Simulate API call to smart contract and IPFS
    setTimeout(() => {
      // Mock data - in production, this would call contract view functions and fetch from IPFS
      const mockProduct: Product = {
        id: productId,
        metadata: {
          product_id: productId,
          name: "Dragon Fruit",
          farm: "HTX Thanh Long A",
          harvest_date: "2025-11-20",
          batch_number: "BATCH-001",
          photos: ["ipfs://QmfYffp3wj1nwBRM16Lav4FkfnaitZAYgZqVesiT8kwyXF"],
        },
        metadataCID: "QmExampleMetadataCID123",
        owner: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        status: "sold",
        events: [
          {
            id: "1",
            type: "production",
            description: "Harvested from organic farm",
            location: "HTX Thanh Long A, Binh Thuan Province",
            timestamp: "2025-11-20T06:00:00Z",
            actor: "Farm Cooperative HTX",
            metadata: { temperature: "28°C", humidity: "65%" },
          },
          {
            id: "2",
            type: "quality_check",
            description: "Quality inspection passed - Grade A",
            location: "Quality Control Center",
            timestamp: "2025-11-20T10:30:00Z",
            actor: "Certified Inspector #245",
            metadata: {
              report_cid: "QmExampleReportCID456",
              grade: "A",
              pesticide_test: "Passed",
            },
          },
          {
            id: "3",
            type: "packaging",
            description: "Packaged in cold storage facility",
            location: "Processing Center, Binh Thuan",
            timestamp: "2025-11-20T14:00:00Z",
            actor: "Packaging Team",
            metadata: { storage_temp: "4°C" },
          },
          {
            id: "4",
            type: "shipping",
            description: "Shipped to distribution center",
            location: "Distribution Hub, Ho Chi Minh City",
            timestamp: "2025-11-21T08:00:00Z",
            actor: "Transport Company ABC",
            metadata: { vehicle_id: "TRK-1234", driver: "Nguyen Van A" },
          },
          {
            id: "5",
            type: "received",
            description: "Received at retail location",
            location: "FreshMart Store, District 1",
            timestamp: "2025-11-22T09:00:00Z",
            actor: "FreshMart Retail Chain",
          },
          {
            id: "6",
            type: "sold",
            description: "Sold to customer",
            location: "FreshMart Store, District 1",
            timestamp: "2025-11-23T16:30:00Z",
            actor: "FreshMart Retail Chain",
          },
        ],
        createdAt: "2025-11-20T06:00:00Z",
        updatedAt: "2025-11-23T16:30:00Z",
      }

      setSelectedProduct(mockProduct)
      setIsLoading(false)
    }, 1500)
  }

  const handleScanQR = () => {
    // In production, this would open camera for QR scanning
    alert("QR Scanner would open here - using camera to scan product QR code")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-accent/5">
      <div className="relative text-primary-foreground overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/fresh-organic-farm-fields-with-vegetables.jpg"
            alt="Farm background"
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        </div>

        <div className="container relative mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance drop-shadow-lg">
              Verify Product Authenticity
            </h1>
            <p className="text-lg md:text-xl text-white/95 text-pretty leading-relaxed max-w-2xl drop-shadow-md">
              Track your product's journey from farm to table. Every step verified on blockchain for complete
              transparency and trust.
            </p>

            <div className="grid grid-cols-3 gap-6 md:gap-12 mt-8 max-w-2xl">
              <div className="text-center backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">10K+</div>
                <div className="text-xs md:text-sm text-white/90 font-medium">Products Verified</div>
              </div>
              <div className="text-center backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">50+</div>
                <div className="text-xs md:text-sm text-white/90 font-medium">Partner Farms</div>
              </div>
              <div className="text-center backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">100%</div>
                <div className="text-xs md:text-sm text-white/90 font-medium">Blockchain Secured</div>
              </div>
            </div>

            <Card className="mt-8 backdrop-blur-xl bg-white/95 dark:bg-background/95 shadow-2xl border-2 border-primary/40">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Search className="w-6 h-6 text-primary" />
                  Enter Product Information
                </CardTitle>
                <CardDescription className="text-base">
                  Scan the QR code on your product or manually enter the product ID
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter Product ID (e.g., LOT-20251123-001)"
                      value={productId}
                      onChange={(e) => {
                        setProductId(e.target.value)
                        setError("")
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                      className="h-14 text-base border-2 focus-visible:ring-4"
                    />
                  </div>
                  <Button
                    onClick={handleVerify}
                    disabled={isLoading}
                    size="lg"
                    className="px-8 h-14 text-base shadow-lg"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    {isLoading ? "Verifying..." : "Verify"}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t-2 border-primary/30" />
                  </div>
                  <div className="relative flex justify-center text-sm uppercase">
                    <span className="bg-background px-3 text-muted-foreground font-semibold">Or</span>
                  </div>
                </div>

                <Button
                  onClick={handleScanQR}
                  variant="outline"
                  size="lg"
                  className="w-full h-14 text-base border-2 border-primary/40 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md bg-transparent"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Scan QR Code with Camera
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Verify Your Products?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every product tells a story. See the complete journey and ensure authenticity with blockchain technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-primary/40 hover:border-primary transition-all hover:shadow-lg group">
              <CardHeader>
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-primary/5 rounded-lg blur-xl group-hover:blur-2xl transition-all" />
                  <img
                    src="/blockchain-network-visualization-technology.jpg"
                    alt="Blockchain verification"
                    className="relative w-full h-40 object-cover rounded-lg"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Blockchain Verified</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All product information is immutably stored on blockchain, ensuring data cannot be tampered with or
                  falsified. Complete transparency guaranteed.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/40 hover:border-primary transition-all hover:shadow-lg group">
              <CardHeader>
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-primary/5 rounded-lg blur-xl group-hover:blur-2xl transition-all" />
                  <img
                    src="/organic-farm-fresh-vegetables-growing-fields.jpg"
                    alt="Farm to table"
                    className="relative w-full h-40 object-cover rounded-lg"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Farm to Table</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  See the complete journey from the farm where it was grown, through processing and distribution, all
                  the way to your table.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/40 hover:border-primary transition-all hover:shadow-lg group">
              <CardHeader>
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-primary/5 rounded-lg blur-xl group-hover:blur-2xl transition-all" />
                  <img
                    src="/quality-inspection-certificate-checkmark-approval.jpg"
                    alt="Quality certified"
                    className="relative w-full h-40 object-cover rounded-lg"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Quality Certified</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Access quality inspection reports and certifications from independent verifiers. Every product meets
                  strict quality standards.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {selectedProduct && (
        <ProductJourneyDialog
          product={selectedProduct}
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
        />
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, QrCode, Download, Plus, Package, MapPin, Clock, User, ImageIcon } from "lucide-react"
import { AddEventDialog } from "@/components/add-event-dialog"
import { QRCodeDialog } from "@/components/qr-code-dialog"

interface ProductDetailProps {
  productId: string
  onBack: () => void
}

// Mock data
const productData = {
  product_id: "LOT-20251123-001",
  name: "Thanh long ruột đỏ",
  farm: "HTX Thanh Long A",
  harvest_date: "2025-11-20",
  batch_number: "BATCH-001",
  status: "completed",
  createdAt: "2024-01-15T10:00:00",
  metadataCID: "QmfYffp3wj1nwBRM16Lav4FkfnaitZAYgZqVesiT8kwyXF",
  photos: ["ipfs://QmfYffp3wj1nwBRM16Lav4FkfnaitZAYgZqVesiT8kwyXF"],
  description:
    "Thanh long ruột đỏ chất lượng cao được trồng theo phương pháp hữu cơ tại HTX Thanh Long A. Sản phẩm đạt tiêu chuẩn xuất khẩu với độ ngọt tự nhiên và màu sắc đẹp mắt.",
  events: [
    {
      id: 1,
      type: "Harvest",
      description: "Thu hoạch thanh long từ vườn",
      location: "HTX Thanh Long A, Bình Thuận",
      timestamp: "2025-11-20T06:00:00",
      operator: "Nguyễn Văn A",
    },
    {
      id: 2,
      type: "Quality Check",
      description: "Kiểm tra chất lượng và phân loại",
      location: "Nhà đóng gói, Bình Thuận",
      timestamp: "2025-11-20T14:30:00",
      operator: "Trần Thị B",
    },
    {
      id: 3,
      type: "Packaging",
      description: "Đóng gói và dán nhãn sản phẩm",
      location: "Nhà đóng gói, Bình Thuận",
      timestamp: "2025-11-21T08:15:00",
      operator: "Lê Văn C",
    },
    {
      id: 4,
      type: "Shipping",
      description: "Vận chuyển đến trung tâm phân phối",
      location: "TP. Hồ Chí Minh",
      timestamp: "2025-11-22T09:00:00",
      operator: "Phạm Thị D",
    },
  ],
}

export function ProductDetail({ productId, onBack }: ProductDetailProps) {
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{productData.name}</h1>
            <p className="text-sm text-muted-foreground">
              {productData.product_id} • {productData.batch_number}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setIsQRDialogOpen(true)}>
            <QrCode className="h-4 w-4" />
            Generate QR
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Product Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Product Information</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Description</Label>
              <p className="mt-1 text-foreground">{productData.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <Badge className="mt-1 bg-primary/10 text-primary border-primary/20">Completed</Badge>
              </div>
              <div>
                <Label className="text-muted-foreground">Farm</Label>
                <p className="mt-1 text-foreground">{productData.farm}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Harvest Date</Label>
                <p className="mt-1 text-foreground">{productData.harvest_date}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Batch Number</Label>
                <p className="mt-1 font-mono text-foreground">{productData.batch_number}</p>
              </div>
            </div>

            {productData.photos.length > 0 && (
              <div>
                <Label className="text-muted-foreground">Photos</Label>
                <div className="mt-2 space-y-2">
                  {productData.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-lg border border-border bg-background p-3"
                    >
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      <span className="flex-1 font-mono text-xs text-foreground">{photo}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Blockchain Data</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Metadata CID</Label>
              <p className="mt-1 break-all font-mono text-xs text-foreground">{productData.metadataCID}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Created Date</Label>
              <p className="mt-1 text-foreground">
                {new Date(productData.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Total Events</Label>
              <p className="mt-1 text-2xl font-semibold text-foreground">{productData.events.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Events Timeline */}
      <Card className="border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Product Events</h2>
          <Button onClick={() => setIsAddEventOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>

        <div className="space-y-4">
          {productData.events.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                {index < productData.events.length - 1 && <div className="h-full w-px bg-border" />}
              </div>

              <Card className="mb-4 flex-1 border-border bg-background p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{event.type}</h3>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  <Badge variant="outline" className="border-primary/30 text-foreground">
                    {event.type}
                  </Badge>
                </div>

                <div className="mt-3 grid gap-2 text-sm md:grid-cols-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {new Date(event.timestamp).toLocaleString("vi-VN")}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    {event.operator}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Card>

      {/* Dialogs */}
      <AddEventDialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen} productId={productId} />
      <QRCodeDialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen} productData={productData} />
    </div>
  )
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-sm font-medium ${className}`}>{children}</label>
}

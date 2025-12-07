"use client";

import React, { useState } from "react";
import type { ProductMetadata } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, ImageIcon } from "lucide-react";

import { connectWallet, getSigner } from "@/app/lib/eth";
import { getRegistry } from "@/app/lib/contracts";
import { ethers } from "ethers";

/**
 * CreateProductDialog with on-chain register + IPFS pin
 *
 * Assumptions:
 * - You have an API route POST /api/pin that returns { cid: "<IPFS_CID>" }
 * - getRegistry/getSigner implemented in app/lib
 */

interface CreateProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProductDialog({ open, onOpenChange }: CreateProductDialogProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [formData, setFormData] = useState<ProductMetadata>({
    product_id: "",
    name: "",
    farm: "",
    harvest_date: "",
    batch_number: "",
    photos: [],
  });
  const [photoInput, setPhotoInput] = useState("");
  const [msg, setMsg] = useState<string>(""); // trạng thái text cho user

  const handleAddPhoto = () => {
    if (photoInput.trim()) {
      setFormData({ ...formData, photos: [...formData.photos, photoInput.trim()] });
      setPhotoInput("");
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData({ ...formData, photos: formData.photos.filter((_, i) => i !== index) });
  };

  // pin JSON metadata -> trả về CID (gọi serverless /api/pin)
  async function pinMetadataToIPFS(metadataObj: object): Promise<string> {
    const res = await fetch("/api/pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metadataObj),
    });
    const j = await res.json();
    if (!res.ok || !j.cid) {
      throw new Error(j.error || "Pin to IPFS failed");
    }
    return j.cid;
  }

  // hàm gọi contract register
  async function onRegister(pidStr: string, metadataCid: string) {
    setMsg("");
    try {
      await connectWallet(); // mở MetaMask để user sign
      const signer = getSigner();
      if (!signer) throw new Error("Không kết nối ví");

      const registry = getRegistry(signer);
      // format pid -> bytes32 (nếu pid quá dài thì rút gọn)
      const pid = ethers.utils.formatBytes32String(pidStr);
      // metadata cid -> bytes
      const cidBytes = ethers.utils.toUtf8Bytes(metadataCid);

      setMsg("Gửi transaction đăng ký lên blockchain...");
      const tx = await registry.register_product(pid, cidBytes, { gasLimit: 300000 });
      setMsg(`Tx sent: ${tx.hash} — chờ confirm...`);
      await tx.wait();
      setMsg(`Đăng ký thành công. Tx: ${tx.hash}`);
      return tx.hash;
    } catch (e: any) {
      console.error(e);
      setMsg("Lỗi khi register: " + (e?.message || e));
      throw e;
    }
  }

  // submit form: pin metadata -> call onRegister
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setMsg("");
    try {
      // build metadata JSON (thêm timestamp & owner placeholder nếu muốn)
      const metadata = {
        product_id: formData.product_id,
        name: formData.name,
        farm: formData.farm,
        harvest_date: formData.harvest_date,
        batch_number: formData.batch_number,
        photos: formData.photos,
        created_at: new Date().toISOString(),
      };

      setMsg("Đang upload metadata lên IPFS...");
      // gọi serverless pin
      const cid = await pinMetadataToIPFS(metadata);
      setMsg("IPFS CID: " + cid);

      // gọi on-chain
      await onRegister(formData.product_id, cid);

      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        onOpenChange(false);
        // reset form
        setFormData({
          product_id: "",
          name: "",
          farm: "",
          harvest_date: "",
          batch_number: "",
          photos: [],
        });
        setMsg("");
      }, 2000);
    } catch (err: any) {
      // lỗi đã được show trong onRegister / pinMetadata
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create New Product Batch</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Upload product metadata to IPFS and register on blockchain
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product_id" className="text-foreground">
                Product ID
              </Label>
              <Input
                id="product_id"
                placeholder="LOT-20251123-001"
                value={formData.product_id}
                onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                required
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="batch_number" className="text-foreground">
                Batch Number
              </Label>
              <Input
                id="batch_number"
                placeholder="BATCH-001"
                value={formData.batch_number}
                onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                required
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Product Name
            </Label>
            <Input
              id="name"
              placeholder="Thanh long ruột đỏ"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="farm" className="text-foreground">
              Farm/Producer
            </Label>
            <Input
              id="farm"
              placeholder="HTX Thanh Long A"
              value={formData.farm}
              onChange={(e) => setFormData({ ...formData, farm: e.target.value })}
              required
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="harvest_date" className="text-foreground">
              Harvest Date
            </Label>
            <Input
              id="harvest_date"
              type="date"
              value={formData.harvest_date}
              onChange={(e) => setFormData({ ...formData, harvest_date: e.target.value })}
              required
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photos" className="text-foreground">
              Photos (IPFS URLs)
            </Label>
            <div className="flex gap-2">
              <Input
                id="photos"
                placeholder="ipfs://QmfYff... or https://gateway.pinata.cloud/ipfs/Qm..."
                value={photoInput}
                onChange={(e) => setPhotoInput(e.target.value)}
                className="bg-background"
              />
              <Button type="button" onClick={handleAddPhoto} variant="outline" className="shrink-0 bg-transparent">
                Add
              </Button>
            </div>
            {formData.photos.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="flex items-center gap-2 rounded-lg border border-border bg-background p-2">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate font-mono text-xs text-foreground">{photo}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemovePhoto(index)} className="h-7">
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Thông báo trạng thái */}
          {msg && <div className="text-sm text-foreground/90">{msg}</div>}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading} className="min-w-[140px]">
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : uploadSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Success!
                </>
              ) : (
                "Create Product"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

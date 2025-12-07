"use client"

import { useState } from "react"
import { Shield, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { USER_ROLE_LABELS } from "@/lib/constants"
import type { User, UserRole } from "@/lib/types"

interface AssignRoleDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssignRole: (userId: string, role: UserRole) => void
}

export function AssignRoleDialog({ user, open, onOpenChange, onAssignRole }: AssignRoleDialogProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock smart contract call: setRole(address, role)
    console.log(`[v0] Calling contract: setRole("${user.address}", "${selectedRole}")`)

    onAssignRole(user.id, selectedRole)
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Assign Role
          </DialogTitle>
          <DialogDescription>
            Assign or change the role for this user account. This action will be recorded on the blockchain.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">User Information</Label>
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Address:</span>
                <span className="font-mono text-xs">
                  {user.address.slice(0, 10)}...{user.address.slice(-8)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Role:</span>
                <span className="font-medium">{USER_ROLE_LABELS[user.role]}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">New Role</Label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin - Full system access</SelectItem>
                <SelectItem value="manufacturer">Manufacturer - Create products</SelectItem>
                <SelectItem value="distributor">Distributor - Manage shipments</SelectItem>
                <SelectItem value="retailer">Retailer - Manage inventory</SelectItem>
                <SelectItem value="verifier">Verifier - Verify products</SelectItem>
                <SelectItem value="none">No Role - Remove access</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedRole === "admin" && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Admin role grants full system access including user management and role assignment capabilities.
              </AlertDescription>
            </Alert>
          )}

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This action will execute the smart contract function:{" "}
              <code className="text-xs font-mono">setRole(address, role)</code>
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || selectedRole === user.role}>
            {isSubmitting ? "Assigning Role..." : "Assign Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

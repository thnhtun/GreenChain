"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { UserRole } from "@/lib/types"

interface WalletContextType {
  address: string | null
  role: UserRole
  isConnected: boolean
  chainId: number | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [role, setRole] = useState<UserRole>("none")
  const [chainId, setChainId] = useState<number | null>(null)

  const connectWallet = async () => {
    // Mock wallet connection - replace with actual Web3 provider
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        // Request account access
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts",
        })

        // Get chain ID
        const chainIdHex = await (window as any).ethereum.request({
          method: "eth_chainId",
        })

        setAddress(accounts[0])
        setChainId(Number.parseInt(chainIdHex, 16))

        // Mock: Fetch role from smart contract
        // In production: const role = await contract.getRole(accounts[0])
        // For demo, assign role based on address
        const mockRole = getMockRole(accounts[0])
        setRole(mockRole)

        console.log("[v0] Wallet connected:", accounts[0])
      } catch (error) {
        console.error("[v0] Failed to connect wallet:", error)
      }
    } else {
      alert("Please install MetaMask or another Web3 wallet!")
    }
  }

  const disconnectWallet = () => {
    setAddress(null)
    setRole("none")
    setChainId(null)
    console.log("[v0] Wallet disconnected")
  }

  // Listen for account and chain changes
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setAddress(accounts[0])
          const mockRole = getMockRole(accounts[0])
          setRole(mockRole)
        }
      }

      const handleChainChanged = (chainIdHex: string) => {
        setChainId(Number.parseInt(chainIdHex, 16))
      }
      ;(window as any).ethereum.on("accountsChanged", handleAccountsChanged)
      ;(window as any).ethereum.on("chainChanged", handleChainChanged)

      return () => {
        ;(window as any).ethereum.removeListener("accountsChanged", handleAccountsChanged)
        ;(window as any).ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [])

  return (
    <WalletContext.Provider
      value={{
        address,
        role,
        isConnected: !!address,
        chainId,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

// Mock function to assign roles based on address
function getMockRole(address: string): UserRole {
  const lastChar = address.slice(-1).toLowerCase()
  if (lastChar === "0" || lastChar === "1") return "admin"
  if (lastChar === "2" || lastChar === "3") return "manufacturer"
  if (lastChar === "4" || lastChar === "5") return "distributor"
  if (lastChar === "6" || lastChar === "7") return "retailer"
  if (lastChar === "8" || lastChar === "9") return "verifier"
  return "none"
}

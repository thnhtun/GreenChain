// lib/contracts.ts
import { ethers } from "ethers";
import tokenJson from "./abi/TraceToken.json";           // file của bạn có { "abi": [...] }
import registryJson from "./abi/ProvenanceRegistry.json";

export const TOKEN_ADDR = process.env.NEXT_PUBLIC_TOKEN_ADDR!;
export const REGISTRY_ADDR = process.env.NEXT_PUBLIC_REGISTRY_ADDR!;

const TokenABI = tokenJson.abi;
const RegistryABI = registryJson.abi;

export function getToken(providerOrSigner: ethers.Signer | ethers.providers.Provider) {
  return new ethers.Contract(TOKEN_ADDR, TokenABI, providerOrSigner);
}
export function getRegistry(providerOrSigner: ethers.Signer | ethers.providers.Provider) {
  return new ethers.Contract(REGISTRY_ADDR, RegistryABI, providerOrSigner);
}

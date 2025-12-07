// lib/eth.ts
import { ethers } from "ethers";
import Web3Modal from "web3modal";

let provider: ethers.providers.Web3Provider | null = null;
let signer: ethers.Signer | null = null;

export async function connectWallet() {
  const web3Modal = new Web3Modal({ cacheProvider: true });
  const conn: any = await web3Modal.connect();
  provider = new ethers.providers.Web3Provider(conn);
  signer = provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork();
  return { provider, signer, address, chainId: network.chainId };
}

export function getSigner() { return signer; }
export function getProvider() { return provider; }

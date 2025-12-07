// app/api/pin/route.ts (Next.js Edge/Serverless)
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // expect metadata JSON or { pinataContent: {...} }
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: process.env.PINATA_API_KEY!,
        pinata_secret_api_key: process.env.PINATA_SECRET!,
      },
      body: JSON.stringify(body),
    });
    const j = await res.json();
    return NextResponse.json({ cid: j.IpfsHash });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || err }, { status: 500 });
  }
}

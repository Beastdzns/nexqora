import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB connection
const uri =
  process.env.NEXT_PUBLIC_MONGODB_URI || "your_mongodb_connection_string";
const client = new MongoClient(uri);
const dbName = "sponsors";
const collectionName = "Campaigns";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const owner = searchParams.get("owner");

  if (!id && !owner) {
    return NextResponse.json(
      { error: "Missing id or owner parameter" },
      { status: 400 }
    );
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    if (id) {
      // Find a specific campaign by id
      const campaign = await collection.findOne({ id });
      if (!campaign) {
        return NextResponse.json(
          { error: "Campaign not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(campaign);
    } else if (owner) {
      // Find all campaigns by owner
      const campaigns = await collection.find({ owner }).toArray();
      return NextResponse.json(campaigns);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve campaign(s)" },
      { status: 500 }
    );
  }
}

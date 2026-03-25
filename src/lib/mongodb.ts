import { MongoClient } from "mongodb";
import { getEnv } from "@/lib/env";

declare global {
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getMongoClient(): Promise<MongoClient> {
  const { MONGODB_URI } = getEnv();

  if (!global.__mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI);
    global.__mongoClientPromise = client.connect();
  }

  return global.__mongoClientPromise;
}

export async function getDb() {
  const { MONGODB_DB } = getEnv();
  const client = await getMongoClient();
  return client.db(MONGODB_DB);
}


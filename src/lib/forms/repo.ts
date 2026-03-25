import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { FormInputSchema, type FormInput, type FormRecord } from "@/lib/forms/schema";

type FormDoc = {
  _id: ObjectId;
  title: string;
  description?: string;
  fieldsCount: number;
  status: "draft" | "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
};

function toRecord(doc: FormDoc): FormRecord {
  return {
    _id: doc._id.toHexString(),
    title: doc.title,
    description: doc.description ?? "",
    fieldsCount: doc.fieldsCount,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

async function collection() {
  const db = await getDb();
  const col = db.collection<FormDoc>("forms");
  await col.createIndex({ updatedAt: -1 });
  await col.createIndex({ status: 1, updatedAt: -1 });
  return col;
}

export async function ensureSeedForms() {
  const col = await collection();
  const count = await col.estimatedDocumentCount();
  if (count > 0) return;

  const now = new Date();
  await col.insertMany([
    {
      _id: new ObjectId(),
      title: "Onboarding (short survey)",
      description: "Collect basic information before starting the collaboration.",
      fieldsCount: 8,
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: new ObjectId(),
      title: "Event registration",
      description: "Register attendees and collect contact information.",
      fieldsCount: 12,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: new ObjectId(),
      title: "Team retrospective",
      description: "Sprint wrap-up questions (anonymous if you want).",
      fieldsCount: 6,
      status: "archived",
      createdAt: now,
      updatedAt: now,
    },
  ]);
}

export async function listForms(args?: { status?: "draft" | "active" | "archived" }) {
  await ensureSeedForms();
  const col = await collection();
  const filter = args?.status ? { status: args.status } : {};
  const docs = await col.find(filter).sort({ updatedAt: -1 }).toArray();
  return docs.map(toRecord);
}

export async function getFormById(id: string) {
  await ensureSeedForms();
  if (!ObjectId.isValid(id)) return null;
  const col = await collection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? toRecord(doc) : null;
}

export async function createForm(input: FormInput) {
  const parsed = FormInputSchema.parse(input);
  const col = await collection();
  const now = new Date();
  const doc: FormDoc = {
    _id: new ObjectId(),
    title: parsed.title,
    description: parsed.description ? parsed.description : undefined,
    fieldsCount: parsed.fieldsCount,
    status: parsed.status,
    createdAt: now,
    updatedAt: now,
  };

  await col.insertOne(doc);
  return toRecord(doc);
}

export async function updateForm(id: string, input: FormInput) {
  const parsed = FormInputSchema.parse(input);
  if (!ObjectId.isValid(id)) return null;
  const col = await collection();
  const now = new Date();
  const res = await col.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        title: parsed.title,
        description: parsed.description ? parsed.description : undefined,
        fieldsCount: parsed.fieldsCount,
        status: parsed.status,
        updatedAt: now,
      },
    },
    { returnDocument: "after" }
  );

  return res ? toRecord(res) : null;
}

export async function deleteForm(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const col = await collection();
  const res = await col.deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount === 1;
}


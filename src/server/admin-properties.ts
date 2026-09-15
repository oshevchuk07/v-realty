'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

const propertySchema = z.object({
  dealType: z.enum(['RENT', 'SALE']),
  type: z.enum(['APARTMENT', 'HOUSE', 'COMMERCIAL', 'LAND']),
  status: z.enum(['DRAFT', 'ACTIVE', 'RESERVED', 'SOLD', 'RENTED']),
  priceUsd: z.coerce.number().int().positive().optional().nullable(),
  priceUah: z.coerce.number().int().positive().optional().nullable(),
  area: z.coerce.number().positive(),
  rooms: z.coerce.number().int().positive().optional().nullable(),
  floor: z.coerce.number().int().optional().nullable(),
  totalFloors: z.coerce.number().int().optional().nullable(),
  district: z.string().optional(),
  address: z.string().min(3),
  description: z.string().min(10),
});

// proxy.ts already blocks unauthenticated page loads, but Server Actions can in
// principle be invoked directly — this is the real gate for mutations
async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');
}

function parseFormData(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return propertySchema.parse({
    ...raw,
    priceUsd: raw.priceUsd || null,
    priceUah: raw.priceUah || null,
    rooms: raw.rooms || null,
    floor: raw.floor || null,
    totalFloors: raw.totalFloors || null,
  });
}

export type PropertyFormState = {
  error?: string;
};

export async function createProperty(
  _prevState: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  await requireAdmin();

  const parsed = propertySchema.safeParse(buildRawData(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.property.create({ data: parsed.data });
  revalidatePath('/admin');
  redirect('/admin');
}

export async function updateProperty(
  id: string,
  _prevState: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  await requireAdmin();

  const parsed = propertySchema.safeParse(buildRawData(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.property.update({ where: { id }, data: parsed.data });
  revalidatePath('/admin');
  redirect('/admin');
}

// Renamed from parseFormData — now just builds the raw object, validation happens above
function buildRawData(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return {
    ...raw,
    priceUsd: raw.priceUsd || null,
    priceUah: raw.priceUah || null,
    rooms: raw.rooms || null,
    floor: raw.floor || null,
    totalFloors: raw.totalFloors || null,
  };
}

export async function deleteProperty(id: string) {
  await requireAdmin();
  await prisma.property.delete({ where: { id } });
  revalidatePath('/admin');
}
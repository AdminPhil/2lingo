import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { isSuperAdmin } from "@/lib/admin";
import { units } from "@/db/schema";

export const GET = async () => {
  if (!(await isSuperAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await db.query.units.findMany();

  return NextResponse.json(data);
};

export const POST = async (req: Request) => {
  if (!(await isSuperAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const data = await db.insert(units).values({
    ...body,
  }).returning();

  return NextResponse.json(data[0]);
};

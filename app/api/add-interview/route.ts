// /app/api/add-interview/route.ts

import { NextResponse } from 'next/server';
import { addInterviewToUser } from '@/lib/actions/general.action';

export async function POST(req: Request) {
  try {
    const { userId, interviewId } = await req.json();

    if (!userId || !interviewId) {
      return NextResponse.json({ error: "Missing userId or interviewId" }, { status: 400 });
    }

    await addInterviewToUser(userId, interviewId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to add interview" }, { status: 500 });
  }
}

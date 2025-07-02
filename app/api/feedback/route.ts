import { NextResponse } from 'next/server';
import { createFeedback } from '@/lib/actions/general.action';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { interviewId, userId, transcript } = body;

    const result = await createFeedback({ interviewId, userId, transcript });

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Error in API /api/feedback:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { uploadFamousInterviews } from '@/lib/actions/general.action';

export async function GET(req: NextRequest) {
  try {
    await uploadFamousInterviews();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error uploading interviews:', err);
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { runFullImport } from '@/scripts/data/importAll';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const report = await runFullImport();
    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error('Import route error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Data ingestion failed' },
      { status: 500 }
    );
  }
}

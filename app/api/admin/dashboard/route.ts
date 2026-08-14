import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const [{ count: total }, { count: verified }, { count: conflicts }, { data: missingData }] =
      await Promise.all([
        supabase.from('characters').select('*', { count: 'exact', head: true }),
        supabase.from('characters').select('*', { count: 'exact', head: true }).eq('verification_status', 'verified'),
        supabase.from('characters').select('*', { count: 'exact', head: true }).eq('verification_status', 'conflict'),
        supabase.from('characters').select('id, name, age, height, bounty, image_url, devil_fruit_type'),
      ]);

    const totalCount = total || 0;
    const verifiedCount = verified || 0;
    const conflictCount = conflicts || 0;

    let missingCount = 0;
    if (missingData) {
      for (const c of missingData) {
        if (!c.age || !c.height || !c.bounty || !c.image_url || c.devil_fruit_type === 'Unknown') {
          missingCount++;
        }
      }
    }

    const verifiedPercent = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

    return NextResponse.json({
      totalCharacters: totalCount,
      verifiedCharacters: verifiedCount,
      conflictsCount: conflictCount,
      missingCount,
      verifiedPercent,
      lastImport: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Admin dashboard error:', err);
    return NextResponse.json({ error: 'Failed to load dashboard metrics' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Fetch all characters across chunks to bypass Supabase 1000-row limit
    let allChars: any[] = [];
    let from = 0;
    const chunkSize = 1000;

    while (true) {
      const { data, error } = await supabase
        .from('characters')
        .select('id, name, age, height, bounty, image_url, devil_fruit_type, origin, first_appearance, first_arc, alias, romanized_name, verification_status')
        .range(from, from + chunkSize - 1);

      if (error) {
        console.error('Error fetching chunk:', error);
        break;
      }

      if (!data || data.length === 0) break;
      allChars = allChars.concat(data);
      if (data.length < chunkSize) break;
      from += chunkSize;
    }

    const totalCount = allChars.length;
    const verifiedCount = allChars.filter((c) => c.verification_status === 'verified').length;
    const conflictCount = allChars.filter((c) => c.verification_status === 'conflict').length;

    let missingCount = 0;
    for (const c of allChars) {
      const isMissing =
        c.bounty === null ||
        c.bounty === undefined ||
        !c.age ||
        !c.height ||
        !c.image_url ||
        !c.devil_fruit_type ||
        c.devil_fruit_type === 'Unknown' ||
        !c.origin ||
        c.origin === 'Unknown' ||
        (!c.first_appearance && !c.first_arc) ||
        (!c.alias && !c.romanized_name);

      if (isMissing) {
        missingCount++;
      }
    }

    const verifiedPercent = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;

    return NextResponse.json(
      {
        totalCharacters: totalCount,
        verifiedCharacters: verifiedCount,
        conflictsCount: conflictCount,
        missingCount,
        verifiedPercent,
        lastImport: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err: any) {
    console.error('Admin dashboard error:', err);
    return NextResponse.json({ error: 'Failed to load dashboard metrics' }, { status: 500 });
  }
}

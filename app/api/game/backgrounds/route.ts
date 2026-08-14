import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface BackgroundRecord {
  title: string;
  image_url: string;
  source_name: string;
  attribution: string;
}

const CREW_BACKGROUNDS: BackgroundRecord[] = [
  {
    title: 'Straw Hat Pirates',
    image_url: 'https://images.alphacoders.com/132/1328905.jpeg',
    source_name: 'AlphaCoders',
    attribution: 'One Piece Official Art',
  },
  {
    title: 'Red Hair Pirates',
    image_url: 'https://images.alphacoders.com/126/1266073.png',
    source_name: 'AlphaCoders',
    attribution: 'One Piece Film Red',
  },
  {
    title: 'Cross Guild',
    image_url: 'https://images.alphacoders.com/128/1280388.png',
    source_name: 'AlphaCoders',
    attribution: 'One Piece Manga Artwork',
  },
  {
    title: 'Whitebeard Pirates',
    image_url: 'https://images2.alphacoders.com/712/712952.jpg',
    source_name: 'AlphaCoders',
    attribution: 'One Piece Artwork',
  },
  {
    title: 'Blackbeard Pirates',
    image_url: 'https://images6.alphacoders.com/129/1297839.png',
    source_name: 'AlphaCoders',
    attribution: 'One Piece Artwork',
  },
  {
    title: 'Marines & Admirals',
    image_url: 'https://images5.alphacoders.com/112/1129377.jpg',
    source_name: 'AlphaCoders',
    attribution: 'One Piece Navy Art',
  },
  {
    title: 'Heart & Kid Pirates',
    image_url: 'https://images3.alphacoders.com/131/1310116.png',
    source_name: 'AlphaCoders',
    attribution: 'One Piece Supernovas Art',
  },
];

export async function GET() {
  const randomIndex = Math.floor(Math.random() * CREW_BACKGROUNDS.length);
  const selected = CREW_BACKGROUNDS[randomIndex];

  return NextResponse.json({ background: selected });
}

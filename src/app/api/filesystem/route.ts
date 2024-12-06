import { NextResponse } from 'next/server';
import { mapper } from '~/utils/cdnmapper';

export async function GET(request: Request) {
  try {
    const files = mapper("cdn");
    return NextResponse.json(files, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch files', data: error }, { status: 500 });
  }
}

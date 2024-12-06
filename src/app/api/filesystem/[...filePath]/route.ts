import { NextResponse } from 'next/server';
import path from 'path';
import { mapper } from '~/utils/cdnmapper';

export async function GET(request: Request) {
  const { pathname } = new URL(request.url);
  const filePath = pathname.split('/').slice(3).join('/'); // Extract the path after /api/filesystem/
  const cdnPath = filePath.length ? path.join('cdn', filePath) : "cdn";
  
  try {
    const files = mapper(cdnPath);
    return NextResponse.json(files, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}

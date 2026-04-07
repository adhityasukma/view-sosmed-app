import { NextRequest, NextResponse } from 'next/server';
import { fetchInstagramData } from '@/services/instagram';
import { ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Username is required' },
      { status: 400 }
    );
  }

  try {
    const data = await fetchInstagramData(username);
    return NextResponse.json<ApiResponse>({ success: true, data });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Instagram API error:', errorMessage);

    return NextResponse.json<ApiResponse>(
      { success: false, error: `API Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

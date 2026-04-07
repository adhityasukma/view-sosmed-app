import { NextRequest, NextResponse } from 'next/server';
import { fetchYouTubeData } from '@/services/youtube';
import { ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const channel = searchParams.get('channel');

  if (!channel) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Channel name is required' },
      { status: 400 }
    );
  }

  try {
    const data = await fetchYouTubeData(channel);
    return NextResponse.json<ApiResponse>({ success: true, data });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('YouTube API error:', errorMessage);

    return NextResponse.json<ApiResponse>(
      { success: false, error: `API Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

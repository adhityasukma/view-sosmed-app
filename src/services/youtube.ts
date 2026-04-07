import { PlatformData } from '@/types';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

interface YouTubeSearchItem {
  id: { kind: string; channelId?: string; videoId?: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: { default?: { url: string }; medium?: { url: string }; high?: { url: string } };
    channelTitle: string;
    channelId: string;
    publishedAt: string;
  };
}

interface YouTubeChannel {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: { default?: { url: string }; medium?: { url: string }; high?: { url: string } };
    customUrl?: string;
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    videoCount: string;
  };
}

interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: { default?: { url: string }; medium?: { url: string }; high?: { url: string }; maxres?: { url: string } };
    publishedAt: string;
    channelTitle: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

export async function fetchYouTubeData(channelInput: string): Promise<PlatformData> {
  const cleanInput = channelInput.replace('@', '').trim();

  console.log(`[YouTube] Fetching data for: ${cleanInput}`);
  console.log(`[YouTube] API Key present: ${!!YOUTUBE_API_KEY} (length: ${YOUTUBE_API_KEY.length})`);

  if (!YOUTUBE_API_KEY) {
    throw new Error('YOUTUBE_API_KEY is not configured');
  }

  // Step 1: Search for the channel
  const searchUrl = `${BASE_URL}/search?q=${encodeURIComponent(cleanInput)}&type=channel&part=snippet&maxResults=1&key=${YOUTUBE_API_KEY}`;
  console.log(`[YouTube] Searching channel...`);

  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) {
    const errorText = await searchRes.text();
    console.error(`[YouTube] Search API failed: ${searchRes.status}`, errorText);
    throw new Error(`YouTube Search API failed: ${searchRes.status}`);
  }

  const searchData = await searchRes.json();
  const searchItems: YouTubeSearchItem[] = searchData.items || [];

  if (searchItems.length === 0) {
    throw new Error(`Channel "${cleanInput}" not found`);
  }

  const channelId = searchItems[0].id.channelId || searchItems[0].snippet.channelId;
  console.log(`[YouTube] Found channel ID: ${channelId}`);

  // Step 2: Get channel details (profile picture, subscriber count, total views)
  const channelUrl = `${BASE_URL}/channels?id=${channelId}&part=snippet,statistics&key=${YOUTUBE_API_KEY}`;
  console.log(`[YouTube] Fetching channel details...`);

  const channelRes = await fetch(channelUrl);
  if (!channelRes.ok) {
    const errorText = await channelRes.text();
    console.error(`[YouTube] Channel API failed: ${channelRes.status}`, errorText);
    throw new Error(`YouTube Channel API failed: ${channelRes.status}`);
  }

  const channelData = await channelRes.json();
  const channel: YouTubeChannel | undefined = channelData.items?.[0];

  if (!channel) {
    throw new Error(`Channel details not found for ID: ${channelId}`);
  }

  const displayName = channel.snippet.title;
  const profilePicture = channel.snippet.thumbnails?.high?.url ||
    channel.snippet.thumbnails?.medium?.url ||
    channel.snippet.thumbnails?.default?.url || '';
  const totalViewsFromChannel = Number(channel.statistics.viewCount) || 0;
  const subscribers = Number(channel.statistics.subscriberCount) || 0;

  console.log(`[YouTube] Channel: ${displayName}, Total Views: ${totalViewsFromChannel}, Subscribers: ${subscribers}`);

  // Step 3: Get recent videos from channel
  const videosSearchUrl = `${BASE_URL}/search?channelId=${channelId}&order=date&maxResults=5&type=video&part=snippet&key=${YOUTUBE_API_KEY}`;
  console.log(`[YouTube] Fetching recent videos...`);

  const videosSearchRes = await fetch(videosSearchUrl);
  if (!videosSearchRes.ok) {
    const errorText = await videosSearchRes.text();
    console.error(`[YouTube] Videos search failed: ${videosSearchRes.status}`, errorText);
    // Return data without video details if this fails
    return {
      platform: 'youtube',
      username: cleanInput,
      displayName,
      profilePicture,
      totalViews: totalViewsFromChannel,
      followers: subscribers,
      contents: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  const videosSearchData = await videosSearchRes.json();
  const videoItems: YouTubeSearchItem[] = videosSearchData.items || [];
  const videoIds = videoItems
    .map((item) => item.id.videoId)
    .filter(Boolean)
    .join(',');

  console.log(`[YouTube] Found ${videoItems.length} videos, IDs: ${videoIds}`);

  // Step 4: Get video statistics (views per video)
  let contents: PlatformData['contents'] = [];

  if (videoIds) {
    const videoDetailsUrl = `${BASE_URL}/videos?id=${videoIds}&part=snippet,statistics&key=${YOUTUBE_API_KEY}`;
    console.log(`[YouTube] Fetching video statistics...`);

    const videoDetailsRes = await fetch(videoDetailsUrl);
    if (videoDetailsRes.ok) {
      const videoDetailsData = await videoDetailsRes.json();
      const videos: YouTubeVideo[] = videoDetailsData.items || [];

      console.log(`[YouTube] Got details for ${videos.length} videos`);

      contents = videos.map((video) => ({
        id: video.id,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails?.maxres?.url ||
          video.snippet.thumbnails?.high?.url ||
          video.snippet.thumbnails?.medium?.url ||
          video.snippet.thumbnails?.default?.url || '',
        views: Number(video.statistics.viewCount) || 0,
        date: video.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${video.id}`,
      }));
    } else {
      console.error(`[YouTube] Video details failed: ${videoDetailsRes.status}`);
    }
  }

  return {
    platform: 'youtube',
    username: cleanInput,
    displayName,
    profilePicture,
    totalViews: totalViewsFromChannel,
    followers: subscribers,
    contents,
    lastUpdated: new Date().toISOString(),
  };
}

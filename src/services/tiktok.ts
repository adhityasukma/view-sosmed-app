import { PlatformData } from '@/types';
import * as cheerio from 'cheerio';

/**
 * TikTok Scraper - Extracts data from TikTok profile pages
 * Uses HTTP fetch + Cheerio to parse embedded JSON data
 * No API key required - completely free
 */
export async function fetchTikTokData(username: string): Promise<PlatformData> {
  const cleanUsername = username.replace('@', '').trim();

  console.log(`[TikTok] Scraping data for: ${cleanUsername}`);

  // Fetch the TikTok profile page
  const profileUrl = `https://www.tiktok.com/@${cleanUsername}`;
  const response = await fetch(profileUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'max-age=0',
    },
  });

  if (!response.ok) {
    console.error(`[TikTok] Page fetch failed: ${response.status}`);
    throw new Error(`TikTok page fetch failed: ${response.status}`);
  }

  const html = await response.text();
  console.log(`[TikTok] Got HTML (${html.length} chars)`);

  const $ = cheerio.load(html);

  // TikTok embeds user data in a script tag with id "__UNIVERSAL_DATA_FOR_REHYDRATION__"
  let userData: Record<string, unknown> | null = null;
  let userStats: Record<string, unknown> | null = null;
  let videoList: Array<Record<string, unknown>> = [];

  // Try __UNIVERSAL_DATA_FOR_REHYDRATION__ first
  const universalScript = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').text();
  if (universalScript) {
    try {
      const universalData = JSON.parse(universalScript);
      console.log('[TikTok] Found __UNIVERSAL_DATA_FOR_REHYDRATION__');

      // Navigate to user info
      const defaultScope = universalData?.['__DEFAULT_SCOPE__'];
      const webappUserDetail = defaultScope?.['webapp.user-detail'];
      const userModule = webappUserDetail?.userInfo;

      if (userModule) {
        userData = userModule.user as Record<string, unknown>;
        userStats = userModule.stats as Record<string, unknown>;
        console.log(`[TikTok] Found user: ${userData?.nickname}`);
      }

      // Try to get video list
      const userPost = defaultScope?.['webapp.user-detail']?.['itemList'] ||
        defaultScope?.['webapp.video-detail']?.['itemList'];
      if (Array.isArray(userPost)) {
        videoList = userPost;
      }
    } catch (e) {
      console.error('[TikTok] Failed to parse UNIVERSAL_DATA:', e);
    }
  }

  // Also try SIGI_STATE (older TikTok pages)
  if (!userData) {
    const sigiScript = $('#SIGI_STATE').text() || $('#__NEXT_DATA__').text();
    if (sigiScript) {
      try {
        const sigiData = JSON.parse(sigiScript);
        console.log('[TikTok] Found SIGI_STATE or NEXT_DATA');

        const userModule = sigiData?.UserModule?.users?.[cleanUsername] || sigiData?.props?.pageProps?.userInfo?.user;
        const statsModule = sigiData?.UserModule?.stats?.[cleanUsername] || sigiData?.props?.pageProps?.userInfo?.stats;

        if (userModule) {
          userData = userModule;
          userStats = statsModule || {};
        }

        // Try to get video list
        const items = sigiData?.ItemModule || sigiData?.props?.pageProps?.items;
        if (items && typeof items === 'object') {
          videoList = Array.isArray(items) ? items : Object.values(items);
        }
      } catch (e) {
        console.error('[TikTok] Failed to parse SIGI_STATE:', e);
      }
    }
  }

  // Try to find JSON-LD data as fallback
  if (!userData) {
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const ldData = JSON.parse($(el).text());
        if (ldData?.['@type'] === 'Person' || ldData?.name) {
          console.log('[TikTok] Found JSON-LD data');
          userData = {
            nickname: ldData.name || cleanUsername,
            avatarLarger: ldData.image || '',
            uniqueId: cleanUsername,
          };
        }
      } catch {
        // ignore
      }
    });
  }

  if (!userData) {
    console.error('[TikTok] Could not extract user data from page');
    // Fall back to RapidAPI if scraping fails
    return fetchTikTokFromRapidAPI(cleanUsername);
  }

  // Build content items from video list
  const contents: PlatformData['contents'] = videoList.slice(0, 5).map(
    (video: Record<string, unknown>, index: number) => ({
      id: (video.id as string) || (video.video_id as string) || String(index),
      title: (video.desc as string) || (video.title as string) || `Video ${index + 1}`,
      thumbnail: (video.cover as string) ||
        (video.originCover as string) ||
        (video.dynamicCover as string) ||
        ((video.video as Record<string, unknown>)?.cover as string) || '',
      views: Number(
        (video.stats as Record<string, unknown>)?.playCount ||
        video.playCount || video.play_count || 0
      ),
      date: video.createTime
        ? new Date(Number(video.createTime) * 1000).toISOString()
        : new Date().toISOString(),
      url: `https://www.tiktok.com/@${cleanUsername}/video/${(video.id as string) || ''}`,
    })
  );

  return {
    platform: 'tiktok',
    username: cleanUsername,
    displayName: (userData.nickname as string) || (userData.uniqueId as string) || cleanUsername,
    profilePicture: (userData.avatarLarger as string) || (userData.avatarMedium as string) || (userData.avatarThumb as string) || '',
    totalViews: Number(userStats?.videoCount ?? 0) > 0 ? Number(userStats?.playCount ?? 0) : 0,
    followers: Number(userStats?.followerCount ?? userStats?.followers ?? 0),
    contents,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Fallback: Use RapidAPI if scraping fails
 */
async function fetchTikTokFromRapidAPI(cleanUsername: string): Promise<PlatformData> {
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';
  const RAPIDAPI_HOST = 'tiktok-scraper7.p.rapidapi.com';

  if (!RAPIDAPI_KEY) {
    throw new Error('TikTok scraping failed and no RAPIDAPI_KEY available as fallback');
  }

  console.log('[TikTok] Falling back to RapidAPI...');

  const userResponse = await fetch(
    `https://${RAPIDAPI_HOST}/user/info?unique_id=${encodeURIComponent(cleanUsername)}`,
    {
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    }
  );

  if (!userResponse.ok) {
    throw new Error(`TikTok RapidAPI failed: ${userResponse.status}`);
  }

  const userData = await userResponse.json();
  const user = userData?.data?.user || userData?.user;
  const stats = userData?.data?.stats || userData?.stats;

  if (!user) {
    throw new Error('TikTok user not found via RapidAPI');
  }

  return {
    platform: 'tiktok',
    username: cleanUsername,
    displayName: user.nickname || cleanUsername,
    profilePicture: user.avatarLarger || user.avatarMedium || '',
    totalViews: Number(stats?.playCount) || 0,
    followers: Number(stats?.followerCount) || 0,
    contents: [],
    lastUpdated: new Date().toISOString(),
  };
}

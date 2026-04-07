import { PlatformData } from '@/types';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';
const RAPIDAPI_HOST = 'instagram-scraper-stable-api.p.rapidapi.com';

export async function fetchInstagramData(username: string): Promise<PlatformData> {
  const cleanUsername = username.replace('@', '').trim();

  console.log(`[Instagram] Fetching data for: ${cleanUsername}`);
  console.log(`[Instagram] API Key present: ${!!RAPIDAPI_KEY} (length: ${RAPIDAPI_KEY.length})`);

  // Step 1: Fetch user profile using "Basic User + Posts" endpoint
  const profileResponse = await fetch(
    `https://${RAPIDAPI_HOST}/ig_get_fb_profile_hover.php?username_or_url=${encodeURIComponent(cleanUsername)}`,
    {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    }
  );

  if (!profileResponse.ok) {
    const errorText = await profileResponse.text();
    console.error(`[Instagram] Profile API failed: ${profileResponse.status}`, errorText);
    throw new Error(`Instagram API profile failed: ${profileResponse.status} - ${errorText}`);
  }

  const profileData = await profileResponse.json();
  console.log('[Instagram] Profile response keys:', Object.keys(profileData));

  // Extract user data from response
  const userData = profileData?.user_data || profileData?.data?.user || profileData?.user || profileData;

  if (!userData) {
    console.error('[Instagram] User not found:', JSON.stringify(profileData).substring(0, 500));
    throw new Error('Instagram user not found');
  }

  const displayName = userData.full_name || userData.fullName || userData.name || cleanUsername;
  const profilePic = userData.profile_pic_url || userData.profile_pic_url_hd || userData.profilePicUrl || '';
  const followerCount = Number(userData.follower_count || userData.followers || userData.edge_followed_by?.count) || 0;

  console.log(`[Instagram] Found user: ${displayName}, followers: ${followerCount}`);

  // Step 2: Fetch user reels (which have play_count/views)
  let contents: PlatformData['contents'] = [];

  try {
    const reelsResponse = await fetch(
      `https://${RAPIDAPI_HOST}/get_ig_user_reels.php`,
      {
        method: 'POST',
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username_or_url=${encodeURIComponent(cleanUsername)}&amount=5`,
      }
    );

    if (reelsResponse.ok) {
      const reelsData = await reelsResponse.json();
      console.log('[Instagram] Reels response keys:', Object.keys(reelsData));

      // Try various response structures for the reels array
      const reels = reelsData?.items || reelsData?.data?.items || reelsData?.reels ||
        reelsData?.edges || reelsData?.data || [];
      const reelArray = Array.isArray(reels) ? reels : [];

      console.log(`[Instagram] Found ${reelArray.length} reels`);
      if (reelArray.length > 0) {
        console.log('[Instagram] First reel keys:', Object.keys(reelArray[0]));
      }

      contents = reelArray.slice(0, 5).map((reel: Record<string, unknown>, index: number) => {
        const node = (reel.node as Record<string, unknown>) || reel;

        // Extract caption
        const caption = node.caption as Record<string, unknown> | string | undefined;
        const captionText = typeof caption === 'string'
          ? caption
          : (caption as Record<string, unknown>)?.text as string || '';

        // Extract thumbnail
        const imageVersions = node.image_versions2 as Record<string, unknown> | undefined;
        const candidates = imageVersions?.candidates as Array<Record<string, unknown>> | undefined;
        const thumbnail = candidates?.[0]?.url as string ||
          (node.thumbnail_url as string) ||
          (node.display_url as string) ||
          (node.thumbnail_src as string) ||
          (node.cover_frame_url as string) || '';

        // Extract views - reels have play_count
        const views = Number(
          node.play_count || node.view_count || node.video_view_count ||
          node.media_preview_like_count || node.like_count || 0
        );

        // Extract date
        const takenAt = node.taken_at || node.taken_at_timestamp;
        const date = takenAt
          ? new Date(Number(takenAt) * (Number(takenAt) > 1e12 ? 1 : 1000)).toISOString()
          : new Date().toISOString();

        const code = (node.code as string) || (node.shortcode as string) || '';

        return {
          id: (node.pk as string) || (node.id as string) || String(index),
          title: captionText.substring(0, 60) || `Reel ${index + 1}`,
          thumbnail,
          views,
          date,
          url: code ? `https://www.instagram.com/reel/${code}/` : '#',
        };
      });
    } else {
      const errorText = await reelsResponse.text();
      console.error(`[Instagram] Reels API failed: ${reelsResponse.status}`, errorText);
    }
  } catch (reelsError) {
    console.error('[Instagram] Reels fetch error:', reelsError);
  }

  // If no reels found, try to get posts from the profile response
  if (contents.length === 0 && profileData?.posts) {
    const posts = Array.isArray(profileData.posts) ? profileData.posts : [];
    contents = posts.slice(0, 5).map((post: Record<string, unknown>, index: number) => {
      return {
        id: (post.pk as string) || (post.id as string) || String(index),
        title: ((post.caption as Record<string, unknown>)?.text as string || '').substring(0, 60) || `Post ${index + 1}`,
        thumbnail: (post.thumbnail_url as string) || (post.display_url as string) || '',
        views: Number(post.play_count || post.view_count || post.like_count || 0),
        date: post.taken_at
          ? new Date(Number(post.taken_at) * 1000).toISOString()
          : new Date().toISOString(),
        url: post.code ? `https://www.instagram.com/p/${post.code}/` : '#',
      };
    });
  }

  const totalViews = contents.reduce((sum, c) => sum + c.views, 0);

  return {
    platform: 'instagram',
    username: cleanUsername,
    displayName,
    profilePicture: profilePic,
    totalViews,
    followers: followerCount,
    contents,
    lastUpdated: new Date().toISOString(),
  };
}

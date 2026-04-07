import { PlatformData } from '@/types';

export function getDemoTikTok(username: string): PlatformData {
  return {
    platform: 'tiktok',
    username: username,
    displayName: `${username}`,
    profilePicture: `https://ui-avatars.com/api/?name=${username}&background=00f2ea&color=fff&size=200&bold=true`,
    totalViews: 15_800_000,
    followers: 520_000,
    contents: [
      { id: '1', title: 'Viral Dance Challenge 🔥', thumbnail: '', views: 5_200_000, date: '2026-04-01', url: '#' },
      { id: '2', title: 'Day in my life ✨', thumbnail: '', views: 3_100_000, date: '2026-03-28', url: '#' },
      { id: '3', title: 'Cooking hack you need!', thumbnail: '', views: 2_800_000, date: '2026-03-25', url: '#' },
      { id: '4', title: 'POV: Monday morning 😂', thumbnail: '', views: 2_500_000, date: '2026-03-20', url: '#' },
      { id: '5', title: 'Outfit check 💫', thumbnail: '', views: 2_200_000, date: '2026-03-15', url: '#' },
    ],
    lastUpdated: new Date().toISOString(),
  };
}

export function getDemoYouTube(channel: string): PlatformData {
  return {
    platform: 'youtube',
    username: channel,
    displayName: `${channel}`,
    profilePicture: `https://ui-avatars.com/api/?name=${channel}&background=ff0000&color=fff&size=200&bold=true`,
    totalViews: 42_500_000,
    followers: 1_200_000,
    contents: [
      { id: '1', title: 'Ultimate Guide to Web Dev 2026', thumbnail: '', views: 12_000_000, date: '2026-04-02', url: '#' },
      { id: '2', title: 'I Tried AI for 30 Days...', thumbnail: '', views: 9_500_000, date: '2026-03-26', url: '#' },
      { id: '3', title: '10 Tips Every Developer Needs', thumbnail: '', views: 8_200_000, date: '2026-03-20', url: '#' },
      { id: '4', title: 'React vs Vue vs Svelte 2026', thumbnail: '', views: 7_100_000, date: '2026-03-14', url: '#' },
      { id: '5', title: 'Building a SaaS in 7 Days', thumbnail: '', views: 5_700_000, date: '2026-03-07', url: '#' },
    ],
    lastUpdated: new Date().toISOString(),
  };
}

export function getDemoInstagram(username: string): PlatformData {
  return {
    platform: 'instagram',
    username: username,
    displayName: `${username}`,
    profilePicture: `https://ui-avatars.com/api/?name=${username}&background=e1306c&color=fff&size=200&bold=true`,
    totalViews: 8_900_000,
    followers: 340_000,
    contents: [
      { id: '1', title: 'Sunset vibes 🌅', thumbnail: '', views: 2_800_000, date: '2026-04-03', url: '#' },
      { id: '2', title: 'Behind the scenes 📸', thumbnail: '', views: 2_100_000, date: '2026-03-29', url: '#' },
      { id: '3', title: 'Travel diary: Bali ✈️', thumbnail: '', views: 1_600_000, date: '2026-03-22', url: '#' },
      { id: '4', title: 'Morning routine 🌿', thumbnail: '', views: 1_300_000, date: '2026-03-16', url: '#' },
      { id: '5', title: 'New collection drop! 🛍️', thumbnail: '', views: 1_100_000, date: '2026-03-10', url: '#' },
    ],
    lastUpdated: new Date().toISOString(),
  };
}

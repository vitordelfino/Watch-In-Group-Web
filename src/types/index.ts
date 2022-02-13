export interface Room {
  id: string;
  owner: Owner;
  users: Users;
  videos: Record<string, YoutubeVideo>
  currentVideo?: YoutubeVideo;
}

export interface User {
  id: string;
  name: string;

}
export type Users = Record<string, User>

export interface Owner {
  name: string;
  ownerSlug: string;
}

export type YoutubeVideo = {
  item: Item;
  url: string;
};

export interface YoutubeVideoResponse {
  kind: string;
  etag: string;
  items: Item;
  pageInfo: PageInfo;
}

export interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}

export interface Item {
  kind: string;
  etag: string;
  id: string;
  snippet: Snippet;
}

export interface Snippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  tags: string[];
  categoryId: string;
  liveBroadcastContent: string;
  localized: Localized;
  defaultAudioLanguage: string;
}

export interface Localized {
  title: string;
  description: string;
}

export interface Thumbnails {
  default: Default;
  medium: Default;
  high: Default;
  standard: Default;
  maxres: Default;
}

export interface Default {
  url: string;
  width: number;
  height: number;
}

// Raw post data received from backend
export interface PostDto {
  id: string;
  business: string;
  platform: string;
  categories: string[];
  caption: string;
  image: string;
  link: string;
  createdAt: string;
  postedAt: string;
  scheduledAt: string;
  status: string;
  reactions: number;
  comments: number;
  reposts: number;
  shares: number;
  type: string;
}

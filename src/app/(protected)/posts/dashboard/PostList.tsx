// PostList.tsx
"use client";

import { Post } from "@/types/post";
import { DropboxItem } from "@/types/index";
import { PostCard } from "./PostCard";

interface Props {
  posts: Post[];
  actionsBuilder: (post: Post) => DropboxItem[];
  postRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

export const PostList = ({ posts, actionsBuilder, postRefs }: Props) => {
  return (
    <div className="space-y-4 mt-2">
      {posts.map((post) => {
        const actions = actionsBuilder(post);
        return (
          <PostCard
            key={post.id}
            post={post}
            actions={actions}
            ref={(el) => {
              postRefs.current[post.id] = el;
            }}
          />
        );
      })}
    </div>
  );
};

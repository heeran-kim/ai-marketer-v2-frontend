import { ListCard } from "@/components/common";
import { Post } from "@/types/post";
import { DropboxItem } from "@/types/index";
import { forwardRef } from "react";

interface Props {
  post: Post;
  actions: DropboxItem[];
}

export const PostCard = forwardRef<HTMLDivElement, Props>(
  ({ post, actions }, ref) => {
    return <ListCard key={post.id} ref={ref} item={post} actions={actions} />;
  }
);

PostCard.displayName = "PostCard";

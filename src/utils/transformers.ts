// utils/transformers.ts
import { PostDto } from "@/types/dto";
import { Post } from "@/types/post";

export const mapPostDtoToPost = (dto: PostDto): Post => ({
  ...dto,
  selectedCategoryLabels: dto.categories,
  type: "post",
});

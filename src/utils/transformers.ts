// utils/transformers.ts
import { PostDto } from "@/types/dto";
import { Post } from "@/types/post";

export const mapPostDtoToPost = (dto: PostDto): Post => {
  const { categories, ...restDto } = dto;

  return {
    ...restDto,
    selectedCategoryLabels: categories,
    type: "post",
  };
};

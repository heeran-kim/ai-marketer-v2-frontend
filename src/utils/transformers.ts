// src/utils/transformers.ts
import { PostDto } from "@/types/dto";
import { Post } from "@/types/post";
import { toPlatformObject } from "@/utils/platform";

export const mapPostDtoToPost = (dto: PostDto): Post => {
  const { categories, platform, ...restDto } = dto;

  // Create a platform object from the platform key
  const platformObject = toPlatformObject(platform);

  return {
    ...restDto,
    imageUrl: "",
    aspectRatio: "4/5",
    platform: platformObject,
    selectedCategoryLabels: categories,
    type: "post",
  };
};

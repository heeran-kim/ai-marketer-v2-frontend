// src/app/(protected)/promotions/management/PromotionCard.tsx
import { Promotion } from "@/types/promotion";
import { formatDateRange } from "@/utils/date";
import Image from "next/image";
import {
  CategoryChipList,
  ProductChipList,
  NewProductChipList,
} from "@/components/common";
import { StatusIcon } from "@/components/common";
import { getPlatformIcon, actionIcons, changeIcons } from "@/utils/icon";
import { useRouter } from "next/navigation";

interface PromotionCardProps {
  promotion: Promotion;
  onCreatePost: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const PromotionCard: React.FC<PromotionCardProps> = ({
  promotion,
  onCreatePost,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const router = useRouter();
  const {
    description,
    startDate,
    endDate,
    status,
    soldCount,
    salesChange,
    posts,
    categories,
    products,
    productNames,
  } = promotion;

  // Format dates
  const dateRange = formatDateRange(startDate, endDate);

  const getSalesChangeStyle = () => {
    if (salesChange === undefined || salesChange === null) return "";

    if (salesChange > 0) {
      return "text-green-600 bg-green-50";
    } else if (salesChange < 0) {
      return "text-red-600 bg-red-50";
    }
    console.log("neutral");
    return "text-gray-600 bg-gray-50";
  };

  const getSalesChangeIcon = () => {
    if (salesChange === undefined || salesChange === null) return null;

    if (salesChange > 0) {
      return changeIcons.increase;
    } else if (salesChange < 0) {
      return changeIcons.decrease;
    }
    console.log("icon neutral");
    return changeIcons.neutral;
  };

  // Check if we have the new products array with category info
  const hasProductCategoryInfo = products && products.length > 0;

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <StatusIcon status={status} />
            <span className="font-medium">{dateRange}</span>
          </div>
          {/* Action buttons */}
          <div className="flex space-x-1">
            <button
              className="p-1 text-gray-500 hover:text-gray-700"
              onClick={onEdit}
            >
              {actionIcons["edit"]}
            </button>
            <button
              className="p-1 text-gray-500 hover:text-gray-700"
              onClick={onDuplicate}
            >
              {actionIcons["copy"]}
            </button>
            <button
              className="p-1 text-gray-500 hover:text-gray-700"
              onClick={onDelete}
            >
              {actionIcons["delete"]}
            </button>
          </div>
        </div>

        {/* Category chips */}
        {categories.length > 0 && (
          <div className="mb-3">
            <CategoryChipList labels={categories.map((cat) => cat.label)} />
          </div>
        )}

        {/* Product names with category indication */}
        {hasProductCategoryInfo ? (
          <div className="mb-3">
            <NewProductChipList products={products} />
          </div>
        ) : productNames && productNames.length > 0 ? (
          <div className="mb-3">
            <ProductChipList productNames={productNames} />
          </div>
        ) : null}

        {/* Description */}
        <div className="text-sm text-gray-700 mb-3 whitespace-pre-line">
          {description}
        </div>

        {/* Connected post images */}
        {posts.length > 0 && (
          <div className="flex overflow-x-auto gap-2 pb-2 mb-2">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex-shrink-0 w-80 bg-gray-50 rounded border border-gray-300 relative"
                onClick={() => router.push(`/posts?id=${post.id}`)}
              >
                {/* Image container */}
                <div className="relative w-80 h-40 overflow-hidden">
                  <Image
                    src={post.image}
                    alt="Connected post"
                    className="object-cover rounded-t"
                    fill
                  />
                </div>

                {/* Overlay icon at top-right, inside the same 'relative' container */}
                <div className="absolute top-2 right-2 z-10">
                  <StatusIcon status={post.status} />
                </div>

                {/* Post details: caption, likes, comments */}
                <div className="p-1 text-xs text-gray-500">
                  <div className="relative h-32 overflow-y-auto py-1 scrollbar-hide">
                    <span className="float-left mr-4">
                      {getPlatformIcon(post.platform)}
                    </span>
                    <p className="whitespace-pre-line">{post.caption}</p>
                  </div>
                  <div className="mt-1 pt-1 border-t border-gray-200 flex justify-between">
                    <span>❤️ {post.reactions}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics and Create post button */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center space-x-2">
            {!(soldCount === undefined || soldCount === null) && (
              <span className="text-sm font-medium">Sold: {soldCount}</span>
            )}
            {!(salesChange === undefined || salesChange === null) && (
              <div
                className={`flex items-center text-xs px-2 py-1 rounded-full ${getSalesChangeStyle()}`}
                title="Average sales change compared to previous period"
              >
                {getSalesChangeIcon()}
                <span className="ml-1">{Math.abs(salesChange)}</span>
              </div>
            )}
          </div>
          <button
            className="px-3 py-1 bg-black text-white rounded text-sm hover:bg-gray-800"
            onClick={onCreatePost}
          >
            Create Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionCard;

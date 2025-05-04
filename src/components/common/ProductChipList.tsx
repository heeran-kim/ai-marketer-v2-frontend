// src/components/common/ProductChipList.tsx
import React, { useState } from "react";
import ProductChip from "./ProductChip";
import { useFetchData } from "@/hooks/dataHooks";
import { SETTINGS_API } from "@/constants/api";
import { FaTag } from "react-icons/fa";
import { ProductCategory } from "@/types/promotion";
import InfoTooltip from "./InfoTooltip";

interface SquareVariation {
  id: string;
  name: string;
  priceMoney?: {
    amount: number; // cents value
    currency: string; // e.g., "USD"
  };
}

interface SquareItem {
  id: string;
  name: string;
  description: string;
  variations: SquareVariation[];
  categories: string[];
}

interface SquareCategory {
  id: string;
  name: string;
}

interface SquareItemsResponse {
  squareConnected: boolean;
  items: SquareItem[];
  categories: SquareCategory[];
}

interface ProductItem {
  name: string;
  category?: ProductCategory;
}

interface ProductChipListProps {
  products: ProductItem[];
  maxVisible?: number;
  showTooltip?: boolean;
}

const ProductChipList: React.FC<ProductChipListProps> = ({
  products,
  maxVisible = 5,
  showTooltip = true,
}) => {
  const [expanded, setExpanded] = useState(false);
  const visibleProducts = expanded ? products : products.slice(0, maxVisible);
  const remainingCount = products.length - maxVisible;

  // Fetch square items data with correct type
  const { data } = useFetchData<SquareItemsResponse>(SETTINGS_API.SQUARE_ITEMS);

  // Create a map of product names to their formatted prices
  const productPriceMap = React.useMemo(() => {
    if (!data?.items) return {};

    const map: Record<string, string> = {};
    for (const item of data.items) {
      // Make case-insensitive key for matching
      const key = item.name.toLowerCase();

      // If no variations exist, skip
      if (!item.variations || item.variations.length === 0) continue;

      // If only one variation exists, show its price directly
      if (item.variations.length === 1) {
        const variation = item.variations[0];
        if (variation.priceMoney?.amount) {
          const amount = variation.priceMoney.amount / 100; // Convert cents to dollars
          const currency = variation.priceMoney.currency || "USD";

          const formatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
          });

          map[key] = formatter.format(amount);
        }
        continue;
      }

      // If multiple variations exist, list them all
      const priceList = item.variations
        .filter((v) => v.priceMoney?.amount)
        .map((v) => {
          const amount = v.priceMoney!.amount / 100;
          const currency = v.priceMoney!.currency || "USD";

          const formatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
          });

          return v.name
            ? `${v.name}: ${formatter.format(amount)}`
            : formatter.format(amount);
        });

      if (priceList.length > 0) {
        map[key] = priceList.join(" | ");
      }
    }
    return map;
  }, [data]);

  return (
    <div>
      <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
        <FaTag size={12} />
        <span className="font-medium">Target Products:</span>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {visibleProducts.map((product, index) => (
          <ProductChip
            key={index}
            productName={product.name}
            price={productPriceMap[product.name.toLowerCase()]}
            showTooltip={showTooltip}
            category={product.category || "average"}
          />
        ))}

        {!expanded && remainingCount > 0 && (
          <span
            className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full cursor-pointer hover:bg-gray-300"
            onClick={() => setExpanded(true)}
          >
            +{remainingCount} more
          </span>
        )}

        {expanded && products.length > maxVisible && (
          <span
            className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full cursor-pointer hover:bg-gray-300"
            onClick={() => setExpanded(false)}
          >
            Show less
          </span>
        )}

        <InfoTooltip
          content={`Performance:
                        - Green = Top 10% performer
                        - Red = Bottom 10% performer
                        - Blue = Average performer
                        Based on recent sales data.`}
          position="right"
          width="w-64"
        />
      </div>
    </div>
  );
};

// For backward compatibility with the original API that just takes productNames
interface LegacyProductChipListProps {
  productNames: string[];
  maxVisible?: number;
  showTooltip?: boolean;
}

// Backward compatibility wrapper that converts string[] to ProductItem[]
const BackwardCompatibleProductChipList: React.FC<
  LegacyProductChipListProps
> = ({ productNames, maxVisible, showTooltip }) => {
  // Convert string array to ProductItem array
  const products = productNames.map((name) => ({ name }));

  return (
    <ProductChipList
      products={products}
      maxVisible={maxVisible}
      showTooltip={showTooltip}
    />
  );
};

export { ProductChipList, BackwardCompatibleProductChipList };
export default BackwardCompatibleProductChipList;

// src/components/common/ProductChip.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaInfoCircle } from "react-icons/fa";

interface ProductChipProps {
  productName: string;
  onClick?: () => void;
  price?: string;
  showTooltip?: boolean;
}

const ProductChip: React.FC<ProductChipProps> = ({
  productName,
  onClick,
  price,
  showTooltip = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  // Determine if price contains multiple variations (contains | character)
  const hasMultipleVariations = price?.includes("|") || false;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior: navigate to item settings with this product pre-selected
      router.push(`/settings/items?product=${encodeURIComponent(productName)}`);
    }
  };

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="relative">
      <span
        className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center cursor-pointer hover:bg-blue-200 transition-colors"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
        {truncateText(productName, 20)}
        {showTooltip && price && (
          <FaInfoCircle className="ml-1 text-blue-500" size={10} />
        )}
      </span>

      {/* Tooltip that shows on hover */}
      {showTooltip && isHovered && price && (
        <div
          className={`absolute z-10 bg-gray-800 text-white text-xs rounded py-2 px-3 
                         bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap shadow-lg
                         ${
                           hasMultipleVariations
                             ? "whitespace-normal min-w-[150px] max-w-[200px]"
                             : ""
                         }`}
        >
          <div
            className="triangle absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 
                          border-l-4 border-r-4 border-t-4 
                          border-l-transparent border-r-transparent border-t-gray-800"
          ></div>
          {hasMultipleVariations ? (
            <div>
              <div className="font-semibold mb-1 text-center border-b border-gray-600 pb-1">
                Price Options
              </div>
              <div className="flex flex-col gap-1 max-h-[150px] overflow-y-auto">
                {price.split(" | ").map((variation, idx) => {
                  let name, priceValue;

                  if (variation.includes(":")) {
                    [name, priceValue] = variation.split(":");
                    name = name.trim();
                    priceValue = priceValue.trim();
                  } else {
                    name = "Default";
                    priceValue = variation.trim();
                  }

                  // Use empty string or blank check for name
                  if (!name || name === "") name = "Default";

                  return (
                    <div key={idx} className="flex justify-between">
                      <span className="truncate max-w-[95px]" title={name}>
                        {name}:
                      </span>
                      <span className="font-medium">{priceValue}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-1">{price}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductChip;

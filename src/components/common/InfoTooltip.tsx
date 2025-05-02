// src/components/common/InfoTooltip.tsx
import React from "react";
import { FaInfoCircle } from "react-icons/fa";

interface InfoTooltipProps {
  content: string;
  position?: "top" | "right" | "bottom" | "left";
  width?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  position = "top",
  width = "w-48",
}) => {
  const positionStyles = {
    top: "bottom-full mb-1 left-1/2 -translate-x-1/2",
    right: "left-full ml-1 top-1/2 -translate-y-1/2",
    bottom: "top-full mt-1 left-1/2 -translate-x-1/2",
    left: "right-full mr-1 top-1/2 -translate-y-1/2",
  };

  const arrowStyles = {
    top: "top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800",
    right:
      "right-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-800",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-800",
    left: "left-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-gray-800",
  };

  return (
    <div className="relative inline-block cursor-help group">
      <FaInfoCircle
        className="text-gray-400 hover:text-gray-600 transition-colors"
        size={14}
      />
      <div
        className={`absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 
                    bg-gray-800 text-white text-xs rounded py-2 px-3 
                    ${positionStyles[position]} ${width} transition-opacity duration-200 whitespace-pre-line`}
      >
        <div
          className={`triangle absolute ${arrowStyles[position]} w-0 h-0`}
        ></div>
        {content}
      </div>
    </div>
  );
};

export default InfoTooltip;

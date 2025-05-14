"use client";

import { ReactNode, forwardRef } from "react";

interface CardProps {
  id?: string;
  title?: string;
  description?: ReactNode;
  children: ReactNode;
  restriction?: string;
  showButton?: boolean;
  buttonText?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  buttonDisabled?: boolean;
  buttonLoading?: boolean;
  actionSlot?: ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      id,
      title,
      description,
      children,
      restriction,
      showButton = true,
      buttonText = "Save",
      onClick,
      buttonDisabled = false,
      buttonLoading = false,
      actionSlot,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="bg-white border border-gray-200 rounded-lg shadow-md space-y-4"
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              {title && (
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
              )}
              {description && (
                <div className="text-gray-600 text-sm">{description}</div>
              )}
            </div>
            {actionSlot && <div>{actionSlot}</div>}
          </div>

          <div className="mt-4">{children}</div>
        </div>

        {(restriction || showButton) && (
          <div className="bg-gray-100 px-4 py-3 flex items-center justify-between rounded-b-lg min-h-[48px] gap-3">
            <p className="text-xs text-gray-500">{restriction}</p>
            {showButton ? (
              <button
                id={id}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition flex items-center justify-center min-w-[75px] ${
                  buttonDisabled
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
                onClick={onClick}
                disabled={buttonDisabled}
              >
                {buttonLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                ) : null}
                {buttonText}
              </button>
            ) : (
              <div className="w-[75px]"></div>
            )}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;

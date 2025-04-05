// src/components/StatusIcon.tsx
import React from "react";
import clsx from "clsx";
import { getStatusClass } from "@/components/styles";
import {
  FaPlay,
  FaHourglassHalf,
  FaCheck,
  FaExclamation,
} from "react-icons/fa";

interface StatusIconProps {
  status: string;
  size?: "small" | "default";
}

const StatusIcon: React.FC<StatusIconProps> = ({
  status,
  size = "default",
}) => {
  const lowerStatus = status.toLowerCase();
  let IconComponent;

  if (lowerStatus === "ongoing") {
    IconComponent = FaPlay;
  } else if (lowerStatus === "upcoming" || lowerStatus === "scheduled") {
    IconComponent = FaHourglassHalf;
  } else if (lowerStatus === "ended" || lowerStatus === "published") {
    IconComponent = FaCheck;
  } else if (lowerStatus === "failed") {
    IconComponent = FaExclamation;
  } else {
    IconComponent = null;
  }

  const iconSize = size === "default" ? 10 : 10;
  const circleSize = size === "default" ? iconSize + 20 : iconSize + 10;

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-full",
        getStatusClass(status)
      )}
      style={{
        width: circleSize,
        height: circleSize,
      }}
    >
      {IconComponent && <IconComponent size={iconSize} />}
    </div>
  );
};

export default StatusIcon;

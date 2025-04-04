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
}

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
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

  return (
    <div
      className={clsx(
        "flex items-center justify-center w-8 h-8 rounded-full",
        getStatusClass(status)
      )}
    >
      {IconComponent && <IconComponent size={10} />}
    </div>
  );
};

export default StatusIcon;

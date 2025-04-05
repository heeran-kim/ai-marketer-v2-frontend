// src/components/StatusIcon.tsx
import React from "react";
import clsx from "clsx";
import { getStatusClass } from "@/components/styles";
import { statusIcons } from "@/utils/icon";

interface StatusIconProps {
  status: string;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  const lowerStatus = status.toLowerCase();

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-full w-8 h-8",
        getStatusClass(lowerStatus)
      )}
    >
      {statusIcons[lowerStatus]}
    </div>
  );
};

export default StatusIcon;

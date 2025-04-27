// src/app/(protected)/dashboard/components/PlatformAccountsCard.tsx
import { Platform } from "@/types/business";
import { getPlatformIcon } from "@/utils/icon";
import { useRouter } from "next/navigation";

interface Props {
  platforms: Platform[];
}

export const PlatformAccountsCard = ({ platforms }: Props) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/settings/social")}
      className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold mb-4">Connected Platforms</h3>
      <ul className="space-y-2">
        {platforms.map((platform) => (
          <li
            key={platform.key}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              {getPlatformIcon(platform.key)}
              <span className="text-sm font-medium">{platform.label}</span>
            </div>
            <a
              href={platform.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline break-all text-right"
              title={platform.link}
            >
              @{platform.username}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

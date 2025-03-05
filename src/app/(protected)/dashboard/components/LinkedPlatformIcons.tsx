// app/(protected)/dashboard/components/LastPostInfo.tsx
import { platformConfig } from "@/utils/icon";
import { Platform } from "@/app/types/business";

interface LinkedPlatformsProps {
    linkedPlatforms: Platform[];
}

export default function LinkedPlatformIcons({ linkedPlatforms }: LinkedPlatformsProps) {
    if (linkedPlatforms.length === 0) return null;

    return (
        <div className="flex items-center">
            <div className="flex space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                {linkedPlatforms.map(({ key, link }) => {
                    const platformInfo = platformConfig[key];
                    if (!platformInfo) return null;
                    const { icon: Icon, color } = platformInfo;

                    return (
                        <a
                            key={key}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Icon className={`${color} text-sm hover:opacity-80 transition`} />
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
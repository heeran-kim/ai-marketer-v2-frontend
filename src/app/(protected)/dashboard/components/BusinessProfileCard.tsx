import Image from "next/image";
import { Business } from "@/types/business";
import { useRouter } from "next/navigation";

interface Props {
  business: Business;
}

export const BusinessProfileCard = ({ business }: Props) => {
  const router = useRouter();
  const { name, logo, category, vibe } = business;

  return (
    <div
      onClick={() => router.push("/settings/general")}
      className="relative bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition h-36 sm:h-40"
    >
      {/* Background logo */}
      {logo && (
        <div className="absolute inset-0 opacity-10">
          <Image
            src={`${logo}?t=${new Date().getTime()}`}
            alt={`${name} Logo`}
            fill
            style={{ objectFit: "cover" }}
            className="w-full h-full"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6">
        <p className="text-xl font-semibold text-gray-900">{name}</p>

        {vibe && <p className="text-sm text-gray-800 mt-1">{vibe}</p>}
      </div>
      {/* Tags - Category and Vibe */}
      <div className="absolute bottom-3 right-3 flex gap-2 z-20">
        {category && (
          <span className="px-3 py-1 text-sm rounded-full bg-gray-700 text-white shadow">
            {category}
          </span>
        )}
      </div>
    </div>
  );
};

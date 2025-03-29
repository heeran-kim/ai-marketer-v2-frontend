// src/app/(protected)/dashboard/components/BusinessProfileCard.tsx
import Image from "next/image";
import { Business } from "@/types/business";
import { useRouter } from "next/navigation";

interface Props {
  business: Business;
}

export const BusinessProfileCard = ({ business }: Props) => {
  const router = useRouter();
  const { name, logo } = business;

  return (
    <div
      onClick={() => router.push("/settings/general")}
      className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold mb-4">Business Overview</h3>
      <div className="flex items-center gap-4">
        <Image
          src={`${logo}?t=${new Date().getTime()}` || "/default-logo.png"}
          alt={`${name} Logo`}
          width={60}
          height={60}
          className="rounded-full"
        />
        <div>
          <p className="text-base font-semibold">{name}</p>
        </div>
      </div>
    </div>
  );
};

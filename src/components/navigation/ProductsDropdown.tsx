import Link from "next/link";
import { dropdownItemClass, dropdownTextClass, dropdownSubTextClass } from "@/components/styles";
import { features } from "@/constants/features";

export default function ProductsDropdown() {
    return (
        <div className="absolute top-full left-0 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 mt-2">
            <div className="space-y-3">
                {features.map(({ href, icon, name, shortDescription }) => (
                    <Link key={href} href={href} className={dropdownItemClass}>
                        {icon}
                        <div>
                            <h4 className={dropdownTextClass}>{name}</h4>
                            <p className={dropdownSubTextClass}>{shortDescription}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
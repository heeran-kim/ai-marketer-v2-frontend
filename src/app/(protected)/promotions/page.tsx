"use client";

// import "@/mocks/mockPromotions";
// import { useState } from "react";
// import { deletePost } from "@/models/post";
// import { TYPE_OPTIONS, STATUS_OPTIONS } from "@/models/promotion";
// import SearchBar from "@/components/common/SearchBar";
import DateRangePicker from "@/components/common/DateRangePicker";
import ListCard from "@/components/common/ListCard";
// import Select from "@/components/common/Select";
import { useFetchData } from "@/hooks/useApi";
import { Promotion } from "@/app/types/promotion";
import { PROMOTIONS_API } from "@/constants/api";

export default function PromotionsDashboard() {
    // const [searchTerm, setSearchTerm] = useState("");
    // const [selectedType, setSelectedType] = useState<string | null>(null);
    // const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const { data } = useFetchData<{ promotions: Promotion[]}>(PROMOTIONS_API.GET_ALL);
    const promotions = data?.promotions || [];

    // const [promotions, setPromotions] = useState();

    // const handleDelete = (promotionId: string) => {
    //     const promotion = promotions.find((promo) => promo.id === promotionId);
    //     if (!promotion) return;
    
    //     const relatedPosts = promotion.postId || [];
    
    //     if (relatedPosts.length > 0) {
    //         const confirmDelete = window.confirm(
    //             `There are ${relatedPosts.length} linked posts for this promotion. Do you want to delete them as well?`
    //         );
    
    //         if (confirmDelete) {
    //             relatedPosts.forEach((postId) => deletePost(postId));
    //         }
    //     }
    //     deletePromotion(promotionId);
    //     setPromotions((prevPromotions) => prevPromotions.filter((promo) => promo.id !== promotionId));
    // };

    const handleCreatePost = (promotionId: string) => {
        console.log(`Create a new post for promotion ID: ${promotionId}`);
    };

    const handleDuplicate = (promotionId: string) => {
        console.log(`Duplicate for promotion ID: ${promotionId}`);
    }

    const handleDelete = (promotionId: string) => {
        console.log(`Delete promotion ID: ${promotionId}`);
    }

    // const filteredPromotions = promotions.filter(promo =>
        // (!selectedType || promo.categories === selectedType) &&
        // (!selectedStatus || promo.status === selectedStatus) &&
        // (!searchTerm || promo.description.toLowerCase().includes(searchTerm.toLowerCase()))
    // );

    // const ongoingPromotions = filteredPromotions.filter(promo => promo.status === "Ongoing");
    // const upcomingPromotions = filteredPromotions.filter(promo => promo.status === "Upcoming");
    // const endedPromotions = filteredPromotions.filter(promo => promo.status === "Ended");

    return (
        <div>
            <div className="flex items-center space-x-4 py-4 border-b">
                {/* <SearchBar setSearchTerm={setSearchTerm} placeholder="Search promotions..." /> */}
                <DateRangePicker onChange={(range) => console.log("Selected Range:", range)} />
                {/* <Select value={selectedType} onChange={setSelectedType} options={TYPE_OPTIONS} placeholder="All Types"/>
                <Select value={selectedStatus} onChange={setSelectedStatus} options={STATUS_OPTIONS} placeholder="All Status"/> */}
            </div>

            <div className="space-y-4 mt-2">
                {promotions.map((promo) => (
                // {[...upcomingPromotions, ...ongoingPromotions, ...endedPromotions].map((promo) => (
                    <ListCard 
                        key={promo.id} 
                        item={promo} 
                        type="promotion" 
                        actions={[
                            { label: "Create Post", onClick: () => handleCreatePost(promo.id) },
                            { label: "Duplicate", onClick: () => handleDuplicate(promo.id) },
                            { label: "Delete", onClick: () => handleDelete(promo.id) },
                        ]}
                    />
                ))}
            </div>
        </div>
    );
}
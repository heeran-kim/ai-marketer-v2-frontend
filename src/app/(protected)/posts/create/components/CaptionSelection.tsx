"use client";

import { usePostCreation } from "@/context/PostCreationContext";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/mousewheel";
import { Disclosure } from "@headlessui/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableCaption from "./DraggableCaption";

export default function CaptionSelection() {
    const { captionSuggestions, platformStates, updateCaptionSuggestion } = usePostCreation();
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [openPanel, setOpenPanel] = useState<"captions" | "platforms">("captions");

    const togglePanel = (panel: "captions" | "platforms") => {
        setOpenPanel((prev) => (prev === panel ? (panel === "captions" ? "platforms" : "captions") : panel));
    };

    const handleSelectCaption = (index: number) => {
        setEditingIndex(index);
    };

    const handleEditCaption = (index: number, e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateCaptionSuggestion(index, e.target.value);
    };

    const handleSaveCaption = () => {
        setEditingIndex(null);
    };

    return (
        <>
        </>
        // <DndProvider backend={HTML5Backend}>
        //     <div className="flex flex-col h-full">
        //         <Disclosure key={openPanel === "captions" ? "captions" : "hidden"} defaultOpen={openPanel === "captions"}>
        //             {({ open }) => (
        //                 <div>
        //                     <Disclosure.Button
        //                         className="p-3 border-b bg-white flex justify-between items-center cursor-pointer w-full"
        //                         onClick={() => togglePanel("captions")}
        //                     >
        //                         <h2 className="text-sm font-medium text-gray-600">
        //                             {open ? "Suggested Captions" : "Captions Available"}
        //                         </h2>
        //                         <span className="text-gray-500">{open ? "▲" : "▼"}</span>
        //                     </Disclosure.Button>

        //                     {open && (
        //                         <Disclosure.Panel className="p-3">
        //                             <Swiper
        //                                 spaceBetween={10}
        //                                 slidesPerView={1.4}
        //                                 centeredSlides={true}
        //                                 freeMode={true}
        //                                 grabCursor={true}
        //                                 mousewheel={{ forceToAxis: true }}
        //                                 modules={[Mousewheel]}
        //                                 className="p-3"
        //                             >
        //                                 {captionSuggestions.length > 0 ? (
        //                                     captionSuggestions.map((caption, index) => (
        //                                         <SwiperSlide key={index} className="w-auto">
        //                                             <div
        //                                                 className={`p-3 border rounded-lg cursor-pointer transition text-sm ${
        //                                                     editingIndex === index ? "bg-blue-50 border-blue-500" : "border-gray-300"
        //                                                 }`}
        //                                                 onClick={() => handleSelectCaption(index)}
        //                                                 style={{ height: "20rem" }}
        //                                             >
        //                                                 {editingIndex === index ? (
        //                                                     <textarea
        //                                                         value={caption}
        //                                                         onChange={(e) => handleEditCaption(index, e)}
        //                                                         onBlur={handleSaveCaption}
        //                                                         autoFocus
        //                                                         className="border p-1 rounded-md w-full text-sm resize-none"
        //                                                         rows={13}
        //                                                     />
        //                                                 ) : (
        //                                                     <DraggableCaption id={caption} text={caption} className="whitespace-pre-line overflow-y-auto min-h-[20rem] p-2" />
        //                                                 )}
        //                                             </div>
        //                                         </SwiperSlide>
        //                                     ))
        //                                 ) : (
        //                                     <p className="text-gray-500 text-sm text-center">No AI-generated captions available.</p>
        //                                 )}
        //                             </Swiper>
        //                         </Disclosure.Panel>
        //                     )}
        //                 </div>
        //             )}
        //         </Disclosure>

        //         <Disclosure key={openPanel === "platforms" ? "platforms" : "hidden"} defaultOpen={openPanel === "platforms"}>
        //             {({ open }) => (
        //                     <div>
        //                         <Disclosure.Button className="p-3 border-b bg-white flex justify-between items-center cursor-pointer w-full">
        //                             <div className="p-3 flex flex-wrap gap-2">
        //                                 {platformStates.map((platform) => (
        //                                     <button
        //                                         key={platform.key}
        //                                         className={`px-3 py-1 text-sm rounded-md ${
        //                                             platform.isSelected ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
        //                                         }`}
        //                                         onClick={() => togglePanel("platforms")}
        //                                     >
        //                                         {platform.label}
        //                                     </button>
        //                                 ))}
        //                             </div>
        //                             <span className="text-gray-500">{open ? "▲" : "▼"}</span>
        //                         </Disclosure.Button>
                    
        //                         {open && (
        //                             <Disclosure.Panel className="p-3">
        //                                 {platformStates.map((platform) => (
        //                                     // <PlatformCaption key={platform.key} platform={platform} />
        //                                 ))}
        //                             </Disclosure.Panel>
        //                         )}
        //                     </div>
        //             )}
        //         </Disclosure>
        //     </div>
        // </DndProvider>
    );
}

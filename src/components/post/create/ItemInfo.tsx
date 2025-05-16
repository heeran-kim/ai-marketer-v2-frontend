"use client";

import { useState, useEffect, useRef } from "react";
import { CompactCard } from "@/components/common";
import { usePostEditorContext } from "@/context/PostEditorContext";
import { FaPlus, FaMinus } from "react-icons/fa";

export default function ItemInfo() {
  const { menuItems, captionGenerationInfo, setCaptionGenerationInfo } =
    usePostEditorContext();
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<{
    index: number;
    items: string[];
  }>({
    index: -1,
    items: [],
  });
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Generate suggestions when user types in the name field
  const generateSuggestions = (value: string, index: number) => {
    if (!value.trim()) {
      setSuggestions({ index: -1, items: [] });
      return;
    }

    const menuKeys = Object.keys(menuItems);
    const filteredItems = menuKeys
      .filter((item) => item.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 5);

    setSuggestions({
      index,
      items: filteredItems,
    });
  };

  // Function to handle input changes for item name and description
  const handleItemChange = (
    index: number,
    field: "name" | "description",
    value: string
  ) => {
    setError(null);

    const updatedItems = [...captionGenerationInfo.itemInfo];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    setCaptionGenerationInfo({
      ...captionGenerationInfo,
      itemInfo: updatedItems,
    });

    // Generate suggestions when the name field changes
    if (field === "name") {
      generateSuggestions(value, index);
    }
  };

  // Function to select a suggestion
  const selectSuggestion = (suggestion: string, index: number) => {
    setError(null);
    const itemName = suggestion;

    // Check for exact match first
    if (menuItems[itemName]) {
      const updatedItems = [...captionGenerationInfo.itemInfo];
      updatedItems[index] = {
        name: itemName,
        description: menuItems[itemName],
      };

      setCaptionGenerationInfo({
        ...captionGenerationInfo,
        itemInfo: updatedItems,
      });
      setError(null);
      return;
    }

    // If description is empty for an existing item
    if (!(menuItems[itemName] === undefined)) {
      const updatedItems = [...captionGenerationInfo.itemInfo];
      updatedItems[index] = {
        name: itemName,
        description: menuItems[itemName],
      };

      setCaptionGenerationInfo({
        ...captionGenerationInfo,
        itemInfo: updatedItems,
      });
      setError(
        `Description is missing for "${itemName}".
        Please enter it manually.`
      );
      return;
    }

    setSuggestions({ index: -1, items: [] });
  };

  // Function to add a new empty item
  const addItem = () => {
    setError(null);
    setCaptionGenerationInfo({
      ...captionGenerationInfo,
      itemInfo: [
        ...captionGenerationInfo.itemInfo,
        { name: "", description: "" },
      ],
    });
  };

  // Function to remove an item at a specific index
  const removeItem = (index: number) => {
    setError(null);
    const updatedItems = captionGenerationInfo.itemInfo.filter(
      (_, i) => i !== index
    );
    setCaptionGenerationInfo({
      ...captionGenerationInfo,
      itemInfo: updatedItems,
    });
    setSuggestions({ index: -1, items: [] });
  };

  // Close the suggestion dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRefs.current.every(
          (ref) => ref && !ref.contains(event.target as Node)
        )
      ) {
        setSuggestions({ index: -1, items: [] });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close suggestions on ESC key
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setSuggestions({ index: -1, items: [] });
    }
  };

  return (
    <CompactCard title="Menu Item Information">
      <div className="space-y-4 mb-4">
        {captionGenerationInfo.itemInfo.map((item, index) => (
          <div key={index} className="p-3 border rounded-md bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-700">
                Item #{index + 1}
              </h3>
              <button
                type="button"
                className="text-red-500 hover:text-red-700 transition-colors p-1"
                onClick={() => removeItem(index)}
                aria-label="Remove item"
              >
                <FaMinus size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {/* Item Name Field with Autocomplete */}
              <div className="relative">
                <div className="flex">
                  <input
                    type="text"
                    className="flex-grow text-sm p-2 border rounded-md focus:ring focus:ring-blue-300 focus:border-blue-300 outline-none"
                    value={item.name}
                    placeholder="Enter item name"
                    onChange={(e) =>
                      handleItemChange(index, "name", e.target.value)
                    }
                    onFocus={() => {
                      if (item.name.trim()) {
                        generateSuggestions(item.name, index);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        setSuggestions({ index: -1, items: [] });
                      }, 200);
                    }}
                    onKeyDown={(e) => handleKeyDown(e)}
                  />
                </div>

                {/* Suggestions Dropdown */}
                {suggestions.index === index &&
                  suggestions.items.length > 0 && (
                    <div
                      ref={(el) => {
                        suggestionRefs.current[index] = el;
                      }}
                      className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
                    >
                      {suggestions.items.map((suggestion, i) => (
                        <div
                          key={i}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => selectSuggestion(suggestion, index)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* Item Description Field */}
              <div>
                <textarea
                  className="w-full text-sm p-2 border rounded-md focus:ring focus:ring-blue-300 focus:border-blue-300 outline-none min-h-[60px] resize-none"
                  value={item.description}
                  placeholder="Enter item description or ingredients"
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Error message with potential suggestions */}
      {error && (
        <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md whitespace-pre-line">
          {`${error}`}
        </div>
      )}

      {/* Add Item Button */}
      <button
        type="button"
        className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium text-sm"
        onClick={addItem}
      >
        <FaPlus size={12} className="mr-1" />
        Add Menu Item
      </button>
    </CompactCard>
  );
}

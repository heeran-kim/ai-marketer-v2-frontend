"use client";

import { useState, useEffect, useRef } from "react";
import { CompactCard } from "@/components/common";
import { usePostEditorContext } from "@/context/PostEditorContext";
import { FaPlus, FaMinus, FaSearch } from "react-icons/fa";

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
    const updatedItems = [...captionGenerationInfo.itemInfo];
    updatedItems[index] = {
      ...updatedItems[index],
      name: suggestion,
      description: menuItems[suggestion] || updatedItems[index].description,
    };

    setCaptionGenerationInfo({
      ...captionGenerationInfo,
      itemInfo: updatedItems,
    });

    setSuggestions({ index: -1, items: [] });
    setError(null);
  };

  // Function to add a new empty item
  const addItem = () => {
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
    const updatedItems = captionGenerationInfo.itemInfo.filter(
      (_, i) => i !== index
    );
    setCaptionGenerationInfo({
      ...captionGenerationInfo,
      itemInfo: updatedItems,
    });
    setSuggestions({ index: -1, items: [] });
  };

  // Function to get item description from menuItems
  const getItemDescription = (index: number) => {
    const itemName = captionGenerationInfo.itemInfo[index].name
      .trim()
      .toLowerCase();

    // Check for exact match first
    if (menuItems[itemName]) {
      const updatedItems = [...captionGenerationInfo.itemInfo];
      updatedItems[index] = {
        ...updatedItems[index],
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
    if (!captionGenerationInfo.itemInfo[index].description.trim()) {
      setError(
        `Description is missing for "${captionGenerationInfo.itemInfo[index].name}". Please enter it manually.`
      );
      return;
    }

    // If no exact match, check for close matches
    const menuKeys = Object.keys(menuItems);
    const closeMatches = menuKeys.filter(
      (item) =>
        item.toLowerCase().includes(itemName) ||
        itemName.includes(item.toLowerCase())
    );

    if (closeMatches.length > 0) {
      // If we have close matches, show them as suggestions
      setSuggestions({
        index,
        items: closeMatches,
      });
      setError(`No exact match found. Did you mean: ${closeMatches[0]}?`);
    } else {
      setError(
        `No description found for "${captionGenerationInfo.itemInfo[index].name}".`
      );
    }
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
          <div
            key={index}
            className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
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
                <div className="flex items-center">
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

                  {captionGenerationInfo?.itemInfo.length && (
                    <button
                      type="button"
                      className="ml-2 p-2 bg-black hover:bg-gray-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      onClick={() => getItemDescription(index)}
                      disabled={!item.name.trim()}
                      title="Get item description"
                    >
                      <FaSearch size={14} />
                    </button>
                  )}
                </div>

                {/* Suggestions Dropdown */}
                {suggestions.index === index &&
                  suggestions.items.length > 0 && (
                    <div
                      ref={(el) => {
                        suggestionRefs.current[index] = el;
                      }}
                      className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
                    >
                      {suggestions.items.map((suggestion, i) => (
                        <div
                          key={i}
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm"
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

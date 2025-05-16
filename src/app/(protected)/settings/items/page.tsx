"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CategoryChipList,
  ErrorFallback,
  Modal,
} from "@/components/common";
import { useFetchData, apiClient } from "@/hooks/dataHooks";
import { SETTINGS_API } from "@/constants/api";
import { useNotification } from "@/context/NotificationContext";
import { useSearchParams } from "next/navigation";

// Define types for menu items from Square
interface SquareItemVariation {
  id: string;
  name: string;
  priceMoney?: {
    amount: number;
    currency: string;
  };
}

interface SquareItem {
  id: string;
  name: string;
  description?: string;
  variations: SquareItemVariation[];
  categories?: string[];
  category_names?: string[];
  category_name?: string;
}

interface SquareCategory {
  id: string;
  name: string;
}

interface MenuItemsState {
  items: SquareItem[];
  categories: SquareCategory[];
}

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState<MenuItemsState>({
    items: [],
    categories: [],
  });

  const [editingItem, setEditingItem] = useState<SquareItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isSaving, setIsSaving] = useState(false);
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(
    null
  );

  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const searchParams = useSearchParams();
  const productParam = searchParams.get("product");

  const { showNotification } = useNotification();

  // Fetch menu items
  const { data, error, mutate, isLoading } = useFetchData<{
    squareConnected: boolean;
    items: SquareItem[];
    categories: SquareCategory[];
  }>(SETTINGS_API.SQUARE_ITEMS);

  useEffect(() => {
    if (!data?.squareConnected) return;
    if (data) {
      // Process the data to match items with their category names
      const processedItems = data.items.map((item) => {
        const categoryIds = item.categories || [];
        const categoryNames = categoryIds.map((id) => {
          const category = data.categories.find((cat) => cat.id === id);
          return category?.name || "Uncategorized";
        });
        if (categoryNames.length === 0) {
          categoryNames.push("Uncategorized");
        }

        return {
          ...item,
          category_names: categoryNames,
          category_name: categoryNames[0] || "Uncategorized",
        };
      });

      setMenuItems({
        items: processedItems,
        categories: data.categories,
      });
    }
  }, [data]);

  useEffect(() => {
    if (!data?.squareConnected) return;
    if (data) {
      // Process the data to match items with their category names
      const processedItems = data.items.map((item) => {
        const categoryIds = item.categories || [];
        const categoryNames = categoryIds.map((id) => {
          const category = data.categories.find((cat) => cat.id === id);
          return category?.name || "Uncategorized";
        });
        if (categoryNames.length === 0) {
          categoryNames.push("Uncategorized");
        }

        return {
          ...item,
          category_names: categoryNames,
          category_name: categoryNames[0] || "Uncategorized",
        };
      });

      setMenuItems({
        items: processedItems,
        categories: data.categories,
      });

      // If product param exists, find the matching item and scroll to it
      if (productParam) {
        // Delay to ensure DOM is updated
        setTimeout(() => {
          // Find the item that matches the product name (case-insensitive)
          const foundItem = processedItems.find(
            (item) => item.name.toLowerCase() === productParam.toLowerCase()
          );

          if (foundItem) {
            setHighlightedItemId(foundItem.id);
            setFilter(productParam); // Set the filter to show only this product
          }
        }, 100);
      }
    }
  }, [data, productParam]);

  useEffect(() => {
    if (highlightedItemId && itemRefs.current[highlightedItemId]) {
      // Wait for the DOM to update, then scroll
      setTimeout(() => {
        itemRefs.current[highlightedItemId]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);

      // Clear the highlight after a few seconds
      const timer = setTimeout(() => {
        setHighlightedItemId(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [highlightedItemId]);

  // Filter items based on search and category
  const filteredItems = menuItems.items.filter((item) => {
    const matchesSearch =
      filter === "" ||
      item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.description?.toLowerCase().includes(filter.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      (categoryFilter === "Uncategorized" &&
        (!item.category_names ||
          item.category_names.includes("Uncategorized"))) ||
      (item.category_names && item.category_names.includes(categoryFilter));

    return matchesSearch && matchesCategory;
  });

  // Group items by category for display
  const itemsByCategory = filteredItems.reduce((acc, item) => {
    const category = item.category_name || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, SquareItem[]>);

  const handleEditItem = (item: SquareItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveItem = async () => {
    if (!editingItem) return;

    setIsSaving(true);

    try {
      // Call API to update the item
      await apiClient.patch(SETTINGS_API.SQUARE_ITEM_UPDATE(editingItem.id), {
        name: editingItem.name,
        description: editingItem.description,
        variations: editingItem.variations.map((v) => ({
          id: v.id,
          name: v.name,
          price_money: v.priceMoney,
        })),
      });

      // Update local state
      setMenuItems((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === editingItem.id ? { ...item, ...editingItem } : item
        ),
      }));

      // Close modal and show success message
      setIsModalOpen(false);
      showNotification("success", "Menu item updated successfully!");

      // Refresh data from server
      mutate();
    } catch (error) {
      console.error("Error updating menu item:", error);
      showNotification(
        "error",
        "Failed to update menu item. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Format currency (e.g., 1500 -> $15.00)
  const formatCurrency = (priceData?: {
    amount?: number;
    currency?: string;
  }) => {
    if (!priceData || priceData.amount === undefined) return "N/A";

    const amount = priceData.amount;
    const currency = priceData.currency || "AUD";

    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency,
    }).format(amount / 100);
  };

  if (data === undefined) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    const handleRetry = async () => {
      await mutate();
    };
    return (
      <ErrorFallback
        message="Failed to load menu items. Please try again later."
        onRetry={handleRetry}
        isProcessing={isLoading}
      />
    );
  }

  if (!data.squareConnected) {
    return (
      <Card showButton={false}>
        <p className="text-gray-500 whitespace-pre-line text-sm text-center">
          {`Square is not connected.
          Please connect Square to manage menu items.`}
        </p>
      </Card>
    );
  }

  return (
    <>
      {isModalOpen && editingItem && (
        <Modal isOpen={true} onClose={() => setIsModalOpen(false)}>
          <div className="p-6 flex-1 overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Menu Item</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                  disabled={true}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 min-h-[100px]"
                  value={editingItem.description || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Variations
                </label>
                {editingItem.variations.map((variation, index) => (
                  <div
                    key={variation.id}
                    className="flex items-center space-x-3 mb-2"
                  >
                    <input
                      type="text"
                      className="flex-1 p-2 border rounded-md focus:ring focus:ring-blue-300"
                      value={variation.name || ""}
                      placeholder="Variation name"
                      onChange={(e) => {
                        const updatedVariations = [...editingItem.variations];
                        updatedVariations[index] = {
                          ...variation,
                          name: e.target.value,
                        };
                        setEditingItem({
                          ...editingItem,
                          variations: updatedVariations,
                        });
                      }}
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-2">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-24 p-2 pl-7 border rounded-md focus:ring focus:ring-blue-300"
                        value={
                          variation.priceMoney?.amount
                            ? variation.priceMoney.amount / 100
                            : 0
                        }
                        onChange={(e) => {
                          const priceInCents = Math.round(
                            parseFloat(e.target.value) * 100
                          );
                          const updatedVariations = [...editingItem.variations];
                          updatedVariations[index] = {
                            ...variation,
                            priceMoney: {
                              amount: priceInCents,
                              currency: variation.priceMoney?.currency || "AUD",
                            },
                          };
                          setEditingItem({
                            ...editingItem,
                            variations: updatedVariations,
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                disabled={isSaving}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}
      <div className="max-w-4xl mx-auto space-y-6 text-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search items..."
              className="w-full p-2 border rounded-md"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <select
              className="w-full p-2 border rounded-md"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {menuItems.categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
              <option value="Uncategorized">Uncategorized</option>
            </select>
          </div>
        </div>

        {menuItems.items.length > 0 &&
        Object.entries(itemsByCategory).length === 0 ? (
          <Card showButton={false}>
            <div className="text-center py-8">
              <p className="text-gray-500">
                No menu items found. Try adjusting your filters.
              </p>
            </div>
          </Card>
        ) : (
          Object.entries(itemsByCategory).map(([category, items]) => (
            <div key={category} className="mb-8">
              <h2 className="text-lg font-medium mb-3 px-1">{category}</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    title={item.name}
                    description={item.description}
                    showButton
                    buttonText="Edit"
                    onClick={() => handleEditItem(item)}
                  >
                    {item.category_names && item.category_names.length > 0 && (
                      <div className="mb-3">
                        <CategoryChipList labels={item.category_names} />
                      </div>
                    )}

                    <div className="mt-3 border-t pt-3">
                      <h4 className="text-xs uppercase text-gray-500 mb-2">
                        Variations
                      </h4>
                      <div className="space-y-2">
                        {item.variations.map((variation) => (
                          <div
                            key={variation.id}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm">
                              {variation.name ? variation.name : "Default"}
                            </span>
                            <span className="text-sm font-medium">
                              {formatCurrency(variation.priceMoney)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )}

        {menuItems.items.length === 0 && !isLoading && (
          <Card showButton={false}>
            <div className="text-center py-8 text-sm">
              <p className="text-gray-600 mb-6 whitespace-pre-line">
                {`No Menu Items Found.
                You haven't imported any menu items from Square yet.`}
              </p>
              <a
                href="https://squareup.com/dashboard/items/library"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition"
              >
                Manage Items in Square
              </a>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}

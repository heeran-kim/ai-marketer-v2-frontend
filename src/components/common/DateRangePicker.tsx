"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

export default function DateRangePicker({ onChange }: { onChange: (range: { start: Date | undefined; end: Date | undefined }) => void }) {
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [isOpen, setIsOpen] = useState(false);

    const handleApply = () => {
        onChange({ start: startDate, end: endDate });
        setIsOpen(false);
    };

    const handleReset = () => {
        setStartDate(undefined);
        setEndDate(undefined);
        onChange({ start: undefined, end: undefined });
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm text-sm"
            >
                <FaCalendarAlt className="text-gray-500 dark:text-gray-300" />
                <span>
                    {startDate ? `${startDate.toLocaleDateString()} - ${endDate?.toLocaleDateString() || "..."}` : "Select Date Range"}
                </span>
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg rounded-lg p-4 z-50 w-80">
                    <div className="flex flex-col space-y-4">
                        <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400">Start</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date ?? undefined)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                className="w-full border rounded-md px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        {/* 📆 종료 날짜 선택 */}
                        <div>
                            <label className="block text-xs text-gray-500 dark:text-gray-400">End</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date ?? undefined)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                className="w-full border rounded-md px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 dark:text-white"
                            />
                        </div>

                        {/* ✅ 버튼 그룹 */}
                        <div className="flex justify-between">
                            {/* Reset 버튼 */}
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 text-sm text-gray-500 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                Reset
                            </button>

                            {/* Apply 버튼 */}
                            <button
                                onClick={handleApply}
                                className="px-4 py-2 text-sm font-semibold rounded-md bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-700"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
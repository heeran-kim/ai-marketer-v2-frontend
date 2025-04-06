// src/components/common/Modal/DateRangeModal.tsx
import { useState } from "react";
import Modal from "./Modal";

interface DateRangeModalProps {
  isOpen: boolean;
  initialStart?: string;
  initialEnd?: string;
  onClose: () => void;
  onSubmit: (startDate: string, endDate: string | null) => void;
  title: string;
}

export const DateRangeModal = ({
  isOpen,
  initialStart,
  initialEnd,
  onClose,
  onSubmit,
  title,
}: DateRangeModalProps) => {
  const [startDate, setStartDate] = useState<string>(
    initialStart ? initialStart : new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string | null>(
    initialEnd ? initialEnd : null
  );
  const [noEndDate, setNoEndDate] = useState(
    initialEnd === null ? true : false
  );

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!startDate) {
      setError("Please enter start date.");
      return;
    }

    if (!noEndDate && !endDate) {
      setError("Please enter an end date or check 'No end date'.");
      return;
    }

    onSubmit(startDate, endDate);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} height={"sm:h-fit"}>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={startDate || ""}
            onChange={(e) => {
              setStartDate(e.target.value);
              setError("");
              if (endDate && endDate < e.target.value)
                setEndDate(e.target.value);
            }}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium mb-1">End Date</label>
            <div className="flex gap-3 items-center">
              <input
                type="checkbox"
                checked={noEndDate}
                onChange={(e) => {
                  setNoEndDate(e.target.checked);
                  if (e.target.checked) setEndDate(null);
                }}
              />
              <label className="text-sm font-medium mb-1">No end date</label>
            </div>
          </div>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={endDate || ""}
            onChange={(e) => {
              setEndDate(e.target.value);
              setError("");
            }}
            disabled={noEndDate}
            min={startDate || new Date().toISOString().split("T")[0]}
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 border rounded hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            onClick={handleSubmit}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

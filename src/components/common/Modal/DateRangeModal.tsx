// DateRangeModal.tsx
import { useState } from "react";
import Modal from "./Modal";

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (startDate: string | null, endDate: string | null) => void;
  title: string;
}

export const DateRangeModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
}: DateRangeModalProps) => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    // If both startDate and endDate are null, allow it
    if (startDate === null && endDate === null) {
      onSubmit(null, null);
      onClose();
      return;
    }
    // Check if both start and end dates are provided
    if (!startDate || !endDate) {
      setError("Please enter both start and end dates.");
      return;
    }

    // Check if end date is later than start date
    if (new Date(startDate) > new Date(endDate)) {
      setError("End date must be later than start date.");
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
            }}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={endDate || ""}
            onChange={(e) => {
              setEndDate(e.target.value);
              setError("");
            }}
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

import { usePostEditorContext } from "@/context/PostEditorContext";
import { FaInfoCircle } from "react-icons/fa";

export const CaptionOptionsSelector = () => {
  const { captionGenerationSettings, setCaptionGenerationSettings } =
    usePostEditorContext();

  const handleOptionChange = (
    option: keyof typeof captionGenerationSettings
  ) => {
    setCaptionGenerationSettings({
      ...captionGenerationSettings,
      [option]: !captionGenerationSettings[option],
    });
  };

  return (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-600 rounded-lg shadow-md space-y-4 p-3 flex flex-col">
      <h2 className="text-md font-semibold text-gray-800 dark:text-gray-100">
        Which options would you like to use?
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
        You&apos;ve selected the
        <strong>AI Caption Generator</strong> to create captions. This generator
        is <strong>language-based</strong>, and you can enhance its capabilities
        with the options below. Each option adds additional context to help
        generate smarter and more relevant captions.
      </p>
      <div className="space-y-3">
        {/* Option 1: AWS Rekognition Image Analysis */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="use-rekognition"
              checked={captionGenerationSettings.enableImageAnalysis}
              onChange={() => handleOptionChange("enableImageAnalysis")}
              className="mr-4 mt-1"
            />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                Use Additional AI for Image Analysis
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 pe-3">
                Use another AI that can detect the content in the image, in
                addition to the AI Caption Generator. You can review and adjust
                the detected items before sending them to the AI Caption
                Generator, giving you control over the context used for caption
                generation.
              </p>
            </div>
            <div className="tooltip relative group">
              <FaInfoCircle className="text-gray-400" />
              <div className="tooltip-text invisible group-hover:visible absolute right-0 bg-black text-white text-xs rounded p-2 w-48 z-10">
                AWS Rekognition is used, and it incurs costs for image analysis.
              </div>
            </div>
          </div>
        </div>

        {/* Option 2: OpenAI Vision for Captions */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="use-openai-vision"
              checked={captionGenerationSettings.includeImageInCaption}
              onChange={() => handleOptionChange("includeImageInCaption")}
              className="mr-4 mt-1"
            />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                Enhance AI Caption Generator with Image Processing
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 pe-3">
                Enhance the AI Caption Generator to process images and generate
                captions with full visual context. This method is seamless and
                combines language-based caption generation with image analysis.
              </p>
            </div>
            <div className="tooltip relative group">
              <FaInfoCircle className="text-gray-400" />
              <div className="tooltip-text invisible group-hover:visible absolute right-0 bg-black text-white text-xs rounded p-2 w-48 z-10">
                OpenAI Vision is used, and it incurs costs for image analysis.
              </div>
            </div>
          </div>
        </div>

        {/* Option 3: Include Item Descriptions */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="include-pos-descriptions"
              checked={captionGenerationSettings.includeItemDescription}
              onChange={() => handleOptionChange("includeItemDescription")}
              className="mr-4 mt-1"
            />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                Use Menu Item Description
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 pe-3">
                Provide the menu item details to the AI Caption Generator. You
                can enter the name and description manually, or if your POS
                system is connected, we&apos;ll auto-fill descriptions for you.
              </p>
            </div>
            <div className="tooltip relative group">
              <FaInfoCircle className="text-gray-400" />
              <div className="tooltip-text invisible group-hover:visible absolute right-0 bg-black text-white text-xs rounded p-2 w-48 z-10">
                To enable auto-fill, the POS system must be connected and
                contain the necessary item data.
              </div>
            </div>
          </div>
        </div>

        {/* Option 4: Include Sales Data */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="include-sales-data"
              checked={captionGenerationSettings.includeSalesData}
              onChange={() => handleOptionChange("includeSalesData")}
              className="mr-4 mt-1"
            />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                Use Sales Data
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 pe-3">
                Provide sales data to the AI Caption Generator so it can create
                captions reflecting the popularity of dishes. This option works
                best when combined with the item description option.
              </p>
            </div>
            <div className="tooltip relative group">
              <FaInfoCircle className="text-gray-400" />
              <div className="tooltip-text invisible group-hover:visible absolute right-0 bg-black text-white text-xs rounded p-2 w-48 z-10">
                Requires connection to a POS system and the necessary sales
                data. Accurate item names are essential.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

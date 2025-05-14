import { usePostEditorContext } from "@/context/PostEditorContext";

export const CaptionMethodSelector = () => {
  const { captionGenerationSettings, setCaptionGenerationSettings } =
    usePostEditorContext();

  const handleSelection = (method: "ai" | "manual") => {
    setCaptionGenerationSettings({
      ...captionGenerationSettings,
      method,
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md space-y-10 h-full p-3 flex flex-col">
      <div>
        <h2 className="text-md font-semibold text-gray-800">
          How would you like to generate the caption?
        </h2>
        <p className="text-sm text-gray-600 mt-3">
          Before you create your post, choose how you&apos;d like to create the
          caption. You can either let AI work its magic and generate a caption
          for you, or if you prefer, you can write it yourself. Pick what works
          best for you!
        </p>
      </div>

      <div className="space-y-3">
        <div
          className={`${
            captionGenerationSettings.method === "ai"
              ? "bg-black text-white"
              : "bg-white text-gray-800"
          } border ${
            captionGenerationSettings.method === "ai"
              ? "border-black"
              : "border-gray-200"
          } rounded-lg p-3 cursor-pointer hover:shadow-md`}
          onClick={() => handleSelection("ai")}
        >
          <div className="flex items-start">
            <div className="flex-1">
              <h3 className="text-sm font-semibold">
                Use AI Caption Generator
              </h3>
              <p className="text-xs pe-3">
                Let AI do the work and generate a caption for you. It&apos;s
                quick and easy!
              </p>
            </div>
          </div>
        </div>

        <div
          className={`${
            captionGenerationSettings.method === "manual"
              ? "bg-black text-white"
              : "bg-white text-gray-800"
          } border ${
            captionGenerationSettings.method === "manual"
              ? "border-black"
              : "border-gray-200"
          } rounded-lg p-4 cursor-pointer hover:shadow-md`}
          onClick={() => handleSelection("manual")}
        >
          <div className="flex items-start">
            <div className="flex-1">
              <h3 className="text-sm font-semibold">Write Caption Yourself</h3>
              <p className="text-xs pe-3">
                I&apos;ll handle writing the caption myself.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

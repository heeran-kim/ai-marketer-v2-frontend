import { FaUpload, FaRobot, FaShareAlt } from "react-icons/fa";

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50 text-center relative">
      <h2 className="text-3xl font-bold text-gray-900 mb-10">How It Works</h2>

      <div className="max-w-5xl mx-auto flex flex-col items-center relative">
        <div className="relative flex items-center justify-start w-full mb-8">
          <div className="w-1/2"></div>
          <div className="bg-white px-6 py-4 rounded-2xl shadow-md w-1/2 flex items-center space-x-4">
            <FaUpload className="text-indigo-600 text-3xl" />
            <div>
              <h3 className="text-lg font-semibold">Upload Your Image</h3>
              <p className="text-sm text-gray-600">
                Let AI analyze your image and generate a caption.
              </p>
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-16 border-l-2 border-b-2 border-indigo-400"></div>
        </div>

        <div className="relative flex items-center justify-end w-full mb-8">
          <div className="bg-white px-6 py-4 rounded-2xl shadow-md w-1/2 flex items-center space-x-4">
            <FaRobot className="text-indigo-600 text-3xl" />
            <div>
              <h3 className="text-lg font-semibold">AI Generates Caption</h3>
              <p className="text-sm text-gray-600">
                AI will create a creative and engaging caption.
              </p>
            </div>
          </div>
          <div className="w-1/2"></div>
          <div className="absolute -bottom-6 right-1/2 transform translate-x-1/2 w-16 h-16 border-r-2 border-b-2 border-indigo-400"></div>
        </div>

        <div className="relative flex items-center justify-start w-full">
          <div className="w-1/2"></div>
          <div className="bg-white px-6 py-4 rounded-2xl shadow-md w-1/2 flex items-center space-x-4">
            <FaShareAlt className="text-indigo-600 text-3xl" />
            <div>
              <h3 className="text-lg font-semibold">Post to Social Media</h3>
              <p className="text-sm text-gray-600">
                Easily share your content with one click.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

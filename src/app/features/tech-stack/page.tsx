"use client";
import { FaCode, FaDatabase, FaCloud, FaRobot, FaLightbulb, FaChartLine } from "react-icons/fa";

const techStack = [
    { category: "Frontend", stack: "Next.js + Tailwind CSS", icon: <FaCode /> },
    { category: "Backend", stack: "Django + PostgreSQL", icon: <FaDatabase /> },
    { category: "AI Model", stack: "PyTorch + FastAPI", icon: <FaRobot /> },
    { category: "Deployment", stack: "Docker + AWS EC2", icon: <FaCloud /> },
];
const aiModels = [
    {
        category: "Image Analysis (Computer Vision)",
        description: "Planned pre-trained open-source models from Hugging",
        icon: <FaLightbulb />,
        methods: ["CLIP (Image-to-text matching)", "ResNet (Deep learning-based image classification)", "EfficientNet (Lightweight image recognition model)"],
    },
    {
        category: "Caption Generation (NLP)",
        description: "Generates engaging social media captions based on AI.",
        icon: <FaRobot />,
        methods: ["GPT-4 / T5 (Natural language generation for captions)", "BART (Text summarization & refinement)"],
    },
    {
        category: "Promotion Recommendation (ML)",
        description: "Suggests optimal promotions based on sales and customer data.",
        icon: <FaChartLine />,
        methods: ["AWS Personalize", "XGBoost Fine-tuning", "Custom AI Recommender"],
    },
];

export default function TechStack() {
    return (
        <div className="container mx-auto p-6">
            {/* Tech Stack Section */}
            <h1 className="text-2xl font-bold mb-4">🚀 Technology Stack</h1>

            <div className="grid md:grid-cols-2 gap-6">
                {techStack.map((item) => (
                    <div key={item.category} className="bg-white p-4 border rounded-lg shadow-md flex items-center gap-4">
                        <span className="text-3xl">{item.icon}</span>
                        <div>
                            <h2 className="font-semibold">{item.category}</h2>
                            <p className="text-gray-500">{item.stack}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Model Overview */}
            <h1 className="text-2xl font-bold mt-10 mb-4">🤖 AI Model Development</h1>

            <div className="grid md:grid-cols-2 gap-6">
                {aiModels.map((model) => (
                    <div key={model.category} className="bg-white p-4 border rounded-lg shadow-md">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{model.icon}</span>
                            <h2 className="font-semibold">{model.category}</h2>
                        </div>
                        <p className="text-gray-500 mt-2">{model.description}</p>
                        <ul className="mt-3 space-y-1 text-gray-600 text-sm">
                            {model.methods.map((method, index) => (
                                <li key={index}>• {method}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
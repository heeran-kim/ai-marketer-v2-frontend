import Link from 'next/link';

export default function Hero() {
    return (
        <section className="pt-32 pb-20 bg-gradient-to-r from-indigo-500 to-indigo-700 dark:from-gray-900 dark:to-gray-800 text-white text-center relative">
            <div className="max-w-4xl mx-auto px-6">
                {/* 작은 제목 */}
                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-200 dark:text-indigo-400">
                    AI-Powered Marketing
                </p>

                {/* 메인 타이틀 (글자 크기 줄임) */}
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-4">
                    Boost Your Social Media with AI Captions
                </h1>

                {/* 설명 */}
                <p className="text-base md:text-lg text-indigo-100 dark:text-indigo-300 mt-4">
                    Let AI analyze your images and generate engaging captions instantly.
                </p>

                {/* 버튼 그룹 (위치 조정) */}
                <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <Link href="/get-started" className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-full shadow-md hover:bg-gray-100 transition">
                        Get Started
                    </Link>
                    <Link href="/preview" className="px-6 py-3 bg-indigo-400 dark:bg-indigo-600 text-white font-medium rounded-full shadow-md hover:bg-indigo-500 dark:hover:bg-indigo-700 transition">
                        AI Preview
                    </Link>
                </div>
            </div>
        </section>
    );
}
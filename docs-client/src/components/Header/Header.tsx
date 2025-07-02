import React from 'react';

interface HeaderProps {
    setOpenSiderbar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ setOpenSiderbar }) => {

    return (
        <header className="bg-white border-b border-gray-200 py-3 shadow-sm">
            <div className="flex items-center justify-between px-4">
                {/* Left - Menu Icon */}
                <div className="flex items-center">
                    <button 
                        className="p-2 md:hidden rounded-md hover:bg-gray-100 transition-colors"
                        onClick={() => setOpenSiderbar(true)}
                    >
                        <svg
                            className="w-6 h-6 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>

                {/* Right - Avatar */}
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">U</span>
                            </div>
                            <svg
                                className="w-4 h-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
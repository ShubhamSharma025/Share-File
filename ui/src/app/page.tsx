'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import FileDownload from '@/components/FileDownload';
import { FiUpload, FiDownload, FiShare2 } from 'react-icons/fi';

export default function Home() {
    const [activeTab, setActiveTab] = useState<'upload' | 'download'>('upload');

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="flex items-center justify-center mb-4">
                        <FiShare2 className="w-12 h-12 text-blue-500 mr-3" />
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            PeerLink
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Share files directly peer-to-peer with a simple invite code.
                        Fast, secure, and decentralized.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="glass-card p-2 mb-8 animate-slide-up">
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setActiveTab('upload')}
                            className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${activeTab === 'upload'
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                    : 'text-gray-600 hover:bg-white/50'
                                }`}
                        >
                            <FiUpload className="w-5 h-5" />
                            Upload File
                        </button>
                        <button
                            onClick={() => setActiveTab('download')}
                            className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${activeTab === 'download'
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                    : 'text-gray-600 hover:bg-white/50'
                                }`}
                        >
                            <FiDownload className="w-5 h-5" />
                            Download File
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="animate-fade-in">
                    {activeTab === 'upload' ? <FileUpload /> : <FileDownload />}
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-gray-500 text-sm">
                    <p>Files are shared directly between peers. No data is stored on servers.</p>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import axios from 'axios';
import { FiDownload, FiAlertCircle } from 'react-icons/fi';

export default function FileDownload() {
    const [inviteCode, setInviteCode] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDownload = async () => {
        if (!inviteCode.trim()) {
            setError('Please enter an invite code');
            return;
        }

        setDownloading(true);
        setError(null);

        try {
            const response = await axios.get(`/api/download/${inviteCode}`, {
                responseType: 'blob',
            });

            // Extract filename from Content-Disposition header
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'downloaded-file';

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                }
            }

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            // Reset form
            setInviteCode('');
            setError(null);
        } catch (err: any) {
            if (err.response?.status === 400) {
                setError('Invalid invite code. Please check and try again.');
            } else if (err.response?.status === 500) {
                setError('Unable to connect to peer. Make sure the invite code is correct and the sender is online.');
            } else {
                setError('Failed to download file. Please try again.');
            }
            console.error('Download error:', err);
        } finally {
            setDownloading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleDownload();
        }
    };

    return (
        <div className="glass-card p-8">
            <div className="max-w-md mx-auto">
                {/* Icon */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiDownload className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Download File</h3>
                    <p className="text-gray-600">Enter the invite code to download the file</p>
                </div>

                {/* Input Field */}
                <div className="mb-6">
                    <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-2">
                        Invite Code
                    </label>
                    <input
                        id="inviteCode"
                        type="text"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter the code (e.g., 54321)"
                        className="input-field text-center text-2xl font-semibold tracking-wider"
                        disabled={downloading}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                        <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                {/* Download Button */}
                <button
                    onClick={handleDownload}
                    disabled={!inviteCode.trim() || downloading}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {downloading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Downloading...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <FiDownload className="w-5 h-5" />
                            Download File
                        </span>
                    )}
                </button>

                {/* Info Box */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Get the invite code from the sender</li>
                        <li>Enter the code above</li>
                        <li>Click download to receive the file</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}

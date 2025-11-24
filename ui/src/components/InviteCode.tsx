'use client';

import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

interface InviteCodeProps {
    code: string;
}

export default function InviteCode({ code }: InviteCodeProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-800 mb-3 flex items-center gap-2">
                    <FiCheck className="text-green-600" />
                    File Ready to Share!
                </h3>
                <p className="text-sm text-green-700 mb-4">
                    Share this invite code with anyone you want to share the file with:
                </p>

                <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white border-2 border-green-300 rounded-lg px-4 py-3">
                        <p className="text-2xl font-mono font-bold text-green-900 text-center">
                            {code}
                        </p>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="btn-primary flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                        {copied ? (
                            <>
                                <FiCheck className="w-5 h-5" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <FiCopy className="w-5 h-5" />
                                Copy
                            </>
                        )}
                    </button>
                </div>

                <p className="text-xs text-green-600 mt-4">
                    This code will be valid as long as your file sharing session is active.
                </p>
            </div>
        </div>
    );
}

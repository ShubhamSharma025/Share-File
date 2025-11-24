'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { FiUploadCloud, FiCheck, FiCopy, FiFile, FiX } from 'react-icons/fi';

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [inviteCode, setInviteCode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setInviteCode(null);
            setError(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        maxSize: 100 * 1024 * 1024, // 100MB
    });

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setInviteCode(response.data.port.toString());
        } catch (err: any) {
            setError(err.response?.data || 'Failed to upload file. Please try again.');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleCopy = () => {
        if (inviteCode) {
            navigator.clipboard.writeText(inviteCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleReset = () => {
        setFile(null);
        setInviteCode(null);
        setError(null);
    };

    return (
        <div className="glass-card p-8">
            {!inviteCode ? (
                <>
                    {/* Dropzone */}
                    <div
                        {...getRootProps()}
                        className={`upload-zone ${isDragActive ? 'upload-zone-active' : ''}`}
                    >
                        <input {...getInputProps()} />
                        <div className="text-center">
                            <FiUploadCloud className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                            {isDragActive ? (
                                <p className="text-lg font-medium text-blue-600">Drop the file here...</p>
                            ) : (
                                <>
                                    <p className="text-lg font-medium text-gray-700 mb-2">
                                        Drag & drop a file here
                                    </p>
                                    <p className="text-sm text-gray-500">or click to browse</p>
                                    <p className="text-xs text-gray-400 mt-2">Max file size: 100MB</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Selected File */}
                    {file && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FiFile className="w-8 h-8 text-blue-500" />
                                <div>
                                    <p className="font-medium text-gray-800">{file.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleReset}
                                className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                                <FiX className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Upload Button */}
                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? (
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
                                Uploading...
                            </span>
                        ) : (
                            'Upload & Generate Invite Code'
                        )}
                    </button>
                </>
            ) : (
                /* Success State */
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">File Ready to Share!</h3>
                    <p className="text-gray-600 mb-8">Share this invite code with the recipient</p>

                    {/* Invite Code Display */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-200 mb-6">
                        <p className="text-sm text-gray-600 mb-2">Invite Code</p>
                        <p className="text-4xl font-bold text-blue-600 tracking-wider">{inviteCode}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleCopy}
                            className="btn-primary flex-1 flex items-center justify-center gap-2"
                        >
                            {copied ? (
                                <>
                                    <FiCheck className="w-5 h-5" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <FiCopy className="w-5 h-5" />
                                    Copy Code
                                </>
                            )}
                        </button>
                        <button onClick={handleReset} className="btn-secondary flex-1">
                            Upload Another
                        </button>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <p className="text-sm text-yellow-800">
                            ⚠️ Keep this window open until the file is downloaded
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

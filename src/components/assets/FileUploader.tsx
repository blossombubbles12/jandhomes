"use client";

import React, { useState } from 'react';
import { Upload, X, File, Image, Video, Music, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { uploadToCloudinary } from '@/app/actions/upload';

interface MediaFile {
    url: string;
    type: 'image' | 'video' | 'audio' | 'pdf' | 'doc';
    name: string;
    publicId?: string;
}

interface FileUploaderProps {
    value: MediaFile[];
    onChange: (value: MediaFile[]) => void;
    maxFiles?: number;
    folder?: string;
}

export function FileUploader({ value = [], onChange, maxFiles = 10, folder = 'general' }: FileUploaderProps) {
    const [uploading, setUploading] = useState(false);

    const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (value.length + files.length > maxFiles) {
            toast.error(`Maximum ${maxFiles} files allowed`);
            return;
        }

        // Check for file size limit (100MB)
        const MAX_SIZE = 100 * 1024 * 1024; // 100MB
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > MAX_SIZE) {
                toast.error(`File "${files[i].name}" exceeds the 100MB limit.`);
                return;
            }
        }

        setUploading(true);
        const newMedia: MediaFile[] = [...value];

        try {
            // Sanitize folder name: jandhomes/property-name
            const sanitizedFolder = `jandhomes/${folder.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('file', file);

                const data = await uploadToCloudinary(formData, sanitizedFolder) as any;

                let type: MediaFile['type'] = 'image';
                if (data.resource_type === 'video') type = 'video';
                else if (file.type.includes('audio')) type = 'audio';
                else if (file.type.includes('pdf')) type = 'pdf';
                else if (file.type.includes('word') || file.type.includes('text')) type = 'doc';

                newMedia.push({
                    url: data.secure_url,
                    type,
                    name: file.name,
                    publicId: data.public_id
                });
            }

            onChange(newMedia);
            toast.success('Files uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload files. Server-side upload failed.');
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    const removeFile = (index: number) => {
        const newMedia = [...value];
        newMedia.splice(index, 1);
        onChange(newMedia);
    };

    const getIcon = (type: MediaFile['type']) => {
        switch (type) {
            case 'image': return <Image size={24} className="text-emerald-500" />;
            case 'video': return <Video size={24} className="text-blue-500" />;
            case 'audio': return <Music size={24} className="text-purple-500" />;
            case 'pdf': return <FileText size={24} className="text-red-500" />;
            default: return <File size={24} className="text-slate-400" />;
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {value.map((file, index) => (
                    <div key={index} className="relative group aspect-square rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col items-center justify-center p-2 text-center overflow-hidden">
                        {file.type === 'image' ? (
                            <img src={file.url} alt={file.name} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                        ) : null}

                        <div className="relative z-10 flex flex-col items-center">
                            {getIcon(file.type)}
                            <span className="text-[10px] text-slate-400 mt-1 truncate max-w-full px-2">{file.name}</span>
                        </div>

                        <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}

                {value.length < maxFiles && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex flex-col items-center justify-center cursor-pointer group">
                        {uploading ? (
                            <Loader2 className="animate-spin text-emerald-500 mb-2" />
                        ) : (
                            <Upload className="text-slate-500 group-hover:text-emerald-500 mb-2" />
                        )}
                        <span className="text-xs text-slate-500 group-hover:text-emerald-500">Upload Media</span>
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={onFileSelect}
                            disabled={uploading}
                            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                        />
                    </label>
                )}
            </div>
            <p className="text-[10px] text-slate-500 italic">Supports Images, Videos, Audio, PDFs, and Documents.</p>
        </div>
    );
}

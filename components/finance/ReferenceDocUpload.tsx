'use client';

import { useState, useRef } from 'react';

interface RefDoc {
  name: string;
  url: string;
}

interface ReferenceDocUploadProps {
  docs: RefDoc[];
  onChange: (docs: RefDoc[]) => void;
}

export default function ReferenceDocUpload({ docs, onChange }: ReferenceDocUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-password': pw },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        onChange([...docs, { name: file.name, url: data.url }]);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch {
      alert('Upload failed');
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeDoc = (idx: number) => {
    onChange(docs.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Reference Documents</h3>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-xs text-teal-600 hover:text-teal-700 font-medium disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : '+ Upload Document'}
        </button>
      </div>

      <p className="text-xs text-gray-400">Upload SPK, kontrak, PO, atau dokumen referensi lainnya (PDF, Word, Image)</p>

      {docs.length > 0 && (
        <div className="space-y-1.5">
          {docs.map((doc, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs text-gray-700 flex-1 truncate">{doc.name}</span>
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:text-teal-700 font-medium shrink-0">View</a>
              <button type="button" onClick={() => removeDoc(idx)} className="text-red-400 hover:text-red-600 shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}

'use client';

import { useState, useRef } from 'react';
import type { SaikiwebDocument, DocumentType, ServiceBrand, DocumentStatus } from '@/lib/supabase';
import { DOCUMENT_TYPE_LABELS, SERVICE_BRANDS } from '@/lib/finance';

interface Props {
  document?: SaikiwebDocument;
  onClose: () => void;
  onSaved: () => void;
}

export default function DocumentFormModal({ document: doc, onClose, onSaved }: Props) {
  const isEdit = !!doc?.saikiweb_document_id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    saikiweb_document_number: doc?.saikiweb_document_number || '',
    saikiweb_document_name: doc?.saikiweb_document_name || '',
    saikiweb_document_type: doc?.saikiweb_document_type || ('surat_keputusan' as DocumentType),
    saikiweb_document_date: doc?.saikiweb_document_date || new Date().toISOString().split('T')[0],
    saikiweb_service_brand: doc?.saikiweb_service_brand || ('consultancy' as ServiceBrand),
    saikiweb_status: doc?.saikiweb_status || ('active' as DocumentStatus),
    saikiweb_issued_to: doc?.saikiweb_issued_to || '',
    saikiweb_issued_by: doc?.saikiweb_issued_by || '',
    saikiweb_description: doc?.saikiweb_description || '',
    saikiweb_signer_name: doc?.saikiweb_signer_name || '',
    saikiweb_signer_title: doc?.saikiweb_signer_title || '',
    saikiweb_valid_until: doc?.saikiweb_valid_until || '',
    saikiweb_notes: doc?.saikiweb_notes || '',
    saikiweb_original_file_url: doc?.saikiweb_original_file_url || '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleFileUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('File too large (max 20MB)');
      return;
    }

    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;

    setUploading(true);
    setError('');

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
        set('saikiweb_original_file_url', data.url);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch {
      setError('Upload failed');
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.saikiweb_document_number || !form.saikiweb_document_name || !form.saikiweb_issued_to || !form.saikiweb_issued_by) {
      setError('Please fill in all required fields');
      return;
    }

    const pw = sessionStorage.getItem('admin_pw');
    if (!pw) return;

    setSaving(true);
    setError('');

    try {
      const body = isEdit
        ? { ...form, saikiweb_document_id: doc!.saikiweb_document_id }
        : form;

      const res = await fetch('/api/admin/documents', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        onSaved();
      } else {
        setError(data.error || 'Failed to save');
      }
    } catch {
      setError('Failed to save document');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Edit Document' : 'New Document'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Document Number & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Document Number *</label>
              <input type="text" value={form.saikiweb_document_number} onChange={(e) => set('saikiweb_document_number', e.target.value)} placeholder="DOC.001-SC-04/2026" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Document Date *</label>
              <input type="date" value={form.saikiweb_document_date} onChange={(e) => set('saikiweb_document_date', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm" required />
            </div>
          </div>

          {/* Document Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Document Name *</label>
            <input type="text" value={form.saikiweb_document_name} onChange={(e) => set('saikiweb_document_name', e.target.value)} placeholder="Surat Keputusan Pengesahan Proyek..." className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm" required />
          </div>

          {/* Type, Brand, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Document Type *</label>
              <select value={form.saikiweb_document_type} onChange={(e) => set('saikiweb_document_type', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:border-teal-500 outline-none text-sm">
                {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Service Brand *</label>
              <select value={form.saikiweb_service_brand} onChange={(e) => set('saikiweb_service_brand', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:border-teal-500 outline-none text-sm">
                {Object.entries(SERVICE_BRANDS).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select value={form.saikiweb_status} onChange={(e) => set('saikiweb_status', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:border-teal-500 outline-none text-sm">
                <option value="active">Active</option>
                <option value="revoked">Revoked</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Issued To & By */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Issued To *</label>
              <input type="text" value={form.saikiweb_issued_to} onChange={(e) => set('saikiweb_issued_to', e.target.value)} placeholder="Nama penerima dokumen" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Issued By *</label>
              <input type="text" value={form.saikiweb_issued_by} onChange={(e) => set('saikiweb_issued_by', e.target.value)} placeholder="Nama penerbit dokumen" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm" required />
            </div>
          </div>

          {/* Signer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Signer Name</label>
              <input type="text" value={form.saikiweb_signer_name} onChange={(e) => set('saikiweb_signer_name', e.target.value)} placeholder="Nama penandatangan" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Signer Title</label>
              <input type="text" value={form.saikiweb_signer_title} onChange={(e) => set('saikiweb_signer_title', e.target.value)} placeholder="Jabatan penandatangan" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm" />
            </div>
          </div>

          {/* Valid Until */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Valid Until (optional)</label>
            <input type="date" value={form.saikiweb_valid_until} onChange={(e) => set('saikiweb_valid_until', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
            <textarea value={form.saikiweb_description} onChange={(e) => set('saikiweb_description', e.target.value)} placeholder="Deskripsi singkat dokumen..." rows={3} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm resize-none" />
          </div>

          {/* PDF Upload */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">PDF File (optional)</label>
            {form.saikiweb_original_file_url ? (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span className="text-sm text-green-700 flex-1 truncate">PDF uploaded</span>
                <button type="button" onClick={() => set('saikiweb_original_file_url', '')} className="text-xs text-red-500 hover:text-red-700">Remove</button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${dragOver ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                {uploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-gray-500">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    <p className="text-sm text-gray-500">Drag & drop PDF here or click to browse</p>
                    <p className="text-xs text-gray-400 mt-1">Max 20MB</p>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept=".pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} className="hidden" />
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
            <textarea value={form.saikiweb_notes} onChange={(e) => set('saikiweb_notes', e.target.value)} placeholder="Catatan internal..." rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none text-sm resize-none" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Document' : 'Create Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

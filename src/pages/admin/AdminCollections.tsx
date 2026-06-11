import React, { useState } from 'react';
import { useCollections } from '../../hooks/useCollections';
import { Collection } from '../../types';
import { uploadFile } from '../../firebase/storageUpload';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Loader2, ArrowUpDown } from 'lucide-react';

export default function AdminCollections() {
  const { collections, addCollection, updateCollection, deleteCollection } = useCollections();

  // Modal toggle state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form parameters state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortByOrder, setSortByOrder] = useState(0);

  // Status flags
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const openAddForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setCoverImageFile(null);
    setCoverImageUrl('');
    setCoverImagePreview('');
    setIsActive(true);
    setSortByOrder(collections.length + 1);
    setIsFormOpen(true);
  };

  const openEditForm = (col: Collection) => {
    setEditingId(col.id);
    setName(col.name);
    setDescription(col.description || '');
    setCoverImageFile(null);
    setCoverImageUrl(col.coverImage || '');
    setCoverImagePreview(col.coverImage || '');
    setIsActive(col.isActive);
    setSortByOrder(col.order || 1);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert('Saree Collection Name is required.');
      return;
    }

    setSubmitting(true);

    try {
      let finalCover = coverImageUrl;

      // Handle Firebase Storage profile thumbnail upload
      if (coverImageFile) {
        finalCover = await uploadFile(coverImageFile, { folder: 'collections', maxSizeMb: 5 });
      }

      // Auto-generates standard slug
      const slugValue = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

      const colPayload = {
        name,
        slug: slugValue,
        description,
        coverImage: finalCover || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
        isActive,
        order: sortByOrder,
      };

      if (editingId) {
        await updateCollection(editingId, colPayload);
      } else {
        await addCollection(colPayload);
      }

      setIsFormOpen(false);
    } catch (err) {
      console.error('Failed to preserve Collection categories:', err);
      alert('Failed to save category definitions. Confirm connection parameters.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTrigger = async (id: string, colName: string) => {
    if (window.confirm(`Are you sure you want to delete the Collection segment: "${colName}"?`)) {
      await deleteCollection(id);
    }
  };

  return (
    <div id="admin-category-collections" className="flex flex-col gap-6 font-sans text-xs sm:text-sm">
      
      {/* Header operations bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#B8860B]/15 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1008] uppercase">
            Manage Collections
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Divide your sarees into custom loom sections like Banana Silk, Russian Katan Silk, or Banarasi.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-2 bg-[#7A1C2E] hover:bg-[#1C1008] text-white py-2.5 px-5 rounded text-xs tracking-wide font-extrabold uppercase transition-all shadow cursor-pointer animate-pulse-subtle"
        >
          <Plus className="h-4.5 w-4.5 shrink-0" />
          Add Saree Segment
        </button>
      </div>

      {/* Spreadsheet List */}
      <div className="bg-[#FDF8F2] border border-[#B8860B]/15 rounded py-4 shadow-sm overflow-hidden">
        {collections.length === 0 ? (
          <div className="text-center py-16 text-gray-450 font-serif italic text-base">
            No loom segments configured yet. Select "Add Saree Segment" to initiate category sheets.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs sm:text-sm text-[#1C1008]">
              <thead>
                <tr className="border-b border-[#B8860B]/10 text-gray-500 font-bold uppercase text-[10px] tracking-wider bg-[#E8D5B0]/15">
                  <th className="py-3 px-4">Cover Image</th>
                  <th className="py-3 px-4">Segment Name</th>
                  <th className="py-3 px-4">Description BLurb</th>
                  <th className="py-3 px-4 text-center">Arrange Index</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {collections.map((col) => {
                  return (
                    <tr key={col.id} className="hover:bg-gray-50/40">
                      {/* Cover Thumbnail */}
                      <td className="py-3 px-4 shrink-0">
                        <div className="w-12 h-12 bg-[#E8D5B0]/30 rounded overflow-hidden border border-[#B8860B]/10">
                          {col.coverImage ? (
                            <img 
                              src={col.coverImage} 
                              alt={col.name} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#B8860B]/80 hover:bg-[#1C1008]/20 transition-all">
                              <ImageIcon className="h-4.5 w-4.5" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Info descriptors */}
                      <td className="py-3 px-4 font-bold text-gray-900 font-serif text-sm">
                        {col.name}
                        <span className="text-[10px] text-gray-400 font-mono block select-all">
                          Slug: /{col.slug}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-gray-500 italic max-w-sm truncate">
                        {col.description || 'No descriptive catalog text configured.'}
                      </td>

                      {/* Arranging indexing order */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 font-bold font-mono text-[#B8860B]">
                          <ArrowUpDown className="h-3 w-3 shrink-0" />
                          {col.order || 1}
                        </span>
                      </td>

                      {/* Status flag */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => updateCollection(col.id, { isActive: !col.isActive })}
                          className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider select-none border cursor-pointer ${
                            col.isActive
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-red-50 text-red-700 border-red-250'
                          }`}
                        >
                          {col.isActive ? 'Active' : 'Hidden'}
                        </button>
                      </td>

                      {/* Action configurations */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-x-2">
                          <button
                            onClick={() => openEditForm(col)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteTrigger(col.id, col.name)}
                            className="p-1.5 text-red-650 hover:bg-red-50 hover:text-red-700 rounded transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adding / Editing Modal form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-[#1C1008]/40 z-50 flex justify-center items-center overflow-y-auto p-4">
          <div className="bg-[#FDF8F2] border-2 border-[#B8860B] rounded-lg max-w-lg w-full p-5 sm:p-7 shadow-2xl relative block overflow-y-auto max-h-[92vh]">
            
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full cursor-pointer text-gray-500 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase text-[#1C1008] border-b border-[#B8860B]/10 pb-2 mb-6">
              {editingId ? 'Edit Loom Segment Name' : 'Create Saree Collection'}
            </h2>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              
              {/* Collection Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                  Saree Segment Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Russian Katan Silk"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3.5 py-2 text-sm focus:border-[#7A1C2E] focus:outline-none text-[#1C1008]"
                />
              </div>

              {/* Description BLurb */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                  Description / Heritage Blurb
                </label>
                <textarea
                  rows={3}
                  placeholder="Write details of the weave origin, fiber threads weight, and traditional border specifications."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3.5 py-2 text-sm focus:border-[#7A1C2E] focus:outline-none resize-none text-[#1C1008]"
                />
              </div>

              {/* Cover Image parameters */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                  Collection Cover Banner Thumbnail
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* File */}
                  <div className="border border-dashed border-[#B8860B]/30 p-4 rounded bg-[#FDF8F2] flex flex-col items-center justify-center gap-1 text-center">
                    <ImageIcon className="h-5 w-5 text-[#B8860B]" />
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Select Cover file</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="text-[10px] text-gray-500 w-full"
                    />
                  </div>

                  {/* Fallback */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Fallback Cover URL</span>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={coverImageUrl}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      className="bg-[#FDF8F2] border border-[#B8860B]/20 rounded text-xs p-2 focus:outline-none text-[#1C1008]"
                    />
                  </div>
                </div>

                {coverImagePreview && (
                  <div className="mt-1 relative w-20 h-20 border border-[#B8860B]/10 rounded overflow-hidden shadow-sm bg-neutral-150">
                    <img src={coverImagePreview} alt="cover thumbnail preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Order Arrangement index */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                  Arrangement Sort Index Order (e.g. 1 represents top banner)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={sortByOrder}
                  onChange={(e) => setSortByOrder(parseInt(e.target.value) || 1)}
                  className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3.5 py-2 text-sm focus:border-[#7A1C2E] focus:outline-none font-mono text-[#1C1008]"
                />
              </div>

              {/* Status active state checkbox */}
              <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-gray-700 text-xs mt-1">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-[#7A1C2E] focus:ring-[#7A1C2E] h-4 w-4 text-xs"
                />
                Mark Loom Category as Active (published on public storefront Navbar)
              </label>

              {/* Handlers triggers */}
              <div className="border-t border-[#B8860B]/10 pt-4 flex justify-end gap-x-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded text-xs font-semibold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#7A1C2E] hover:bg-[#1C1008] text-white py-2 px-5 rounded text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                      Preserving Record...
                    </>
                  ) : (
                    'Save Category Segment'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { useBanners } from '../../hooks/useBanners';
import { Banner } from '../../types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function AdminBanners() {
  const { banners, addBanner, updateBanner, deleteBanner } = useBanners();

  // Modal toggle state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form parameters state
  const [headline, setHeadline] = useState('');
  const [subtext, setSubtext] = useState('');
  const [ctaLabel, setCtaLabel] = useState('Explore Catalog');
  const [ctaLink, setCtaLink] = useState('/collections/all');
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [bannerImagePreview, setBannerImagePreview] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Status flags
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerImageFile(file);
      setBannerImagePreview(URL.createObjectURL(file));
    }
  };

  const openAddForm = () => {
    setEditingId(null);
    setHeadline('');
    setSubtext('');
    setCtaLabel('Explore Catalog');
    setCtaLink('/collections/all');
    setBannerImageFile(null);
    setBannerImageUrl('');
    setBannerImagePreview('');
    setIsActive(true);
    setIsFormOpen(true);
  };

  const openEditForm = (bn: Banner) => {
    setEditingId(bn.id);
    setHeadline(bn.headline);
    setSubtext(bn.subtext || '');
    setCtaLabel(bn.ctaLabel || 'Explore Catalog');
    setCtaLink(bn.ctaLink || '/collections/all');
    setBannerImageFile(null);
    setBannerImageUrl(bn.imageUrl || '');
    setBannerImagePreview(bn.imageUrl || '');
    setIsActive(bn.isActive);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline || !ctaLabel) {
      alert('Headline text and CTA label details cannot be blank.');
      return;
    }

    setSubmitting(true);

    try {
      let finalHero = bannerImageUrl;

      // Handle Storage upload if file selected
      if (bannerImageFile) {
        const fileRef = ref(storage, `banners/${Date.now()}_${bannerImageFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`);
        await uploadBytes(fileRef, bannerImageFile);
        finalHero = await getDownloadURL(fileRef);
      }

      const bannerPayload = {
        headline,
        subtext,
        ctaLabel,
        ctaLink,
        imageUrl: finalHero || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
        isActive,
      };

      if (editingId) {
        await updateBanner(editingId, bannerPayload);
      } else {
        // Double check: if this banner is set to active, let's turn off other active banners
        if (isActive) {
          await Promise.all(
            banners
              .filter((b) => b.isActive && b.id !== editingId)
              .map((b) => updateBanner(b.id, { isActive: false }))
          );
        }
        await addBanner(bannerPayload);
      }

      setIsFormOpen(false);
    } catch (err) {
      console.error('Failed to preserve Hero configurations:', err);
      alert('Failed to save Hero slide settings. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTrigger = async (id: string, hl: string) => {
    if (window.confirm(`Are you sure you want to delete the Showcase banner: "${hl}"?`)) {
      await deleteBanner(id);
    }
  };

  return (
    <div id="admin-showcase-banners" className="flex flex-col gap-6 font-sans text-xs sm:text-sm">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#B8860B]/15 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1008] uppercase">
            Home Banners
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Configure the marquee spotlight banner on your store front home section page.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-2 bg-[#7A1C2E] hover:bg-[#1C1008] text-white py-2.5 px-5 rounded text-xs tracking-wide font-extrabold uppercase transition-all shadow cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5 shrink-0" />
          Add Hero Spotlight
        </button>
      </div>

      {/* Spreadsheet grid */}
      <div className="bg-[#FDF8F2] border border-[#B8860B]/15 rounded py-4 shadow-sm overflow-hidden">
        {banners.length === 0 ? (
          <div className="text-center py-16 text-gray-405 font-serif italic text-base">
            No banners configured yet. Default Unsplash masterpiece used as a lobby placeholder.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs sm:text-sm text-[#1C1008]">
              <thead>
                <tr className="border-b border-[#B8860B]/10 text-gray-500 font-bold uppercase text-[10px] tracking-wider bg-[#E8D5B0]/15">
                  <th className="py-3 px-4">image</th>
                  <th className="py-3 px-4">Headline / Text</th>
                  <th className="py-3 px-4">CTA Route</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {banners.map((bn) => {
                  return (
                    <tr key={bn.id} className="hover:bg-gray-50/40">
                      {/* Thumbnail image */}
                      <td className="py-3 px-4 shrink-0">
                        <div className="w-16 aspect-[16/9] bg-[#E8D5B0]/30 rounded overflow-hidden border border-[#B8860B]/10">
                          {bn.imageUrl ? (
                            <img 
                              src={bn.imageUrl} 
                              alt="spotlight hero" 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#B8860B]/80 font-mono text-center">
                              No image
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Headline descriptor */}
                      <td className="py-3 px-4 font-bold text-gray-900 font-serif text-sm max-w-sm">
                        {bn.headline}
                        <p className="font-sans text-[11px] text-gray-500 font-medium normal-case mt-0.5 line-clamp-1">
                          {bn.subtext || 'No description blurb preset.'}
                        </p>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-gray-600 font-medium select-all">
                        {bn.ctaLabel} <code className="text-[#7A1C2E] ml-1 bg-neutral-100 px-1 py-0.5 rounded italic text-[10px]">{bn.ctaLink}</code>
                      </td>

                      {/* Status checkbox */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={async () => {
                            const newActiveState = !bn.isActive;
                            if (newActiveState) {
                              // turn off other active banners
                              await Promise.all(
                                banners
                                  .filter((b) => b.isActive && b.id !== bn.id)
                                  .map((b) => updateBanner(b.id, { isActive: false }))
                              );
                            }
                            await updateBanner(bn.id, { isActive: newActiveState });
                          }}
                          className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider select-none border cursor-pointer ${
                            bn.isActive
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-red-50 text-red-700 border-red-250'
                          }`}
                        >
                          {bn.isActive ? 'Active' : 'Standby'}
                        </button>
                      </td>

                      {/* Operations buttons */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-x-2">
                          <button
                            onClick={() => openEditForm(bn)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors cursor-pointer"
                            title="Edit Banner"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteTrigger(bn.id, bn.headline)}
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

      {/* Editing / Creating modal block */}
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
              {editingId ? 'Edit Hero Spotlight' : 'Create Home Hero Spot'}
            </h2>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              
              {/* Headline */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                  Hero Banner Headline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elegant Handloomed Banarasi Masterpieces"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3.5 py-2 text-sm focus:border-[#7A1C2E] focus:outline-none text-[#1C1008]"
                />
              </div>

              {/* Description subtext */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                  Spotlight Subtext Blurb
                </label>
                <textarea
                  rows={2}
                  placeholder="Briefly capture the emotional story behind the design threads. E.g. handwoven by our master artisans."
                  value={subtext}
                  onChange={(e) => setSubtext(e.target.value)}
                  className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3.5 py-2 text-sm focus:border-[#7A1C2E] focus:outline-none resize-none text-[#1C1008]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* CTA Label */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    required
                    value={ctaLabel}
                    onChange={(e) => setCtaLabel(e.target.value)}
                    className="bg-[#FDF8F2] border border-[#B8860B]/20 rounded px-2.5 py-1.5 text-xs focus:border-[#7A1C2E] focus:outline-none text-[#1C1008]"
                  />
                </div>

                {/* CTA Link Route */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                    CTA Destination URL
                  </label>
                  <input
                    type="text"
                    required
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    className="bg-[#FDF8F2] border border-[#B8860B]/20 rounded px-2.5 py-1.5 text-xs focus:border-[#7A1C2E] focus:outline-none text-[#1C1008]"
                  />
                </div>
              </div>

              {/* Cover Image parameters */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                  Hero Spotlight Cover Art Image
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* File */}
                  <div className="border border-dashed border-[#B8860B]/30 p-4 rounded bg-[#FDF8F2] flex flex-col items-center justify-center gap-1 text-center">
                    <ImageIcon className="h-5 w-5 text-[#B8860B]" />
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Upload Local File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="text-[10px] text-gray-500 w-full"
                    />
                  </div>

                  {/* Fallback */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Fallback Image URL</span>
                    <input
                      type="text"
                      placeholder="e.g. https://images.unsplash.com/..."
                      value={bannerImageUrl}
                      onChange={(e) => setBannerImageUrl(e.target.value)}
                      className="bg-[#FDF8F2] border border-[#B8860B]/20 rounded text-xs p-2 focus:outline-none text-[#1C1008]"
                    />
                  </div>
                </div>

                {bannerImagePreview && (
                  <div className="mt-1 relative w-28 aspect-[16/9] border border-[#B8860B]/10 rounded overflow-hidden shadow-sm bg-neutral-100">
                    <img src={bannerImagePreview} alt="banner preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Status checkboxes */}
              <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-gray-700 text-xs mt-1">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-[#7A1C2E] focus:ring-[#7A1C2E] h-4 w-4 text-xs"
                />
                Mark as Active Spotlight (sets on the main public landing carousel)
              </label>

              {/* CTA handlers */}
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
                    'Activate Spotlight'
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

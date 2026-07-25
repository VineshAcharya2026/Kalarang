import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useCollections } from '../../hooks/useCollections';
import { uploadFiles } from '../../firebase/storageUpload';
import { getFirebaseErrorMessage } from '../../firebase/errors';
import { Product } from '../../types';
import { formatWhatsAppDisplay } from '../../constants/contact';
import { MAIN_COLORS } from '../../constants/colors';
import { useSettings } from '../../hooks/useSettings';
import {
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Image as ImageIcon,
  Loader2,
  FolderHeart,
  Coins,
  AlertCircle,
  Video,
  Star,
  Replace,
} from 'lucide-react';
import {
  DEFAULT_PRODUCT_IMAGE,
  getProductImageByTitle,
} from '../../utils/productImageByTitle';

function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function AdminProducts() {
  const { products, loading, error, addProduct, updateProduct, deleteProduct } = useProducts();
  const { collections } = useCollections();
  const { settings } = useSettings();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [details, setDetails] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [mrp, setMrp] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [addFiles, setAddFiles] = useState<File[]>([]);
  const [replaceFiles, setReplaceFiles] = useState<Record<number, File>>({});
  const [replacePreviewUrls, setReplacePreviewUrls] = useState<Record<number, string>>({});
  const [addPreviewUrls, setAddPreviewUrls] = useState<string[]>([]);
  const [replaceTargetIndex, setReplaceTargetIndex] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [inStock, setInStock] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [allowAddToCart, setAllowAddToCart] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const replaceInputRef = React.useRef<HTMLInputElement>(null);

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const filesArray = Array.from(e.target.files) as File[];
    setAddFiles((prev) => [...prev, ...filesArray]);
    setAddPreviewUrls((prev) => [
      ...prev,
      ...filesArray.map((file) => URL.createObjectURL(file)),
    ]);
    e.target.value = '';
  };

  const handleImageUrlsChange = (value: string) => {
    const urls = value.split(',').map((u) => u.trim()).filter(Boolean);
    setImageUrls(urls);
    setReplaceFiles({});
    setReplacePreviewUrls({});
  };

  const removeImageAt = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setReplaceFiles((prev) => {
      const next: Record<number, File> = {};
      Object.entries(prev).forEach(([k, file]) => {
        const i = Number(k);
        if (i === index) return;
        next[i > index ? i - 1 : i] = file;
      });
      return next;
    });
    setReplacePreviewUrls((prev) => {
      const next: Record<number, string> = {};
      Object.entries(prev).forEach(([k, url]) => {
        const i = Number(k);
        if (i === index) return;
        next[i > index ? i - 1 : i] = url;
      });
      return next;
    });
  };

  const setPrimaryImage = (index: number) => {
    if (index <= 0) return;
    setImageUrls((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.unshift(item);
      return next;
    });
    setReplaceFiles((prev) => {
      if (!prev[index] && !prev[0]) return prev;
      const next: Record<number, File> = {};
      Object.entries(prev).forEach(([k, file]) => {
        const i = Number(k);
        if (i === index) next[0] = file;
        else if (i < index) next[i + 1] = file;
        else next[i] = file;
      });
      return next;
    });
    setReplacePreviewUrls((prev) => {
      if (!prev[index] && !prev[0]) return prev;
      const next: Record<number, string> = {};
      Object.entries(prev).forEach(([k, url]) => {
        const i = Number(k);
        if (i === index) next[0] = url;
        else if (i < index) next[i + 1] = url;
        else next[i] = url;
      });
      return next;
    });
  };

  const startReplaceAt = (index: number) => {
    setReplaceTargetIndex(index);
    replaceInputRef.current?.click();
  };

  const handleReplaceFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const index = replaceTargetIndex;
    e.target.value = '';
    setReplaceTargetIndex(null);
    if (!file || index === null) return;
    const preview = URL.createObjectURL(file);
    setReplaceFiles((prev) => ({ ...prev, [index]: file }));
    setReplacePreviewUrls((prev) => ({ ...prev, [index]: preview }));
  };

  const removePendingAdd = (index: number) => {
    setAddFiles((prev) => prev.filter((_, i) => i !== index));
    setAddPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const applyTitleMatchedImage = () => {
    const matched = getProductImageByTitle(name);
    if (!matched) {
      alert('No stock image mapped for this exact product title yet.');
      return;
    }
    setImageUrls([matched]);
    setReplaceFiles({});
    setReplacePreviewUrls({});
    setAddFiles([]);
    setAddPreviewUrls([]);
  };

  const handleQuickUpdate = async (id: string, data: Partial<Product>) => {
    try {
      await updateProduct(id, data);
    } catch (err) {
      alert(getFirebaseErrorMessage(err, 'Failed to update product.'));
    }
  };

  const resetForm = () => {
    setName('');
    setCollectionId(collections[0]?.id || '');
    setDetails('');
    setSelectedColors([]);
    setMrp(0);
    setSalePrice(0);
    setImageUrls([]);
    setAddFiles([]);
    setReplaceFiles({});
    setReplacePreviewUrls({});
    setAddPreviewUrls([]);
    setReplaceTargetIndex(null);
    setVideoUrl('');
    setInStock(true);
    setIsFeatured(false);
    setIsNewArrival(true);
    setAllowAddToCart(true);
    setFormError(null);
    setUploadProgress(0);
  };

  const openAddForm = () => {
    setEditingId(null);
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (prod: Product) => {
    setEditingId(prod.id);
    setName(prod.name);
    setCollectionId(prod.collectionId);
    setDetails(prod.details || '');
    setSelectedColors(
      (prod.colors || []).filter((color) => color && color !== 'Standard')
    );
    setMrp(prod.mrp);
    setSalePrice(prod.salePrice);
    setImageUrls(prod.images || []);
    setAddFiles([]);
    setReplaceFiles({});
    setReplacePreviewUrls({});
    setAddPreviewUrls([]);
    setReplaceTargetIndex(null);
    setVideoUrl(prod.videoUrl || '');
    setInStock(prod.inStock);
    setIsFeatured(prod.isFeatured);
    setIsNewArrival(prod.isNewArrival);
    setAllowAddToCart(prod.allowAddToCart !== false);
    setFormError(null);
    setUploadProgress(0);
    setIsFormOpen(true);
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !collectionId || salePrice <= 0) {
      alert('Please fill in name, category, and sale price.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      let finalImages = [...imageUrls];
      const replaceEntries = Object.entries(replaceFiles);
      const needsUpload = replaceEntries.length > 0 || addFiles.length > 0;

      if (needsUpload) {
        setUploading(true);
        setUploadProgress(0);
      }

      for (const [indexStr, file] of replaceEntries) {
        const index = Number(indexStr);
        const [url] = await uploadFiles([file], {
          folder: 'products',
          maxSizeMb: 10,
          onProgress: setUploadProgress,
        });
        if (url) finalImages[index] = url;
      }

      if (addFiles.length > 0) {
        const uploadedUrls = await uploadFiles(addFiles, {
          folder: 'products',
          maxSizeMb: 10,
          onProgress: setUploadProgress,
        });
        finalImages = [...finalImages, ...uploadedUrls];
      }

      finalImages = finalImages.filter(Boolean);

      if (!editingId && finalImages.length === 0) {
        const matched = getProductImageByTitle(name);
        finalImages = [matched || DEFAULT_PRODUCT_IMAGE];
      }

      const collectionName =
        collections.find((c) => c.id === collectionId)?.name || 'Handloom';

      const slugValue = editingId
        ? products.find((p) => p.id === editingId)?.slug || slugFromName(name)
        : slugFromName(name);

      const effectiveMrp = mrp > 0 ? mrp : salePrice;

      const productPayload = {
        name,
        slug: slugValue,
        collectionId,
        fabric: collectionName,
        work: '',
        border: '',
        texture: '',
        occasions: [] as string[],
        colors: selectedColors.length > 0 ? selectedColors : ['Standard'],
        mrp: effectiveMrp,
        salePrice,
        details: details.trim(),
        videoUrl: videoUrl.trim(),
        allowAddToCart,
        images: finalImages,
        inStock,
        isFeatured,
        isNewArrival,
      };

      if (editingId) {
        await updateProduct(editingId, productPayload);
      } else {
        await addProduct(productPayload);
      }

      setIsFormOpen(false);
      setAddFiles([]);
      setReplaceFiles({});
      setUploadProgress(0);
    } catch (err) {
      console.error('Failed to submit product:', err);
      setFormError(getFirebaseErrorMessage(err, 'Operation failed. Please try again.'));
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const handleDeleteTrigger = async (id: string, prodName: string) => {
    if (!window.confirm(`Delete "${prodName}" from the catalogue?`)) return;
    try {
      await deleteProduct(id);
    } catch (err) {
      alert(getFirebaseErrorMessage(err, 'Failed to delete product.'));
    }
  };

  const handleMatchStockImages = async () => {
    const active = products.filter((p) => !p.isDeleted);
    const updates = active
      .map((p) => {
        const matched = getProductImageByTitle(p.name);
        return matched ? { id: p.id, name: p.name, image: matched } : null;
      })
      .filter(Boolean) as { id: string; name: string; image: string }[];

    if (updates.length === 0) {
      alert('No products matched known title image maps.');
      return;
    }
    if (
      !window.confirm(
        `Replace primary images for ${updates.length} product(s) with title-matched stock photos?`
      )
    ) {
      return;
    }

    try {
      for (const item of updates) {
        await updateProduct(item.id, { images: [item.image] });
      }
      alert(`Updated images for ${updates.length} product(s).`);
    } catch (err) {
      alert(getFirebaseErrorMessage(err, 'Failed to update product images.'));
    }
  };

  return (
    <div id="admin-inventory-products" className="flex flex-col gap-6 font-sans text-xs sm:text-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#B8860B]/15 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1008] uppercase">
            Manage Products
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Add sarees with image or video, details, cart, and WhatsApp enquiry.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleMatchStockImages}
            className="inline-flex items-center gap-2 border border-[#B8860B] text-[#7A1C2E] hover:bg-[#B8860B]/10 py-2.5 px-4 rounded text-xs font-extrabold uppercase transition-all cursor-pointer"
          >
            <Replace className="h-4 w-4 shrink-0" />
            Match Stock Images
          </button>
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 bg-[#7A1C2E] hover:bg-[#1C1008] text-white py-2.5 px-5 rounded text-xs font-extrabold uppercase transition-all shadow cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5 shrink-0" />
            Add New Saree
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-700 p-4 rounded flex items-start gap-2 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-[#FDF8F2] border border-[#B8860B]/15 rounded py-4 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-500 flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#B8860B]" />
            Loading product catalogue...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400 font-serif italic text-base">
            No sarees added yet. Click &quot;Add New Saree&quot; to create your first listing.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs sm:text-sm text-[#1C1008]">
              <thead>
                <tr className="border-b border-[#B8860B]/10 text-gray-500 font-bold uppercase text-[10px] tracking-wider bg-[#E8D5B0]/15">
                  <th className="py-3 px-4">Media</th>
                  <th className="py-3 px-4">Saree Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4 text-center">Cart</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((prod) => {
                  const collectionObj = collections.find((c) => c.id === prod.collectionId);
                  const firstImg = prod.images?.[0] || '';

                  return (
                    <tr key={prod.id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 shrink-0">
                        <div className="w-12 aspect-[3/4] bg-[#E8D5B0]/30 rounded overflow-hidden border border-[#B8860B]/10">
                          {firstImg ? (
                            <img
                              src={firstImg}
                              alt={prod.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#B8860B]">
                              <ImageIcon className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-4 font-medium max-w-[200px]">
                        <p className="font-serif text-sm font-semibold text-gray-900 truncate">
                          {prod.name}
                        </p>
                        {prod.videoUrl && (
                          <span className="text-[10px] text-[#7A1C2E] flex items-center gap-0.5 mt-0.5">
                            <Video className="h-3 w-3" /> Video
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-600">
                        {collectionObj?.name || 'Exclusive'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-bold text-[#7A1C2E]">
                        ₹{prod.salePrice.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleQuickUpdate(prod.id, { inStock: !prod.inStock })}
                          className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold border cursor-pointer ${
                            prod.inStock
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {prod.inStock ? 'In Stock' : 'Sold Out'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() =>
                            handleQuickUpdate(prod.id, {
                              allowAddToCart: prod.allowAddToCart === false,
                            })
                          }
                          className={`p-1.5 rounded cursor-pointer ${
                            prod.allowAddToCart !== false
                              ? 'text-green-700 bg-green-50'
                              : 'text-gray-300 bg-gray-50'
                          }`}
                          title="Add to cart enabled"
                        >
                          <Check className="h-4 w-4 mx-auto" />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleQuickUpdate(prod.id, { isFeatured: !prod.isFeatured })}
                          className={`p-1.5 rounded cursor-pointer ${
                            prod.isFeatured
                              ? 'text-[#B8860B] bg-[#B8860B]/10'
                              : 'text-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          <Check className="h-4 w-4 mx-auto" />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-x-2">
                          <button
                            onClick={() => openEditForm(prod)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTrigger(prod.id, prod.name)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
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

      {isFormOpen && (
        <div className="fixed inset-0 bg-[#1C1008]/40 z-50 flex justify-center items-center overflow-y-auto p-4 md:p-6">
          <div className="bg-[#FDF8F2] border-2 border-[#B8860B] rounded-lg max-w-lg w-full p-5 sm:p-7 shadow-2xl relative overflow-y-auto max-h-[92vh]">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full cursor-pointer text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase text-[#1C1008] border-b border-[#B8860B]/10 pb-2 mb-6">
              {editingId ? 'Edit Saree' : 'Add Saree'}
            </h2>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-700 p-3 rounded flex items-start gap-2 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {uploading && uploadProgress > 0 && (
                <div className="w-full bg-sand/40 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-maroon h-2 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider">
                  Saree Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chanderi Cotton Silk Saree"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3 py-2 text-sm focus:border-[#7A1C2E] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <FolderHeart className="h-4 w-4 text-[#B8860B]" /> Category{' '}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={collectionId}
                  onChange={(e) => setCollectionId(e.target.value)}
                  className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3 py-2 text-sm focus:border-[#7A1C2E] focus:outline-none"
                >
                  <option value="" disabled>
                    Select category...
                  </option>
                  {collections.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Coins className="h-4 w-4 text-[#B8860B]" /> MRP (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Optional"
                    value={mrp || ''}
                    onChange={(e) => setMrp(parseFloat(e.target.value) || 0)}
                    className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3 py-2 text-sm focus:border-[#7A1C2E] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider">
                    Sale Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={salePrice || ''}
                    onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                    className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3 py-2 text-sm focus:border-[#7A1C2E] focus:outline-none font-bold text-[#7A1C2E]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider">
                  Colours
                </label>
                <div className="flex flex-wrap gap-2">
                  {MAIN_COLORS.map((color) => {
                    const active = selectedColors.includes(color);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => toggleColor(color)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                          active
                            ? 'bg-[#7A1C2E] text-white border-[#7A1C2E]'
                            : 'bg-[#FDF8F2] text-[#1C1008] border-[#B8860B]/25 hover:border-[#7A1C2E]'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider">Details</label>
                <textarea
                  rows={4}
                  placeholder="Fabric, work, border, occasion, care instructions..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3 py-2 text-sm focus:border-[#7A1C2E] focus:outline-none resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider">
                    Product Images
                  </label>
                  <button
                    type="button"
                    onClick={applyTitleMatchedImage}
                    className="text-[10px] font-bold uppercase tracking-wider text-[#7A1C2E] hover:underline"
                  >
                    Use title-matched stock image
                  </button>
                </div>

                <input
                  ref={replaceInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleReplaceFileSelected}
                />

                {(imageUrls.length > 0 || addPreviewUrls.length > 0) && (
                  <div className="flex flex-wrap gap-3 p-2 bg-gray-50 rounded border border-[#B8860B]/10">
                    {imageUrls.map((url, index) => {
                      const preview = replacePreviewUrls[index] || url;
                      return (
                        <div
                          key={`img-${index}`}
                          className="relative w-20 aspect-[3/4] bg-white rounded border border-[#B8860B]/20 overflow-hidden shrink-0 group"
                        >
                          <img src={preview} alt="" className="w-full h-full object-cover" />
                          {index === 0 && (
                            <span className="absolute top-1 left-1 text-[9px] font-bold uppercase bg-[#7A1C2E] text-white px-1.5 py-0.5 rounded">
                              Primary
                            </span>
                          )}
                          <div className="absolute inset-x-0 bottom-0 flex gap-0.5 p-1 bg-black/55 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              title="Replace"
                              onClick={() => startReplaceAt(index)}
                              className="flex-1 h-6 flex items-center justify-center text-white hover:bg-white/20 rounded"
                            >
                              <Replace className="h-3 w-3" />
                            </button>
                            {index > 0 && (
                              <button
                                type="button"
                                title="Set primary"
                                onClick={() => setPrimaryImage(index)}
                                className="flex-1 h-6 flex items-center justify-center text-white hover:bg-white/20 rounded"
                              >
                                <Star className="h-3 w-3" />
                              </button>
                            )}
                            <button
                              type="button"
                              title="Remove"
                              onClick={() => removeImageAt(index)}
                              className="flex-1 h-6 flex items-center justify-center text-white hover:bg-red-500/80 rounded"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {addPreviewUrls.map((preview, index) => (
                      <div
                        key={`add-${index}`}
                        className="relative w-20 aspect-[3/4] bg-white rounded border border-dashed border-[#B8860B]/40 overflow-hidden shrink-0"
                      >
                        <img src={preview} alt="" className="w-full h-full object-cover" />
                        <span className="absolute top-1 left-1 text-[9px] font-bold uppercase bg-[#B8860B] text-white px-1.5 py-0.5 rounded">
                          New
                        </span>
                        <button
                          type="button"
                          title="Remove"
                          onClick={() => removePendingAdd(index)}
                          className="absolute bottom-1 right-1 h-6 w-6 flex items-center justify-center text-white bg-black/55 hover:bg-red-500/80 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border border-dashed border-[#B8860B]/30 p-4 rounded bg-[#FDF8F2] flex flex-col items-center gap-2">
                  <ImageIcon className="h-6 w-6 text-[#B8860B]" />
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                    Add images
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleAddImages}
                    className="text-xs text-gray-500 w-full"
                  />
                  <input
                    type="text"
                    placeholder="Or paste image URL (comma-separated)"
                    value={imageUrls.join(', ')}
                    onChange={(e) => handleImageUrlsChange(e.target.value)}
                    className="w-full bg-white border border-[#B8860B]/20 rounded text-xs p-2 focus:outline-none mt-1"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <Video className="h-4 w-4 text-[#B8860B]" /> Product Video URL (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://... mp4 or YouTube link"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3 py-2 text-sm focus:border-[#7A1C2E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-[#B8860B]/10 pt-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="rounded text-[#7A1C2E] h-4 w-4"
                  />
                  In Stock
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowAddToCart}
                    onChange={(e) => setAllowAddToCart(e.target.checked)}
                    className="rounded text-[#7A1C2E] h-4 w-4"
                  />
                  Enable Add to Cart
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-[#7A1C2E] h-4 w-4"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="rounded text-[#7A1C2E] h-4 w-4"
                  />
                  New Arrival
                </label>
              </div>

              <p className="text-[10px] text-gray-500 bg-green-50 border border-green-200 rounded p-2.5">
                WhatsApp enquiries redirect to{' '}
                <strong className="text-green-800">{formatWhatsAppDisplay(settings?.whatsappNumber)}</strong>
              </p>

              <div className="border-t border-[#B8860B]/10 pt-4 flex justify-end gap-x-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-6 rounded text-xs font-semibold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#7A1C2E] hover:bg-[#1C1008] text-white py-2.5 px-6 rounded text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Saree'
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

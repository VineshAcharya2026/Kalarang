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
} from 'lucide-react';

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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [inStock, setInStock] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [allowAddToCart, setAllowAddToCart] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files) as File[];
      setImageFiles(filesArray);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imageUrls, ...newPreviews]);
    }
  };

  const handleImageUrlsChange = (value: string) => {
    const urls = value.split(',').map((u) => u.trim()).filter(Boolean);
    setImageUrls(urls);
    const localPreviews = imagePreviews.filter((p) => p.startsWith('blob:'));
    setImagePreviews([...urls, ...localPreviews]);
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
    setImageFiles([]);
    setImageUrls([]);
    setImagePreviews([]);
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
    setImageFiles([]);
    setImageUrls(prod.images || []);
    setImagePreviews(prod.images || []);
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

      if (imageFiles.length > 0) {
        setUploading(true);
        setUploadProgress(0);
        const uploadedUrls = await uploadFiles(imageFiles, {
          folder: 'products',
          maxSizeMb: 10,
          onProgress: setUploadProgress,
        });
        finalImages = editingId
          ? [...imageUrls.filter((u) => u.startsWith('http')), ...uploadedUrls]
          : [...finalImages, ...uploadedUrls];
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
        images:
          finalImages.length > 0
            ? finalImages
            : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'],
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
      setImageFiles([]);
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
        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-2 bg-[#7A1C2E] hover:bg-[#1C1008] text-white py-2.5 px-5 rounded text-xs font-extrabold uppercase transition-all shadow cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5 shrink-0" />
          Add New Saree
        </button>
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
                <label className="text-xs font-bold uppercase tracking-wider">
                  Product Image
                </label>
                <div className="border border-dashed border-[#B8860B]/30 p-4 rounded bg-[#FDF8F2] flex flex-col items-center gap-2">
                  <ImageIcon className="h-6 w-6 text-[#B8860B]" />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageFileChange}
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
                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded">
                    {imagePreviews.map((pre, id) => (
                      <div
                        key={id}
                        className="w-14 aspect-[3/4] bg-white rounded border overflow-hidden shrink-0"
                      >
                        <img src={pre} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
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

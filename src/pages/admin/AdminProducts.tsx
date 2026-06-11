import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useCollections } from '../../hooks/useCollections';
import { uploadFiles } from '../../firebase/storageUpload';
import { getFirebaseErrorMessage } from '../../firebase/errors';
import { Product } from '../../types';

function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
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
  AlertCircle
} from 'lucide-react';

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { collections } = useCollections();

  // Form toggles
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields state
  const [name, setName] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [fabric, setFabric] = useState('');
  const [work, setWork] = useState('');
  const [border, setBorder] = useState('');
  const [texture, setTexture] = useState('');
  const [occasions, setOccasions] = useState<string[]>([]);
  const [colorsInput, setColorsInput] = useState('');
  const [mrp, setMrp] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]); // Paste-in fallback URLs
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [inStock, setInStock] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);

  // Status flags
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const occasionOptions = ['Office', 'Festive', 'Wedding', 'Temple', 'Casual', 'Gifting'];

  const handleOccasionToggle = (occ: string) => {
    if (occasions.includes(occ)) {
      setOccasions(occasions.filter((o) => o !== occ));
    } else {
      setOccasions([...occasions, occ]);
    }
  };

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

  const openAddForm = () => {
    setEditingId(null);
    setName('');
    setCollectionId(collections[0]?.id || '');
    setFabric('');
    setWork('');
    setBorder('');
    setTexture('');
    setOccasions([]);
    setColorsInput('');
    setMrp(0);
    setSalePrice(0);
    setImageFiles([]);
    setImageUrls([]);
    setImagePreviews([]);
    setInStock(true);
    setIsFeatured(false);
    setIsNewArrival(true);
    setFormError(null);
    setUploadProgress(0);
    setIsFormOpen(true);
  };

  const openEditForm = (prod: Product) => {
    setEditingId(prod.id);
    setName(prod.name);
    setCollectionId(prod.collectionId);
    setFabric(prod.fabric);
    setWork(prod.work || '');
    setBorder(prod.border || '');
    setTexture(prod.texture || '');
    setOccasions(prod.occasions || []);
    setColorsInput(prod.colors?.join(', ') || '');
    setMrp(prod.mrp);
    setSalePrice(prod.salePrice);
    setImageFiles([]); // Clear new files
    setImageUrls(prod.images || []);
    setImagePreviews(prod.images || []); // Show currently registered images as previews
    setInStock(prod.inStock);
    setIsFeatured(prod.isFeatured);
    setIsNewArrival(prod.isNewArrival);
    setFormError(null);
    setUploadProgress(0);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !collectionId || !fabric || mrp <= 0 || salePrice <= 0) {
      alert('Please fill out all required parameters (Name, Category, Fabric, prices).');
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
        // New uploads replace blob previews; keep any pasted URLs + new uploads
        finalImages = editingId
          ? [...imageUrls.filter((u) => u.startsWith('http')), ...uploadedUrls]
          : [...finalImages, ...uploadedUrls];
      }

      // Format custom colors
      const formattedColors = colorsInput
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      // Keep slug stable when editing so product URLs and doc IDs stay mapped
      const slugValue = editingId
        ? products.find((p) => p.id === editingId)?.slug || slugFromName(name)
        : slugFromName(name);

      const productPayload = {
        name,
        slug: slugValue,
        collectionId,
        fabric,
        work,
        border,
        texture,
        occasions,
        colors: formattedColors,
        mrp,
        salePrice,
        images: finalImages.length > 0 ? finalImages : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'],
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
      console.error('Failed to submit product profile:', err);
      setFormError(getFirebaseErrorMessage(err, 'Operation failed. Please verify configurations.'));
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const handleDeleteTrigger = async (id: string, prodName: string) => {
    if (!window.confirm(`Are you sure you want to delete the product: "${prodName}" from display catalogue?`)) {
      return;
    }
    try {
      await deleteProduct(id);
    } catch (err) {
      alert(getFirebaseErrorMessage(err, 'Failed to delete product.'));
    }
  };

  return (
    <div id="admin-inventory-products" className="flex flex-col gap-6 font-sans text-xs sm:text-sm">
      
      {/* Header bar controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#B8860B]/15 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1008] uppercase">
            Manage Products
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Add new handloom sarees, configure border motifs, and toggle sales featured status.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-2 bg-[#7A1C2E] hover:bg-[#1C1008] text-white py-2.5 px-5 rounded text-xs letter-spacing-wide font-extrabold uppercase transition-all shadow cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5 shrink-0" />
          Add New Saree
        </button>
      </div>

      {/* Main product spreadsheet list */}
      <div className="bg-[#FDF8F2] border border-[#B8860B]/15 rounded py-4 shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-400 font-serif italic text-base">
            No sarees added yet. Click "+ Add New Saree" to create your first design.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs sm:text-sm text-[#1C1008]">
              <thead>
                <tr className="border-b border-[#B8860B]/10 text-gray-500 font-bold uppercase text-[10px] tracking-wider bg-[#E8D5B0]/15">
                  <th className="py-3 px-4">Thumbnail</th>
                  <th className="py-3 px-4">Saree Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Sale Price</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-center">Arrival</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((prod) => {
                  const collectionObj = collections.find((c) => c.id === prod.collectionId);
                  const firstImg = (prod.images && prod.images[0]) || '';
                  
                  return (
                    <tr key={prod.id} className="hover:bg-gray-50/50">
                      {/* Image Thumbnail */}
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

                      {/* Detail information */}
                      <td className="py-2 px-4 font-medium max-w-[200px]">
                        <p className="font-serif text-sm font-semibold text-gray-900 truncate">
                          {prod.name}
                        </p>
                        <span className="text-[10px] text-gray-500 block">
                          Fabric: {prod.fabric}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-gray-600 font-medium select-none">
                        {collectionObj ? collectionObj.name : 'Exclusive'}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap font-bold text-[#7A1C2E]">
                        ₹{prod.salePrice.toLocaleString('en-IN')}{' '}
                        <span className="text-[10px] text-gray-400 font-normal line-through block">
                          MRP ₹{prod.mrp.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* In Stock toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleQuickUpdate(prod.id, { inStock: !prod.inStock })}
                          className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider select-none border cursor-pointer ${
                            prod.inStock
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-red-50 text-red-700 border-red-250'
                          }`}
                        >
                          {prod.inStock ? 'In Stock' : 'Sold Out'}
                        </button>
                      </td>

                      {/* Featured toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleQuickUpdate(prod.id, { isFeatured: !prod.isFeatured })}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            prod.isFeatured 
                              ? 'text-[#B8860B] bg-[#B8860B]/10 hover:bg-[#B8860B]/15' 
                              : 'text-gray-300 hover:text-gray-400 hover:bg-gray-100'
                          }`}
                          title="Best Seller"
                        >
                          <Check className="h-4.5 w-4.5 mx-auto" />
                        </button>
                      </td>

                      {/* New Arrival toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleQuickUpdate(prod.id, { isNewArrival: !prod.isNewArrival })}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            prod.isNewArrival 
                              ? 'text-[#7A1C2E] bg-[#7A1C2E]/10 hover:bg-[#7A1C2E]/15' 
                              : 'text-gray-300 hover:text-[#7A1C2E]/5 hover:bg-gray-100'
                          }`}
                          title="New Arrival Badge"
                        >
                          <Check className="h-4.5 w-4.5 mx-auto" />
                        </button>
                      </td>

                      {/* Edit or Delete Action triggers */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-x-2">
                          <button
                            onClick={() => openEditForm(prod)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteTrigger(prod.id, prod.name)}
                            className="p-1.5 text-red-650 hover:bg-red-50 hover:text-red-700 rounded transition-colors cursor-pointer"
                            title="Delete Saree"
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

      {/* Slide-out or centered Form modal wrapper */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-[#1C1008]/40 z-50 flex justify-center items-center overflow-y-auto p-4 md:p-6">
          <div className="bg-[#FDF8F2] border-2 border-[#B8860B] rounded-lg max-w-3xl w-full p-5 sm:p-7 shadow-2xl relative block overflow-y-auto max-h-[92vh]">
            
            {/* Modal Exit cross */}
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full cursor-pointer text-gray-500 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="font-serif text-xl sm:text-2xl font-bold uppercase text-[#1C1008] border-b border-[#B8860B]/10 pb-2 mb-6">
              {editingId ? 'Edit Product Parameters' : 'Add Saree to Catalog'}
            </h2>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">

              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-700 p-3 rounded flex items-start gap-2 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {uploading && uploadProgress > 0 && (
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-wider font-bold">
                    <span>Uploading images...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-sand/40 rounded-full h-2 overflow-hidden border border-gold/10">
                    <div
                      className="bg-maroon h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Saree Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                    Saree Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Classic Crimson Katan Brocade"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3 py-2 text-sm focus:border-[#7A1C2E] focus:outline-none text-[#1C1008]"
                  />
                </div>

                {/* Saree Collection Categories select */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider flex items-center gap-1">
                    <FolderHeart className="h-4 w-4 text-[#B8860B]" /> Saree Collection Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={collectionId}
                    onChange={(e) => setCollectionId(e.target.value)}
                    className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3 py-2 text-sm focus:border-[#7A1C2E] focus:outline-none text-[#1C1008]"
                  >
                    <option value="" disabled>Select category group...</option>
                    {collections.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#E8D5B0]/15 p-4 border border-[#B8860B]/10 rounded">
                {/* Saree fabric */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                    Fabric Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Silk / Cotton"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="bg-[#FDF8F2] border border-[#B8860B]/20 rounded px-2.5 py-1.5 text-xs focus:border-[#7A1C2E] focus:outline-none text-[#1C1008]"
                  />
                </div>

                {/* Saree Motif or work */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                    Work Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Zari Jaal Work"
                    value={work}
                    onChange={(e) => setWork(e.target.value)}
                    className="bg-[#FDF8F2] border border-[#B8860B]/20 rounded px-2.5 py-1.5 text-xs focus:border-[#7A1C2E] focus:outline-none text-[#1C1008]"
                  />
                </div>

                {/* Saree Border description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                    Saree Border Style
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Broad Brocade Border"
                    value={border}
                    onChange={(e) => setBorder(e.target.value)}
                    className="bg-[#FDF8F2] border border-[#B8860B]/20 rounded px-2.5 py-1.5 text-xs focus:border-[#7A1C2E] focus:outline-none text-[#1C1008]"
                  />
                </div>

                {/* Saree texture */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                    Texture Profile
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Smooth Velvet finish"
                    value={texture}
                    onChange={(e) => setTexture(e.target.value)}
                    className="bg-[#FDF8F2] border border-[#B8860B]/20 rounded px-2.5 py-1.5 text-xs focus:border-[#7A1C2E] focus:outline-none text-[#1C1008]"
                  />
                </div>
              </div>

              {/* Saree pricing metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-yellow-500/5 p-4 border border-[#B8860B]/10 rounded">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider flex items-center gap-1">
                    <Coins className="h-4 w-4 text-[#B8860B]" /> Saree MRP Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Enter maximum retail price"
                    value={mrp || ''}
                    onChange={(e) => setMrp(parseFloat(e.target.value) || 0)}
                    className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3 py-2 text-sm focus:border-[#7A1C2E] focus:outline-none font-bold text-[#1C1008]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider flex items-center gap-1">
                    <Coins className="h-4 w-4 text-[#7A1C2E]" /> Saree Sale Price (₹) <span className="text-red-550">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Enter discounted selling price"
                    value={salePrice || ''}
                    onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                    className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3 py-2 text-sm focus:border-[#7A1C2E] focus:outline-none font-bold text-[#7A1C2E]"
                  />
                </div>
              </div>

              {/* Image asset uploader (Firebase storage) */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                  Saree Product Showcase Images (Firebase Storage & Fallback URLs)
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* File selection */}
                  <div className="border border-dashed border-[#B8860B]/30 p-4 rounded bg-[#FDF8F2] flex flex-col items-center justify-center gap-2">
                    <ImageIcon className="h-6 w-6 text-[#B8860B]" />
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold">Select Local Image Files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="text-xs text-gray-500 w-full"
                    />
                  </div>

                  {/* URL fallback pasting */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">
                      Paste Fallback Unsplash URL list (pave image urls separated by comma)
                    </span>
                    <textarea
                      placeholder="e.g. https://images.unsplash.com/..., https://..."
                      rows={3}
                      value={imageUrls.join(', ')}
                      onChange={(e) => handleImageUrlsChange(e.target.value)}
                      className="bg-[#FDF8F2] border border-[#B8860B]/20 rounded text-xs p-2 focus:outline-none resize-none text-[#1C1008]"
                    />
                  </div>
                </div>

                {/* Previews display */}
                {imagePreviews.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 py-1 bg-gray-50 p-3 rounded">
                    {imagePreviews.map((pre, id) => (
                      <div key={id} className="relative w-14 aspect-[3/4] bg-white rounded border border-[#B8860B]/10 overflow-hidden shrink-0">
                        <img src={pre} alt="showcase preview" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Occasions multi_select */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                    Recommended Occasions Checkboxes
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-[#FDF8F2]/60 p-3 rounded border border-gray-100">
                    {occasionOptions.map((occ) => (
                      <label key={occ} className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={occasions.includes(occ)}
                          onChange={() => handleOccasionToggle(occ)}
                          className="rounded text-[#7A1C2E] focus:ring-[#7A1C2E] h-3.5 w-3.5"
                        />
                        {occ}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Saree colors tag fields */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                    Add Colors (separated by commas)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mustard Yellow, Emerald Green, Royal Crimson"
                    value={colorsInput}
                    onChange={(e) => setColorsInput(e.target.value)}
                    className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3 py-2 text-sm focus:border-[#7A1C2E] focus:outline-none text-[#1C1008]"
                  />
                  <span className="text-[9px] text-gray-500 leading-none">
                    Enter as colors separated by a comma. These generate detail choices.
                  </span>
                </div>
              </div>

              {/* Toggles features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#B8860B]/10 pt-4 text-xs font-sans">
                <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="rounded text-[#7A1C2E] focus:ring-[#7A1C2E] h-4 w-4"
                  />
                  Mark Saree in Stock
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-[#7A1C2E] focus:ring-[#7A1C2E] h-4 w-4"
                  />
                  Featured in Best Sellers
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="rounded text-[#7A1C2E] focus:ring-[#7A1C2E] h-4 w-4"
                  />
                  Mark Saree New Arrival
                </label>
              </div>

              {/* Submit panel */}
              <div className="border-t border-[#B8860B]/10 pt-4 flex justify-end gap-x-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-6 rounded text-xs font-semibold tracking-wider uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#7A1C2E] hover:bg-[#1C1008] text-white py-2.5 px-6 rounded text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                      {uploading ? 'Uploading Images...' : 'Saving Saree profile...'}
                    </>
                  ) : (
                    'Save Saree Profile'
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

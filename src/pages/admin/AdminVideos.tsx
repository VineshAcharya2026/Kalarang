import React, { useState } from 'react';
import { useVideos } from '../../hooks/useVideos';
import { HeroVideo } from '../../types';
import { Plus, Edit, Trash2, X, Film, Loader2, Play } from 'lucide-react';

export default function AdminVideos() {
  const { videos, addVideo, updateVideo, deleteVideo, uploadVideoFile } = useVideos();

  // Modal toggle state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form parameters state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPreview, setVideoPreview] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Status flags
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const openAddForm = () => {
    setEditingId(null);
    setTitle('');
    setSubtitle('');
    setVideoFile(null);
    setVideoUrl('');
    setVideoPreview('');
    setIsActive(true);
    setUploadProgress(null);
    setIsFormOpen(true);
  };

  const openEditForm = (vid: HeroVideo) => {
    setEditingId(vid.id);
    setTitle(vid.title);
    setSubtitle(vid.subtitle || '');
    setVideoFile(null);
    setVideoUrl(vid.videoUrl || '');
    setVideoPreview(vid.videoUrl || '');
    setIsActive(vid.isActive);
    setUploadProgress(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Video title cannot be empty.');
      return;
    }

    if (!videoFile && !videoUrl) {
      alert('Please select a local video file to upload, or specify a valid public mp4 URL.');
      return;
    }

    setSubmitting(true);

    try {
      let finalVideoUrl = videoUrl;

      // Handle Storage upload if file selected
      if (videoFile) {
        setUploadProgress(0);
        finalVideoUrl = await uploadVideoFile(videoFile, (progress) => {
          setUploadProgress(Math.round(progress));
        });
      }

      const videoPayload = {
        title,
        subtitle,
        videoUrl: finalVideoUrl,
        isActive,
      };

      if (editingId) {
        // Update existing video document
        if (isActive) {
          // If deactivated others
          await Promise.all(
            videos
              .filter((v) => v.isActive && v.id !== editingId)
              .map((v) => updateVideo(v.id, { isActive: false }))
          );
        }
        await updateVideo(editingId, videoPayload);
      } else {
        // Add new video document
        if (isActive) {
          // Deactivate others
          await Promise.all(
            videos
              .filter((v) => v.isActive)
              .map((v) => updateVideo(v.id, { isActive: false }))
          );
        }
        await addVideo(videoPayload);
      }

      setIsFormOpen(false);
    } catch (err) {
      console.error('Failed to preserve Video configurations:', err);
      alert('Failed to save Video settings. Check storage rules or format.');
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  const handleDeleteTrigger = async (id: string, hl: string) => {
    if (window.confirm(`Are you sure you want to delete the Showcase video: "${hl}"?`)) {
      await deleteVideo(id);
    }
  };

  return (
    <div id="admin-showcase-videos" className="flex flex-col gap-6 font-sans text-xs sm:text-sm">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#B8860B]/15 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1008] uppercase">
            Hero Videos
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Manage high-fidelity video drapes and craft clips running dynamically on your storefront.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-2 bg-[#7A1C2E] hover:bg-[#1C1008] text-white py-2.5 px-5 rounded text-xs tracking-wide font-extrabold uppercase transition-all shadow cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5 shrink-0" />
          Add Studio Video
        </button>
      </div>

      {/* Spreadsheet grid */}
      <div className="bg-[#FDF8F2] border border-[#B8860B]/15 rounded py-4 shadow-sm overflow-hidden">
        {videos.length === 0 ? (
          <div className="text-center py-16 text-gray-400 font-serif italic text-base">
            No cinematic videos uploaded yet. Upload beautiful craft loops of weavers at work.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs sm:text-sm text-[#1C1008]">
              <thead>
                <tr className="border-b border-[#B8860B]/10 text-gray-500 font-bold uppercase text-[10px] tracking-wider bg-[#E8D5B0]/15">
                  <th className="py-3 px-4">Preview</th>
                  <th className="py-3 px-4">Title / Subtitle</th>
                  <th className="py-3 px-4">Video Link Source</th>
                  <th className="py-3 px-4 text-center">Hero BG Overlay</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {videos.map((vid) => {
                  return (
                    <tr key={vid.id} className="hover:bg-gray-50/40">
                      {/* Thumbnail video preview wrapper */}
                      <td className="py-3 px-4 shrink-0">
                        <div className="w-16 aspect-[16/9] bg-black rounded overflow-hidden border border-[#B8860B]/10 relative group flex items-center justify-center">
                          <video 
                            src={vid.videoUrl} 
                            className="w-full h-full object-cover opacity-80" 
                            preload="metadata"
                          />
                          <button
                            onClick={() => setPlayingVideoUrl(vid.videoUrl)}
                            className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white rounded cursor-pointer transition-colors"
                            title="Play Preview"
                          >
                            <Play className="h-4 w-4 fill-white shrink-0" />
                          </button>
                        </div>
                      </td>

                      {/* Headline descriptor */}
                      <td className="py-3 px-4 font-bold text-gray-900 font-serif text-sm max-w-sm">
                        {vid.title}
                        <p className="font-sans text-[11px] text-gray-500 font-medium normal-case mt-0.5 line-clamp-1">
                          {vid.subtitle || 'No subtitle reel blurb preset.'}
                        </p>
                      </td>

                      <td className="py-3 px-4 max-w-xs truncate text-gray-600 font-mono text-[11px] select-all">
                        {vid.videoUrl}
                      </td>

                      {/* Status checkbox */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={async () => {
                            const newActiveState = !vid.isActive;
                            if (newActiveState) {
                              // turn off other active videos
                              await Promise.all(
                                videos
                                  .filter((v) => v.isActive && v.id !== vid.id)
                                  .map((v) => updateVideo(v.id, { isActive: false }))
                              );
                            }
                            await updateVideo(vid.id, { isActive: newActiveState });
                          }}
                          className={`inline-block px-3 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider select-none border cursor-pointer ${
                            vid.isActive
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-red-50 text-red-700 border-red-250'
                          }`}
                        >
                          {vid.isActive ? 'Active BG' : 'Standby'}
                        </button>
                      </td>

                      {/* Operations buttons */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-x-2">
                          <button
                            onClick={() => openEditForm(vid)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors cursor-pointer"
                            title="Edit Video"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteTrigger(vid.id, vid.title)}
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
              {editingId ? 'Edit Showcase Video' : 'Add Studio Cinematic Video'}
            </h2>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                  Video Display Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pure Heritage Brocade Weaving"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3.5 py-2 text-sm focus:border-[#7A1C2E] focus:outline-none text-[#1C1008]"
                />
              </div>

              {/* Description subtitle */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                  Subtitle / Video Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Master weaving session on traditional wooden jacquard loom."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="bg-[#FDF8F2] border border-[#B8860B]/25 rounded px-3.5 py-2 text-sm focus:border-[#7A1C2E] focus:outline-none resize-none text-[#1C1008]"
                />
              </div>

              {/* Video parameters */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#1C1008] uppercase tracking-wider">
                  Cinematic Video File (.mp4 or .mov recommended)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* File upload */}
                  <div className="border border-dashed border-[#B8860B]/30 p-4 rounded bg-[#FDF8F2] flex flex-col items-center justify-center gap-1 text-center">
                    <Film className="h-5 w-5 text-[#B8860B]" />
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Upload Local Video</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="text-[10px] text-gray-500 w-full"
                    />
                  </div>

                  {/* Fallback url input */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Or Direct Video URL</span>
                    <input
                      type="text"
                      placeholder="e.g. https://domain.com/video.mp4"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="bg-[#FDF8F2] border border-[#B8860B]/20 rounded text-xs p-2 focus:outline-none text-[#1C1008]"
                    />
                  </div>
                </div>

                {uploadProgress !== null && (
                  <div className="w-full bg-[#E8D5B0]/30 rounded-full h-2.5 mt-2 overflow-hidden border border-[#B8860B]/10">
                    <div 
                      className="bg-[#7A1C2E] h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                    <div className="text-right text-[10px] text-[#7A1C2E] font-bold mt-1">
                      Uploading: {uploadProgress}%
                    </div>
                  </div>
                )}

                {videoPreview && (
                  <div className="mt-1 relative w-36 aspect-[16/9] border border-[#B8860B]/10 rounded overflow-hidden shadow-sm bg-black flex items-center justify-center">
                    <video src={videoPreview} className="w-full h-full object-cover" controls />
                  </div>
                )}
              </div>

              {/* Status active background */}
              <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-gray-700 text-xs mt-1">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-[#7A1C2E] focus:ring-[#7A1C2E] h-4 w-4 text-xs"
                />
                Mark as Hero Loop Video (makes it active background stream)
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
                      Preserving Video...
                    </>
                  ) : (
                    'Activate Cinematic Video'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Local playback modal */}
      {playingVideoUrl && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="relative max-w-2xl w-full bg-[#1C1008] border border-[#B8860B]/35 rounded-lg overflow-hidden flex flex-col">
            <div className="p-3 bg-[#1C1008] border-b border-[#B8860B]/25 flex justify-between items-center">
              <span className="font-serif text-xs font-bold text-[#E8D5B0] uppercase tracking-wider">
                Studio Player / Preview Reel
              </span>
              <button 
                onClick={() => setPlayingVideoUrl(null)} 
                className="text-gray-400 hover:text-white bg-white/5 rounded-full p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <video src={playingVideoUrl} controls autoPlay className="w-full h-full object-contain" />
            </div>
            <div className="p-3 bg-[#1C1008] text-right">
              <button 
                onClick={() => setPlayingVideoUrl(null)}
                className="bg-[#7A1C2E] text-white px-4 py-1.5 rounded uppercase text-[10px] tracking-wider font-extrabold"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { GalleryPhoto, GalleryVideo, SevaCategory } from '../types';
import { TRUST_INFO } from '../data/defaultData';
import { 
  Image as ImageIcon, 
  Video, 
  Play, 
  X, 
  ExternalLink, 
  Youtube, 
  Instagram, 
  Facebook
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface GallerySectionProps {
  language?: Language;
  photos: GalleryPhoto[];
  videos: GalleryVideo[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ photos, videos }) => {
  const t = TRANSLATIONS['hi'];
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [selectedCategory, setSelectedCategory] = useState<SevaCategory>('all');
  
  // Modals
  const [previewPhoto, setPreviewPhoto] = useState<GalleryPhoto | null>(null);
  const [previewVideo, setPreviewVideo] = useState<GalleryVideo | null>(null);

  const categories: { id: SevaCategory; label: string }[] = [
    { id: 'all', label: 'समस्त सेवा' },
    { id: 'ashram', label: 'आश्रम व मंदिर निर्माण' },
    { id: 'chaiseva', label: 'नित्य चाय सेवा' },
    { id: 'annadan', label: 'अन्नदान व भंडारा' },
    { id: 'gauseva', label: 'गौसेवा व गौशाला' },
    { id: 'narmada', label: 'नर्मदा परिक्रमा सेवा' }
  ];

  const filteredPhotos = photos.filter(p => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory || p.category === 'all';
  });

  const filteredVideos = videos.filter(v => {
    if (selectedCategory === 'all') return true;
    return v.category === selectedCategory || v.category === 'all';
  });

  return (
    <section id="gallery" className="py-16 md:py-24 bg-[#FAF7F2] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-300">
            {t.galleryTag}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0f4d3a] mt-3">
            {t.galleryTitle}
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
          <p className="text-stone-600 mt-4 text-base sm:text-lg">
            ग्राम गलगाँव में संचालित गौसेवा, नर्मदा परिक्रमा पथिक सेवा एवं शनिवार भंडारे के पावन क्षण।
          </p>
        </div>

        {/* Media Type & Category Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-stone-200">
          
          {/* Photos vs Videos Toggle */}
          <div className="inline-flex p-1 bg-white rounded-2xl border border-stone-300 shadow-xs">
            <button
              onClick={() => setActiveTab('photos')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'photos'
                  ? 'bg-[#0f4d3a] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>{t.galleryPhotosTab}</span>
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'videos'
                  ? 'bg-[#0f4d3a] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>{t.galleryVideosTab}</span>
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-amber-500 text-stone-900 font-bold shadow-xs'
                    : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

        </div>

        {/* Photos Grid */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <div 
                key={photo.id}
                onClick={() => setPreviewPhoto(photo)}
                className="group bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all border border-stone-200 hover:border-amber-400 cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-4/3 overflow-hidden bg-stone-100 relative">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-bold bg-[#0f4d3a]/80 px-3 py-1 rounded-full backdrop-blur-xs">
                      बड़ा देखें
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-base text-stone-900 group-hover:text-[#0f4d3a] transition-colors line-clamp-1">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                      {photo.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                    <span>{photo.date}</span>
                    <span className="text-emerald-700 font-semibold">गलगाँव सेवा</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Videos Grid */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div 
                key={video.id}
                onClick={() => setPreviewVideo(video)}
                className="group bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all border border-stone-200 hover:border-amber-400 cursor-pointer flex flex-col justify-between"
              >
                <div className="aspect-video overflow-hidden bg-stone-900 relative">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/shri_ram_kodanda.jpg';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600 group-hover:bg-red-700 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-sm text-stone-900 line-clamp-2 group-hover:text-[#0f4d3a] transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                    <span>{video.date}</span>
                    <span className="text-red-600 font-semibold flex items-center gap-1">
                      <Youtube className="w-3.5 h-3.5" />
                      YouTube
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Social Channels Callout Banner */}
        <div className="mt-14 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-heading text-lg font-bold text-[#0f4d3a]">
              हमारे सोशल मीडिया चैनलों पर लाइव सेवा दर्शन करें
            </h3>
            <p className="text-xs sm:text-sm text-stone-500">
              यूट्यूब, फेसबुक एवं इंस्टाग्राम पर गौसेवा एवं शनिवार भंडारे के नित्य वीडियो देखें।
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={TRUST_INFO.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Youtube className="w-4 h-4" />
              <span>YouTube (@ramjitrust)</span>
            </a>

            <a
              href={TRUST_INFO.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Facebook className="w-4 h-4" />
              <span>Facebook</span>
            </a>

            <a
              href={TRUST_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-95 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram (@prabhushriramtrust)</span>
            </a>
          </div>
        </div>

      </div>

      {/* Photo Lightbox Modal */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 text-stone-700 hover:text-black bg-white/80 hover:bg-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-16/10 bg-black flex items-center justify-center">
              <img
                src={previewPhoto.imageUrl}
                alt={previewPhoto.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/shri_ram_kodanda.jpg';
                }}
              />
            </div>

            <div className="p-6">
              <span className="text-xs text-amber-700 font-semibold">{previewPhoto.date}</span>
              <h3 className="font-heading text-xl font-bold text-[#0f4d3a] mt-0.5">
                {previewPhoto.title}
              </h3>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                {previewPhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-stone-900 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setPreviewVideo(null)}
              className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white bg-black/50 hover:bg-black rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${previewVideo.youtubeId}?autoplay=1`}
                title={previewVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-6 text-white bg-stone-900">
              <h3 className="font-heading text-lg font-bold text-amber-300">
                {previewVideo.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 mt-2">
                {previewVideo.description}
              </p>
              <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                <span>दिनांक: {previewVideo.date}</span>
                <a
                  href={TRUST_INFO.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  यूट्यूब पर अधिक वीडियो देखें <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

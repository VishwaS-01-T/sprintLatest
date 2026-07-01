import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Upload } from 'lucide-react';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Admin usually points here
});

export const LandingPageSettings = () => {
  const [settings, setSettings] = useState({
    heroBackground: '',
    heroShoe: '',
    video1: '',
    video2: '',
    video3: '',
    video4: '',
    mensCollectionImage: '',
    womensCollectionImage: '',
    newArrivalsBgImage: '',
    newArrivalsShoeImage: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/settings/landing-page')
      .then(res => setSettings(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/settings/landing-page', settings);
      alert('Landing page settings saved successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/settings/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSettings(prev => ({ ...prev, [field]: res.data.url }));
    } catch (error) {
      console.error(error);
      alert('Failed to upload file');
    }
  };

  const getPreviewUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/')) return `http://localhost:5174${url}`;
    return url;
  };

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Landing Page Images</h1>
        <p className="text-slate-500 text-sm mt-1">Manage the images displayed on the customer landing page.</p>
      </div>

      {loading ? (
        <div>Loading settings...</div>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hero Background Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={settings.heroBackground}
                onChange={e => setSettings({ ...settings, heroBackground: e.target.value })}
                placeholder="https://..."
              />
              <label className="flex items-center justify-center px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                Upload
                <input type="file" className="hidden" accept="image/*" onChange={e => handleUpload(e, 'heroBackground')} />
              </label>
            </div>
            {settings.heroBackground && (
              <div className="mt-3 relative h-32 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                <img 
                  src={getPreviewUrl(settings.heroBackground)} 
                  alt="Hero Background Preview" 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hero Shoe Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={settings.heroShoe}
                onChange={e => setSettings({ ...settings, heroShoe: e.target.value })}
                placeholder="/assets/shoes/shoe-10.png or https://..."
              />
              <label className="flex items-center justify-center px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                Upload
                <input type="file" className="hidden" accept="image/*" onChange={e => handleUpload(e, 'heroShoe')} />
              </label>
            </div>
            {settings.heroShoe && (
              <div className="mt-3 relative h-32 w-32 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 p-2">
                <img 
                  src={getPreviewUrl(settings.heroShoe)} 
                  alt="Hero Shoe Preview" 
                  className="w-full h-full object-contain" 
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Men's Collection Image URL</label>
              <div className="flex gap-2">
                <input type="text" className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" value={settings.mensCollectionImage || ''} onChange={e => setSettings({ ...settings, mensCollectionImage: e.target.value })} placeholder="/assets/shoes/shoe-10.png" />
                <label className="flex items-center justify-center px-3 bg-slate-100 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"><Upload className="w-4 h-4" /><input type="file" className="hidden" accept="image/*" onChange={e => handleUpload(e, 'mensCollectionImage')} /></label>
              </div>
              {settings.mensCollectionImage && (
                <div className="mt-3 relative h-32 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-50 p-2">
                  <img src={getPreviewUrl(settings.mensCollectionImage)} alt="Preview" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Women's Collection Image URL</label>
              <div className="flex gap-2">
                <input type="text" className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" value={settings.womensCollectionImage || ''} onChange={e => setSettings({ ...settings, womensCollectionImage: e.target.value })} placeholder="/assets/shoes/shoe-12.avif" />
                <label className="flex items-center justify-center px-3 bg-slate-100 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"><Upload className="w-4 h-4" /><input type="file" className="hidden" accept="image/*" onChange={e => handleUpload(e, 'womensCollectionImage')} /></label>
              </div>
              {settings.womensCollectionImage && (
                <div className="mt-3 relative h-32 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-50 p-2">
                  <img src={getPreviewUrl(settings.womensCollectionImage)} alt="Preview" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">New Arrivals Background URL</label>
              <div className="flex gap-2">
                <input type="text" className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" value={settings.newArrivalsBgImage || ''} onChange={e => setSettings({ ...settings, newArrivalsBgImage: e.target.value })} placeholder="https://..." />
                <label className="flex items-center justify-center px-3 bg-slate-100 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"><Upload className="w-4 h-4" /><input type="file" className="hidden" accept="image/*" onChange={e => handleUpload(e, 'newArrivalsBgImage')} /></label>
              </div>
              {settings.newArrivalsBgImage && (
                <div className="mt-3 relative h-32 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-50 p-2">
                  <img src={getPreviewUrl(settings.newArrivalsBgImage)} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">New Arrivals Shoe URL</label>
              <div className="flex gap-2">
                <input type="text" className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" value={settings.newArrivalsShoeImage || ''} onChange={e => setSettings({ ...settings, newArrivalsShoeImage: e.target.value })} placeholder="https://..." />
                <label className="flex items-center justify-center px-3 bg-slate-100 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"><Upload className="w-4 h-4" /><input type="file" className="hidden" accept="image/*" onChange={e => handleUpload(e, 'newArrivalsShoeImage')} /></label>
              </div>
              {settings.newArrivalsShoeImage && (
                <div className="mt-3 relative h-32 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-50 p-2">
                  <img src={getPreviewUrl(settings.newArrivalsShoeImage)} alt="Preview" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Carousel Video 1 URL</label>
              <div className="flex gap-2">
                <input type="text" className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" value={settings.video1 || ''} onChange={e => setSettings({ ...settings, video1: e.target.value })} placeholder="/assets/Videos/highlightFirstVideo.mp4" />
                <label className="flex items-center justify-center px-3 bg-slate-100 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"><Upload className="w-4 h-4" /><input type="file" className="hidden" accept="video/*" onChange={e => handleUpload(e, 'video1')} /></label>
              </div>
              {settings.video1 && (
                <div className="mt-3 relative h-32 w-full rounded-lg overflow-hidden border border-slate-200 bg-black">
                  <video src={getPreviewUrl(settings.video1)} controls className="w-full h-full object-contain" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Carousel Video 2 URL</label>
              <div className="flex gap-2">
                <input type="text" className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" value={settings.video2 || ''} onChange={e => setSettings({ ...settings, video2: e.target.value })} placeholder="/assets/Videos/highlightSecondVideo.mp4" />
                <label className="flex items-center justify-center px-3 bg-slate-100 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"><Upload className="w-4 h-4" /><input type="file" className="hidden" accept="video/*" onChange={e => handleUpload(e, 'video2')} /></label>
              </div>
              {settings.video2 && (
                <div className="mt-3 relative h-32 w-full rounded-lg overflow-hidden border border-slate-200 bg-black">
                  <video src={getPreviewUrl(settings.video2)} controls className="w-full h-full object-contain" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Carousel Video 3 URL</label>
              <div className="flex gap-2">
                <input type="text" className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" value={settings.video3 || ''} onChange={e => setSettings({ ...settings, video3: e.target.value })} placeholder="/assets/Videos/highlightThirdVideo.mp4" />
                <label className="flex items-center justify-center px-3 bg-slate-100 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"><Upload className="w-4 h-4" /><input type="file" className="hidden" accept="video/*" onChange={e => handleUpload(e, 'video3')} /></label>
              </div>
              {settings.video3 && (
                <div className="mt-3 relative h-32 w-full rounded-lg overflow-hidden border border-slate-200 bg-black">
                  <video src={getPreviewUrl(settings.video3)} controls className="w-full h-full object-contain" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Carousel Video 4 URL</label>
              <div className="flex gap-2">
                <input type="text" className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" value={settings.video4 || ''} onChange={e => setSettings({ ...settings, video4: e.target.value })} placeholder="/assets/Videos/highlightFourthVideo.mp4" />
                <label className="flex items-center justify-center px-3 bg-slate-100 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-200 transition-colors"><Upload className="w-4 h-4" /><input type="file" className="hidden" accept="video/*" onChange={e => handleUpload(e, 'video4')} /></label>
              </div>
              {settings.video4 && (
                <div className="mt-3 relative h-32 w-full rounded-lg overflow-hidden border border-slate-200 bg-black">
                  <video src={getPreviewUrl(settings.video4)} controls className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-70 font-medium"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useRouter } from '../hooks/useRouter.jsx';
import useAuthStore from '../store/authStore';
import ProfileCard from '../components/ProfileCard';
import { userAuth } from '../lib/api';
import showToast from '../utils/toast';
import {
  User,
  Phone,
  Mail,
  Edit3,
  ShoppingBag,
  MapPin,
  Heart,
  ArrowLeft,
  Check,
  Loader2,
} from 'lucide-react';

/**
 * MyProfile — Protected profile page.
 * Fetches up-to-date user data from GET /api/user/auth/me on mount.
 * Allows editing firstName, lastName via PUT /api/user/auth/me.
 */
const MyProfile = () => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const accessToken = useAuthStore((s) => s.accessToken);
  const storeUser = useAuthStore((s) => s.user);
  const userPhone = useAuthStore((s) => s.userPhone);
  const userName = useAuthStore((s) => s.userName);
  const setUser = useAuthStore((s) => s.setUser);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const { navigate } = useRouter();

  const [profileLoading, setProfileLoading] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Editable fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) navigate('/');
  }, [isLoggedIn, navigate]);

  // Fetch latest profile from backend
  useEffect(() => {
    if (!isLoggedIn || !accessToken) return;
    setProfileLoading(true);
    userAuth
      .getMe(accessToken)
      .then((res) => {
        const u = res.data?.user ?? res.data ?? res;
        setUser(u);
        setFirstName(u.firstName || '');
        setLastName(u.lastName || '');
      })
      .catch((err) => {
        // Fallback to store data
        setFirstName(storeUser?.firstName || '');
        setLastName(storeUser?.lastName || '');
        showToast.error(err.message || 'Failed to load profile');
      })
      .finally(() => setProfileLoading(false));
  }, [isLoggedIn, accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync from store when editing starts
  const startEdit = () => {
    setFirstName(storeUser?.firstName || '');
    setLastName(storeUser?.lastName || '');
    setSaveError('');
    setEditingPersonal(true);
  };

  const cancelEdit = () => {
    setFirstName(storeUser?.firstName || '');
    setLastName(storeUser?.lastName || '');
    setSaveError('');
    setEditingPersonal(false);
  };

  const handleSavePersonal = async () => {
    setSaveLoading(true);
    setSaveError('');
    try {
      const payload = {};
      if (firstName.trim().length >= 2) payload.firstName = firstName.trim();
      if (lastName.trim().length >= 2) payload.lastName = lastName.trim();
      const res = await userAuth.updateMe(payload, accessToken);
      const updated = res.data?.user ?? res.data ?? res;
      setUser(updated);
      updateProfile({ firstName: updated.firstName, lastName: updated.lastName });
      setEditingPersonal(false);
      showToast.success('Profile updated successfully!');
    } catch (err) {
      const errorMsg = err.message || 'Failed to save. Please try again.';
      setSaveError(errorMsg);
      showToast.error(errorMsg);
    } finally {
      setSaveLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  const displayName = userName || (storeUser ? `${storeUser.firstName || ''} ${storeUser.lastName || ''}`.trim() : '') || 'Sprint Shoes User';
  const displayEmail = storeUser?.email || '';
  const displayPhone = userPhone || storeUser?.phoneNumber?.replace(/^\+91/, '') || '';
  const nameInitial = displayName[0]?.toUpperCase() || displayPhone[0] || '?';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-700" />
          </button>
          <h1 className="text-xl font-bold text-neutral-900">My Account</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* ---- Profile Header ---- */}
        <div className="flex items-center gap-5 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center text-2xl font-bold text-white shrink-0">
            {profileLoading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : nameInitial}
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">{displayName}</h2>
            {displayPhone && (
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5" />
                +91 {displayPhone}
              </p>
            )}
            {displayEmail && (
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                {displayEmail}
              </p>
            )}
          </div>
        </div>

        {/* ---- Personal Information ---- */}
        <ProfileCard title="Personal Information" icon={User}>
          {editingPersonal ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-black placeholder:text-gray-400 focus:outline-none focus:border-black transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={displayPhone ? `+91 ${displayPhone}` : '—'}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
                />
              </div>

              {saveError && (
                <p className="text-sm text-red-500">{saveError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSavePersonal}
                  disabled={saveLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition disabled:opacity-60"
                >
                  {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-6 py-2.5 border border-gray-300 text-sm font-semibold rounded-full hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">First Name</p>
                      <p className="text-sm font-medium text-neutral-900">
                        {storeUser?.firstName || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Name</p>
                      <p className="text-sm font-medium text-neutral-900">
                        {storeUser?.lastName || '—'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-neutral-900">{displayEmail || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mobile Number</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {displayPhone ? `+91 ${displayPhone}` : '—'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={startEdit}
                  className="p-2 hover:bg-gray-100 rounded-full transition shrink-0 ml-4"
                >
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          )}
        </ProfileCard>

        {/* ---- My Orders ---- */}
        <ProfileCard title="My Orders" icon={ShoppingBag}>
          <div className="flex flex-col items-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">No orders yet</p>
            <p className="text-xs text-gray-400 mb-4">
              When you place orders, they will appear here.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition"
            >
              Start Shopping
            </button>
          </div>
        </ProfileCard>

        {/* ---- Saved Addresses ---- */}
        <ProfileCard title="Saved Addresses" icon={MapPin}>
          <div className="flex flex-col items-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">No saved addresses</p>
            <p className="text-xs text-gray-400">
              Add addresses during checkout and they&apos;ll be saved here.
            </p>
          </div>
        </ProfileCard>

        {/* ---- Wishlist ---- */}
        <ProfileCard title="Wishlist" icon={Heart}>
          <div className="flex flex-col items-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">Your wishlist is empty</p>
            <p className="text-xs text-gray-400 mb-4">
              Save items you love to your wishlist.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition"
            >
              Browse Products
            </button>
          </div>
        </ProfileCard>
      </div>
    </div>
  );
};

export default MyProfile;

import React, { useEffect, useMemo, useState } from "react";
import { Check, Plus, X, Home, Briefcase, MapPin, Trash2 } from "lucide-react";
import { Link, useRouter } from "../hooks/useRouter.jsx";
import useAuthStore from "../store/authStore";
import { addressesApi } from "../lib/api/addressesApi";
import useCartStore from "../store/cartStore";
import { useToast } from "../hooks/useToast";

const EMPTY_FORM = {
  fullName: "",
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  addressType: "HOME",
  isDefaultShipping: false,
  isDefaultBilling: false,
};

const normalizeAddress = (address) => ({
  id: address.id,
  fullName: address.fullName || "",
  phoneNumber: (address.phoneNumber || "").replace(/^\+91/, ""),
  addressLine1: address.addressLine1 || "",
  addressLine2: address.addressLine2 || "",
  city: address.city || "",
  state: address.state || "",
  postalCode: address.postalCode || "",
  country: address.country || "India",
  addressType: address.addressType || "HOME",
  isDefaultShipping: Boolean(address.isDefaultShipping),
  isDefaultBilling: Boolean(address.isDefaultBilling),
});

const AddressFormModal = ({ onClose, onSave, initial }) => {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = "Required";
    if (!/^\d{10}$/.test(form.phoneNumber)) nextErrors.phoneNumber = "Enter valid 10-digit number";
    if (!form.addressLine1.trim()) nextErrors.addressLine1 = "Required";
    if (!form.city.trim()) nextErrors.city = "Required";
    if (!form.state.trim()) nextErrors.state = "Required";
    if (!/^\d{6}$/.test(form.postalCode)) nextErrors.postalCode = "Enter valid 6-digit pin code";
    return nextErrors;
  };

  const handleSave = () => {
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSave({
      ...form,
      phoneNumber: `+91${form.phoneNumber}`,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg sm:mx-4 rounded-t-3xl sm:rounded-2xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 sticky top-0 bg-white rounded-t-3xl sm:rounded-t-2xl">
          <h3 className="text-lg font-bold text-neutral-900">{initial ? "Edit Address" : "Add New Address"}</h3>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {[
            { key: "fullName", label: "Full Name", placeholder: "John Doe" },
            { key: "phoneNumber", label: "Phone", placeholder: "10-digit number" },
            { key: "postalCode", label: "Pin Code", placeholder: "6-digit pin code" },
            { key: "city", label: "City", placeholder: "Mumbai" },
            { key: "state", label: "State", placeholder: "Maharashtra" },
            { key: "addressLine1", label: "Address Line 1", placeholder: "House / Street / Area" },
            { key: "addressLine2", label: "Address Line 2", placeholder: "Landmark (optional)" },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">{field.label}</label>
              <input
                value={form[field.key]}
                onChange={(e) => update(field.key, e.target.value)}
                className={`w-full px-3.5 py-3 text-sm border rounded-xl ${errors[field.key] ? "border-rose-400" : "border-neutral-200"}`}
                placeholder={field.placeholder}
              />
              {errors[field.key] && <p className="text-xs text-rose-500 mt-1">{errors[field.key]}</p>}
            </div>
          ))}

          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-2 block">Address Type</label>
            <div className="flex gap-3">
              {["HOME", "WORK", "OTHER"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => update("addressType", type)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 ${
                    form.addressType === type
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-white text-neutral-600 border-neutral-200"
                  }`}
                >
                  {type === "HOME" && <Home className="w-3.5 h-3.5" />}
                  {type === "WORK" && <Briefcase className="w-3.5 h-3.5" />}
                  {type === "OTHER" && <MapPin className="w-3.5 h-3.5" />}
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <button onClick={handleSave} className="w-full py-4 bg-neutral-900 text-white font-bold rounded-2xl">
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
};

const AddressPage = () => {
  const { navigate } = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const { success: showSuccess, error: showError, info: showInfo } = useToast();

  const cartSummary = useCartStore((s) => s.getCartSummary());

  const selectedAddress = useMemo(
    () => addresses.find((address) => address.id === selectedId) || null,
    [addresses, selectedId],
  );

  useEffect(() => {
    if (!isLoggedIn) {
      showInfo("Please login to continue checkout.");
      navigate("/cart");
      return;
    }

    let active = true;
    addressesApi
      .list()
      .then((res) => {
        if (!active) return;
        const list = (res.data?.addresses || []).map(normalizeAddress);
        setAddresses(list);
        const preferred = list.find((item) => item.isDefaultShipping) || list[0] || null;
        setSelectedId(preferred?.id || null);
      })
      .catch((err) => {
        if (active) {
          showError(err.message || "Failed to load addresses");
          setAddresses([]);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isLoggedIn, navigate, showError, showInfo]);

  const handleSave = async (payload) => {
    try {
      if (editingAddress?.id) {
        const res = await addressesApi.update(editingAddress.id, payload);
        const updated = normalizeAddress(res.data?.address || {});
        setAddresses((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        showSuccess("Address updated");
      } else {
        const res = await addressesApi.create(payload);
        const created = normalizeAddress(res.data?.address || {});
        setAddresses((prev) => [created, ...prev]);
        setSelectedId(created.id);
        showSuccess("Address added");
      }
      setShowForm(false);
      setEditingAddress(null);
    } catch (err) {
      showError(err.message || "Unable to save address");
    }
  };

  const handleDelete = async (addressId) => {
    try {
      await addressesApi.remove(addressId);
      setAddresses((prev) => prev.filter((address) => address.id !== addressId));
      if (selectedId === addressId) setSelectedId(null);
      showSuccess("Address removed");
    } catch (err) {
      showError(err.message || "Unable to remove address");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">Choose Address</h1>
          <p className="text-sm text-neutral-500 mt-1">Select a delivery address for this order.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => {
                setEditingAddress(null);
                setShowForm(true);
              }}
              className="w-full flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-neutral-300 bg-white"
            >
              <div className="w-10 h-10 rounded-full border-2 border-neutral-300 flex items-center justify-center">
                <Plus className="w-5 h-5 text-neutral-500" />
              </div>
              <span className="font-bold text-neutral-700">Add New Address</span>
            </button>

            {loading && <div className="rounded-xl bg-white p-5 text-sm text-neutral-500">Loading addresses...</div>}

            {!loading && addresses.length === 0 && (
              <div className="rounded-xl bg-white p-5 text-sm text-neutral-500">No saved addresses yet.</div>
            )}

            {addresses.map((address) => {
              const selected = selectedId === address.id;
              return (
                <div
                  key={address.id}
                  className={`relative p-5 rounded-2xl border-2 cursor-pointer ${selected ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white"}`}
                  onClick={() => setSelectedId(address.id)}
                >
                  <div className={`absolute top-5 right-5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? "border-neutral-900 bg-neutral-900" : "border-neutral-300"}`}>
                    {selected && <Check className="w-3 h-3 text-white" />}
                  </div>

                  <p className="font-bold text-neutral-900 text-sm">{address.fullName}</p>
                  <p className="text-sm text-neutral-600 mt-0.5">{address.addressLine1}</p>
                  {address.addressLine2 && <p className="text-sm text-neutral-500">{address.addressLine2}</p>}
                  <p className="text-sm text-neutral-600">
                    {address.city}, {address.state} - {address.postalCode}
                  </p>
                  <p className="text-sm text-neutral-500 mt-0.5">+91 {address.phoneNumber}</p>

                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-neutral-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAddress(address);
                        setShowForm(true);
                      }}
                      className="text-xs font-semibold text-neutral-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(address.id);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-neutral-200 p-5">
              <h2 className="font-bold text-neutral-900 mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="font-medium">Rs {cartSummary.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Shipping</span>
                  <span className="font-medium">Rs {cartSummary.shipping.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-100">
                  <span className="font-bold text-neutral-900">Total</span>
                  <span className="font-bold">Rs {cartSummary.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!selectedAddress) return;
                navigate("/checkout", {
                  shippingAddressId: selectedAddress.id,
                  billingAddressId: selectedAddress.id,
                });
              }}
              disabled={!selectedId}
              className="w-full py-4 bg-neutral-900 text-white font-bold rounded-2xl disabled:bg-neutral-300 disabled:cursor-not-allowed"
            >
              Deliver Here
            </button>

            <Link href="/cart" className="flex items-center justify-center gap-2 text-sm font-medium text-neutral-500">
              Back to Bag
            </Link>
          </div>
        </div>
      </div>

      {showForm && (
        <AddressFormModal
          initial={editingAddress}
          onClose={() => {
            setShowForm(false);
            setEditingAddress(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AddressPage;

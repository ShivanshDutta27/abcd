"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function CreateEventPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user || user.role !== "vendor") {
      alert("Access denied. Vendors only.");
      router.push("/");
      return;
    }
    setLoading(false);
  }, [router]);

  const handleAddService = async () => {
    setActionError(null);
    setActionSuccess(null);

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      setActionError("User not found. Please login again.");
      return;
    }

    if (!name || !category || !location || !price) {
      setActionError("Name, Category, Location, and Price are required.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          category,
          location,
          price: Number(price) || 0,
          description,
          owner: user._id
        })
      });

      if (res.ok) {
        setActionSuccess("Event listed successfully! Redirecting...");
        setName("");
        setCategory("");
        setLocation("");
        setPrice("");
        setDescription("");
        
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        const data = await res.json();
        setActionError(data.error || "Failed to add event.");
      }
    } catch (err) {
      console.error(err);
      setActionError("Server error. Could not add event.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf7f1] text-[#242424] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-12 text-[#6b6258] animate-pulse uppercase tracking-wider font-semibold text-xs">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f1] text-[#242424] flex flex-col">
      <Navbar />

      <div className="flex-1 flex justify-center py-12 px-8">
        <div className="w-full max-w-2xl space-y-8 animate-fade-in-up">
          {/* Back button */}
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#6b6258] hover:text-[#242424] text-xs uppercase tracking-wider transition font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-[#6b6258]/80">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Dashboard
          </Link>

          <div className="bg-white border border-[#e8dfd2] p-10 rounded-none shadow-none space-y-6">
            <div className="text-center mb-8 border-b border-[#e8dfd2]/60 pb-6">
              <h1 className="text-2xl md:text-3xl font-serif font-semibold text-[#242424] uppercase tracking-wider">
                List New <span className="text-gradient italic font-normal text-gradient-glow font-serif">Event</span>
              </h1>
              <p className="text-[#6b6258] text-xs mt-2 uppercase tracking-wider">Fill in the details to publish your offering on the marketplace.</p>
            </div>

            {actionError && (
              <div className="bg-[#faf7f1] border border-[#e8dfd2] text-rose-700 text-xs p-3.5 rounded-none">
                {actionError}
              </div>
            )}

            {actionSuccess && (
              <div className="bg-[#faf7f1] border border-[#e8dfd2] text-emerald-700 text-xs p-3.5 rounded-none">
                {actionSuccess}
              </div>
            )}

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[9px] font-semibold text-[#6b6258] uppercase tracking-widest mb-1.5">Event Title</label>
                  <input
                    placeholder="e.g. Elegant Floral Setup"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="glass-input w-full px-4 py-3 rounded-none text-xs placeholder-[#6b6258]/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-semibold text-[#6b6258] uppercase tracking-widest mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="glass-input w-full px-4 py-3 rounded-none text-xs text-[#242424] bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    <option value="wedding">Wedding</option>
                    <option value="decor">Decorations</option>
                    <option value="caterer">Caterer</option>
                    <option value="venue">Venue</option>
                    <option value="dj">DJ / Entertainment</option>
                    <option value="photography">Photography</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="birthday">Birthday Party</option>
                    <option value="engagement">Engagement</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="party">Private Party</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[9px] font-semibold text-[#6b6258] uppercase tracking-widest mb-1.5">Location</label>
                  <input
                    placeholder="e.g. Mumbai"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="glass-input w-full px-4 py-3 rounded-none text-xs placeholder-[#6b6258]/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-semibold text-[#6b6258] uppercase tracking-widest mb-1.5">Starting Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="glass-input w-full px-4 py-3 rounded-none text-xs placeholder-[#6b6258]/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-semibold text-[#6b6258] uppercase tracking-widest mb-1.5">Event Description</label>
                <textarea
                  placeholder="Describe your event setup, services included, and booking details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="glass-input w-full px-4 py-3 rounded-none text-xs placeholder-[#6b6258]/40 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleAddService}
                  className="w-full bg-[#242424] hover:bg-[#3a3a3a] text-white font-semibold py-4 rounded-none transition duration-200 text-xs uppercase tracking-wider active:scale-[0.98] btn-premium cursor-pointer"
                >
                  Publish Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

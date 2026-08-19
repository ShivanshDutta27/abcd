"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function VendorRequestPage() {
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileList = Array.from(files);
    const base64Promises = fileList.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    });

    Promise.all(base64Promises)
      .then(base64s => {
        setImages(prev => [...prev, ...base64s]);
      })
      .catch(err => {
        console.error("Error reading files:", err);
        setError("Error reading uploaded files. Please try again.");
      });
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      setError("Please login first to submit a vendor request.");
      return;
    }

    if (!businessName || !phone || !location || !description || images.length === 0) {
      setError("All fields are required. Please upload at least one image.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendor/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: user._id,
          businessName,
          phone,
          location,
          description,
          images
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Your vendor application has been successfully submitted! Redirecting...");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError(data.error || data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Could not submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf7f1] text-[#242424] flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-lg">
          <div className="bg-white border border-[#e8dfd2] p-10 rounded-none shadow-none">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-serif font-semibold text-[#242424] uppercase tracking-wider">
                Become a <span className="text-gradient italic font-normal text-gradient-glow font-serif">Vendor</span>
              </h1>
              <p className="text-[#6b6258] text-xs mt-2 uppercase tracking-wider">
                Grow your business by offering your services on ServEase.
              </p>
            </div>

            {error && (
              <div className="bg-[#faf7f1] border border-[#e8dfd2] text-rose-700 text-xs p-3.5 rounded-none mb-5 flex items-start gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 7.5h.008v.008H12v-.008Z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-[#faf7f1] border border-[#e8dfd2] text-emerald-750 text-emerald-700 text-xs p-3.5 rounded-none mb-5 flex items-start gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-[#6b6258] uppercase tracking-widest mb-2">Business Name</label>
                <input
                  placeholder="e.g., Sparkle Cleaning Services"
                  className="glass-input w-full px-4 py-3 rounded-none text-xs uppercase tracking-wider placeholder-[#6b6258]/40 focus:outline-none"
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-[#6b6258] uppercase tracking-widest mb-2">Phone Number</label>
                  <input
                    placeholder="e.g., +91 9876543210"
                    className="glass-input w-full px-4 py-3 rounded-none text-xs uppercase tracking-wider placeholder-[#6b6258]/40 focus:outline-none"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#6b6258] uppercase tracking-widest mb-2">Location / City</label>
                  <input
                    placeholder="e.g., Delhi"
                    className="glass-input w-full px-4 py-3 rounded-none text-xs uppercase tracking-wider placeholder-[#6b6258]/40 focus:outline-none"
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#6b6258] uppercase tracking-widest mb-2">Business Description</label>
                <textarea
                  placeholder="Tell us about the services you offer..."
                  rows={3}
                  className="glass-input w-full px-4 py-3 rounded-none text-xs uppercase tracking-wider placeholder-[#6b6258]/40 focus:outline-none resize-none"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#6b6258] uppercase tracking-widest mb-2">Upload Business Images</label>
                <div className="relative border border-dashed border-[#e8dfd2] p-6 text-center hover:border-[#c99a24] transition duration-200 bg-[#faf7f1]/50 cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#6b6258] mx-auto mb-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.008-.008a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    <p className="text-xs font-semibold text-[#242424] uppercase tracking-wider">Select Files from Device</p>
                    <p className="text-[10px] text-[#6b6258] font-medium">JPEG, PNG up to 10MB (supports multiple photos)</p>
                  </div>
                </div>
                
                {/* Preview of uploaded images */}
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {images.map((img, index) => (
                      <div key={index} className="relative aspect-square border border-[#e8dfd2] bg-stone-50 overflow-hidden">
                        <img src={img} alt={`uploaded preview ${index}`} className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => setImages(prev => prev.filter((_, idx) => idx !== index))}
                          className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold p-1 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer hover:bg-red-500"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#242424] hover:bg-[#3a3a3a] text-white font-semibold py-4 rounded-none mt-6 transition duration-200 text-xs uppercase tracking-wider active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {loading ? "Submitting Application..." : "Submit Application"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
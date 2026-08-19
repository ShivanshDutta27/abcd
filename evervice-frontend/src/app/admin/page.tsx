"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../app/components/Navbar";
import Link from "next/link";

export default function AdminDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    if (!user || user.role !== "admin") {
      alert("Access denied. Admin portal only.");
      router.push("/");
      return;
    }

    setLoading(true);

    const loadData = async () => {
      try {
        // Vendor Requests
        const resRequests = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendor/requests`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataRequests = await resRequests.json();
        setRequests(Array.isArray(dataRequests) ? dataRequests : []);

        // Bookings
        const resBookings = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataBookings = await resBookings.json();
        setBookings(Array.isArray(dataBookings) ? dataBookings : []);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch admin data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleApprove = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendor/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ requestId: id })
      });
      if (res.ok) {
        setRequests(prev => prev.filter(r => r._id !== id));
      } else {
        alert("Failed to approve request");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendor/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ requestId: id })
      });
      if (res.ok) {
        setRequests(prev => prev.filter(r => r._id !== id));
      } else {
        alert("Failed to reject request");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf7f1] text-[#242424] flex flex-col">
      <Navbar />

      <div className="flex-1 flex justify-center py-12 px-8">
        <div className="w-full max-w-5xl space-y-12">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e8dfd2] pb-6">
            <div>
              <h1 className="text-3xl font-serif font-semibold text-[#242424] uppercase tracking-wider">
                Admin <span className="text-gradient italic font-normal text-gradient-glow font-serif">Dashboard</span>
              </h1>
              <p className="text-[#6b6258] text-xs mt-2 uppercase tracking-wider">Review vendor requests and manage platform bookings.</p>
            </div>
            <Link
              href="/"
              className="bg-[#242424] hover:bg-[#3a3a3a] text-white font-semibold text-xs tracking-wider uppercase px-5 py-3 rounded-none transition duration-200"
            >
              Back to Portal
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-[#6b6258] animate-pulse uppercase tracking-wider font-semibold text-xs">Loading portal data...</div>
          ) : error ? (
            <div className="bg-white border border-[#e8dfd2] text-rose-700 p-4 rounded-none text-center shadow-none">{error}</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              {/* Left Column: Vendor Requests */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-serif font-semibold text-[#242424] uppercase tracking-wider flex items-center gap-2">
                    <span>Pending Requests</span>
                    <span className="bg-[#efe7da] border border-[#e8dfd2] text-[#6b6258] text-[10px] tracking-wider font-bold px-3 py-1 rounded-none">
                      {requests.length}
                    </span>
                  </h2>
                </div>

                {requests.length === 0 ? (
                  <div className="bg-white border border-[#e8dfd2] p-8 rounded-none text-center text-[#6b6258] text-xs uppercase tracking-wider font-semibold">
                    No pending vendor applications.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((r) => {
                      const imgSource = r.images?.[0] || r.image;
                      return (
                        <div key={r._id} className="bg-white border border-[#e8dfd2] p-6 rounded-none shadow-none space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3 className="text-lg font-serif font-semibold text-[#242424]">{r.businessName}</h3>
                              <p className="text-[#6b6258] text-xs mt-1 font-medium">{r.userId?.email}</p>
                            </div>
                            {imgSource && (
                              <img
                                src={imgSource}
                                alt={r.businessName}
                                className="w-12 h-12 rounded-none object-cover border border-[#e8dfd2]"
                              />
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-[#e8dfd2]/60 py-3.5 text-[#6b6258]">
                            <p><strong>Phone:</strong> {r.phone}</p>
                            <p><strong>Location:</strong> {r.location}</p>
                          </div>

                          <p className="text-[#6b6258] text-xs leading-relaxed font-sans">{r.description}</p>

                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={() => handleApprove(r._id)}
                              className="flex-1 bg-[#242424] hover:bg-[#3a3a3a] text-white font-semibold py-3 rounded-none text-xs uppercase tracking-wider transition cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(r._id)}
                              className="flex-1 border border-[#e8dfd2] hover:bg-[#faf7f1] text-[#6b6258] font-semibold py-3 rounded-none text-xs uppercase tracking-wider transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Platform Bookings */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-serif font-semibold text-[#242424] uppercase tracking-wider flex items-center gap-2">
                    <span>Recent Bookings</span>
                    <span className="bg-[#efe7da] border border-[#e8dfd2] text-[#6b6258] text-[10px] tracking-wider font-bold px-3 py-1 rounded-none">
                      {bookings.length}
                    </span>
                  </h2>
                </div>

                {bookings.length === 0 ? (
                  <div className="bg-white border border-[#e8dfd2] p-8 rounded-none text-center text-[#6b6258] text-xs uppercase tracking-wider font-semibold">
                    No bookings have been made yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((b, i) => (
                      <div key={i} className="bg-white border border-[#e8dfd2] p-6 rounded-none shadow-none space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] uppercase tracking-widest font-semibold text-[#c99a24] bg-[#efe7da] px-2.5 py-1 rounded-none">
                              Booking #{i + 1}
                            </span>
                            <h3 className="text-base font-serif font-semibold text-[#242424] mt-2">{b.serviceId?.name || "Deleted Service"}</h3>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-[#6b6258] border-t border-[#e8dfd2]/60 pt-3">
                          <p><strong>Customer:</strong> {b.userId?.email || "Deleted User"}</p>
                          <p><strong>Vendor:</strong> {b.vendorId?.email || "Deleted Vendor"}</p>
                          <p><strong>Name:</strong> {b.name}</p>
                          <p><strong>Phone:</strong> {b.phone}</p>
                        </div>

                        {b.message && (
                          <div className="bg-[#faf7f1]/50 border border-[#e8dfd2]/65 p-3 rounded-none mt-2">
                            <p className="text-[#6b6258] text-[11px] leading-relaxed font-sans">{b.message}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
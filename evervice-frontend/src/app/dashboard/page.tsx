"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../app/components/Navbar";
import Link from "next/link";

export default function Dashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user || user.role !== "vendor") {
      alert("Access denied. Vendors only.");
      router.push("/");
      return;
    }

    setLoading(true);
    const loadData = async () => {
      try {
        // Fetch ONLY vendor services
        const resServices = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/vendor/${user._id}`);
        const dataServices = await resServices.json();
        setServices(Array.isArray(dataServices) ? dataServices : []);

        // Fetch ONLY vendor bookings
        const resBookings = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/vendor/${user._id}`);
        const dataBookings = await resBookings.json();
        setBookings(Array.isArray(dataBookings) ? dataBookings : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  // ❌ Delete service
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event listing?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setServices(services.filter(s => s._id !== id));
      } else {
        alert("Failed to delete service.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalValue = services.reduce((acc, s) => acc + (s.price || 0), 0);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf7f1] text-[#242424] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-12 text-[#6b6258] animate-pulse uppercase tracking-wider font-semibold text-xs">Loading workspace...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7f1] text-[#242424] flex flex-col">
      <Navbar />

      <div className="flex-1 flex justify-center py-12 px-8">
        <div className="w-full max-w-5xl space-y-10 animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e8dfd2] pb-6">
            <div>
              <h1 className="text-3xl font-serif font-semibold text-[#242424] uppercase tracking-wider">
                Vendor <span className="text-gradient italic font-normal text-gradient-glow font-serif">Workspace</span>
              </h1>
              <p className="text-[#6b6258] text-xs mt-2 uppercase tracking-wider">Manage your event listings and view client bookings.</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/create"
                className="bg-[#c99a24] hover:bg-[#b0841a] text-white font-semibold text-xs tracking-wider uppercase px-6 py-3.5 rounded-none transition duration-200 btn-premium"
              >
                + List New Event
              </Link>
              <Link
                href="/"
                className="border border-[#e8dfd2] hover:bg-stone-50 text-[#6b6258] hover:text-[#242424] font-semibold text-xs tracking-wider uppercase px-5 py-3.5 rounded-none transition duration-200"
              >
                Back to Portal
              </Link>
            </div>
          </div>

          {/* 📊 Metrics Dashboard cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-[#e8dfd2] p-6 rounded-none shadow-none space-y-2">
              <span className="text-[#6b6258] text-[10px] uppercase tracking-widest font-semibold block">Total Events Listed</span>
              <span className="text-3xl font-bold font-serif text-[#242424] block">{services.length}</span>
              <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider block">● Live on Marketplace</span>
            </div>

            <div className="bg-white border border-[#e8dfd2] p-6 rounded-none shadow-none space-y-2">
              <span className="text-[#6b6258] text-[10px] uppercase tracking-widest font-semibold block">Active Booking Requests</span>
              <span className="text-3xl font-bold font-serif text-[#c99a24] block">{bookings.length}</span>
              <span className="text-[10px] text-amber-600 font-semibold uppercase tracking-wider block">● Awaiting Response</span>
            </div>

            <div className="bg-white border border-[#e8dfd2] p-6 rounded-none shadow-none space-y-2">
              <span className="text-[#6b6258] text-[10px] uppercase tracking-widest font-semibold block">Portfolio Starting Value</span>
              <span className="text-3xl font-bold font-serif text-[#242424] block">₹{totalValue.toLocaleString()}</span>
              <span className="text-[10px] text-[#6b6258] font-medium uppercase tracking-wider block">Combined listing prices</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Services list */}
            <div className="lg:col-span-2 bg-white border border-[#e8dfd2] p-6 rounded-none shadow-none">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#e8dfd2]/60">
                <h2 className="text-lg font-serif font-semibold text-[#242424] uppercase tracking-wider">Your Listed Events</h2>
                <span className="text-[10px] uppercase font-bold text-[#6b6258] bg-[#efe7da] px-2.5 py-1">{services.length} Listings</span>
              </div>

              {services.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <p className="text-[#6b6258] text-xs italic font-medium">You haven't listed any events yet.</p>
                  <Link
                    href="/dashboard/create"
                    className="inline-block bg-[#242424] hover:bg-[#3a3a3a] text-white text-[10px] uppercase font-bold tracking-wider px-5 py-3 rounded-none transition duration-200"
                  >
                    Create Your First Event
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#e8dfd2]/60 space-y-4">
                  {services.map((s, i) => (
                    <div
                      key={s._id}
                      className={`flex justify-between items-center ${i > 0 ? "pt-4" : ""}`}
                    >
                      <div>
                        <span className="text-[9px] text-[#c99a24] font-semibold uppercase tracking-widest bg-[#efe7da] px-2 py-0.5 rounded-none">
                          {s.category}
                        </span>
                        <h4 className="text-sm font-serif font-semibold text-[#242424] mt-2">{s.name}</h4>
                        <p className="text-[11px] text-[#6b6258] mt-1 font-sans font-medium">₹{s.price} • {s.location}</p>
                      </div>

                      <button
                        onClick={() => handleDelete(s._id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-500 bg-white hover:bg-stone-50 border border-[#e8dfd2] rounded-none px-3.5 py-2 transition cursor-pointer uppercase tracking-wider text-[10px]"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Bookings list */}
            <div className="bg-white border border-[#e8dfd2] p-6 rounded-none shadow-none space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-[#e8dfd2]/60">
                <h2 className="text-lg font-serif font-semibold text-[#242424] uppercase tracking-wider">Booking Requests</h2>
                <span className="bg-[#efe7da] border border-[#e8dfd2] text-[#6b6258] text-[10px] tracking-wider font-bold px-3 py-1 rounded-none">
                  {bookings.length}
                </span>
              </div>

              {bookings.length === 0 ? (
                <p className="text-[#6b6258] text-xs italic font-medium py-4 text-center">No bookings requested yet.</p>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b, i) => (
                    <div key={i} className="bg-[#faf7f1]/50 border border-[#e8dfd2]/60 p-4 rounded-none shadow-none space-y-2.5">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest font-semibold text-[#c99a24] bg-[#efe7da] px-2 py-0.5 rounded-none">
                          {b.serviceId?.name || "Deleted Event"}
                        </span>
                        <h4 className="text-sm font-serif font-semibold text-[#242424] mt-2">{b.name}</h4>
                      </div>

                      <p className="text-[#6b6258] text-xs"><strong>Phone:</strong> {b.phone}</p>

                      {b.message && (
                        <div className="bg-white border border-[#e8dfd2]/60 p-2.5 rounded-none">
                          <p className="text-[#6b6258] text-[10px] leading-relaxed font-sans font-medium">{b.message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
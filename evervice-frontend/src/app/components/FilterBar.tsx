"use client";

type Props = {
  setFilters: any;
};

export default function FilterBar({ setFilters }: Props) {
  const handleSearch = () => {
    const el = document.getElementById("services-section");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full bg-white border border-[#e8dfd2] p-5 rounded-lg shadow-xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
      <div>
        <label className="block text-[9px] font-semibold text-[#6b6258] uppercase tracking-widest mb-1.5">
          Location
        </label>
        <input
          placeholder="e.g. Delhi"
          className="glass-input w-full px-4 py-3 rounded-md text-xs uppercase tracking-wider placeholder-[#6b6258]/40 focus:outline-none bg-white"
          onChange={(e) =>
            setFilters((prev: any) => ({
              ...prev,
              location: e.target.value.toLowerCase().trim()
            }))
          }
        />
      </div>

      <div>
        <label className="block text-[9px] font-semibold text-[#6b6258] uppercase tracking-widest mb-1.5">
          Category
        </label>
        <input
          placeholder="e.g. Wedding"
          className="glass-input w-full px-4 py-3 rounded-md text-xs uppercase tracking-wider placeholder-[#6b6258]/40 focus:outline-none bg-white"
          onChange={(e) =>
            setFilters((prev: any) => ({
              ...prev,
              category: e.target.value.toLowerCase().trim()
            }))
          }
        />
      </div>

      <div>
        <label className="block text-[9px] font-semibold text-[#6b6258] uppercase tracking-widest mb-1.5">
          Min Price
        </label>
        <input
          type="number"
          placeholder="Min (₹)"
          className="glass-input w-full px-4 py-3 rounded-md text-xs uppercase tracking-wider placeholder-[#6b6258]/40 focus:outline-none bg-white"
          onChange={(e) =>
            setFilters((prev: any) => ({
              ...prev,
              minPrice: Number(e.target.value) || ""
            }))
          }
        />
      </div>

      <div>
        <label className="block text-[9px] font-semibold text-[#6b6258] uppercase tracking-widest mb-1.5">
          Max Price
        </label>
        <input
          type="number"
          placeholder="Max (₹)"
          className="glass-input w-full px-4 py-3 rounded-md text-xs uppercase tracking-wider placeholder-[#6b6258]/40 focus:outline-none bg-white"
          onChange={(e) =>
            setFilters((prev: any) => ({
              ...prev,
              maxPrice: Number(e.target.value) || ""
            }))
          }
        />
      </div>

      <div>
        <button
          type="button"
          onClick={handleSearch}
          className="w-full bg-[#c99a24] hover:bg-[#b0841a] text-white font-semibold text-xs tracking-wider uppercase py-3.5 rounded-md btn-premium cursor-pointer shadow-xs shadow-[#c99a24]/10"
        >
          Search
        </button>
      </div>
    </div>
  );
}
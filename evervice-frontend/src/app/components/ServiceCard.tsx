import Link from "next/link";

const getCategoryImage = (category: string) => {
  const cat = (category || "").toLowerCase();
  if (cat.includes("wed") || cat.includes("marr") || cat.includes("brid")) {
    return "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"; // Luxury wedding
  }
  if (cat.includes("decor") || cat.includes("plan") || cat.includes("design")) {
    return "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80"; // Table decor candles
  }
  if (cat.includes("cater") || cat.includes("food") || cat.includes("cook")) {
    return "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80"; // Dining food
  }
  if (cat.includes("photo") || cat.includes("video") || cat.includes("shoot")) {
    return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80"; // Camera/Photography
  }
  if (cat.includes("clean") || cat.includes("maid") || cat.includes("house")) {
    return "https://images.unsplash.com/photo-1603712760398-5fd7143c62ef?auto=format&fit=crop&w=600&q=80"; // Luxury interior setup
  }
  if (cat.includes("dj") || cat.includes("music") || cat.includes("band") || cat.includes("entertain")) {
    return "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80"; // DJ deck/music
  }
  if (cat.includes("venue") || cat.includes("hall") || cat.includes("room")) {
    return "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=600&q=80"; // Grand ballroom
  }
  return "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80";
};

const getCategoryFeatures = (category: string) => {
  const cat = (category || "").toLowerCase();
  if (cat.includes("wed") || cat.includes("marr") || cat.includes("brid")) {
    return ["Dedicated Bridal Suite", "Premium Stage Decoration", "Guest Seating Up to 500"];
  }
  if (cat.includes("decor") || cat.includes("plan") || cat.includes("design")) {
    return ["Custom Floral Concepts", "Lighting & Table Setups", "On-site Design Team"];
  }
  if (cat.includes("cater") || cat.includes("food") || cat.includes("cook")) {
    return ["Multi-cuisine Buffet", "Custom Wedding Menus", "Professional Serving Staff"];
  }
  if (cat.includes("photo") || cat.includes("video") || cat.includes("shoot")) {
    return ["Candid & Traditional Coverage", "High-res Digital Gallery", "Professional Post-editing"];
  }
  if (cat.includes("clean") || cat.includes("maid") || cat.includes("house")) {
    return ["Eco-friendly Cleaning Agents", "Trained Uniformed Crew", "Deep Sanitization Service"];
  }
  if (cat.includes("dj") || cat.includes("music") || cat.includes("band") || cat.includes("entertain")) {
    return ["Premium Sound System", "Custom Tracks Playlist", "Interactive MC / Host"];
  }
  if (cat.includes("venue") || cat.includes("hall") || cat.includes("room")) {
    return ["Indoor Banquet Hall", "Valet Parking Available", "A/C & Power Backup"];
  }
  return ["Top-tier Verified Vendor", "Custom Requests Welcome", "Dedicated Coordinator"];
};

export default function ServiceCard({ service }: any) {
  const imageUrl = getCategoryImage(service.category);
  const features = getCategoryFeatures(service.category);

  return (
    <div className="group flex flex-col h-full bg-[#faf7f1] border border-[#e8dfd2] rounded-lg overflow-hidden shadow-xs hover:shadow-md hover:border-[#c99a24] hover:-translate-y-1.5 transition-all duration-300 ease-out">
      {/* 16:10 Image wrapper with rounded-t corners */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
        <img
          src={imageUrl}
          alt={service.name}
          className="object-cover w-full h-full group-hover:scale-[1.05] transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all duration-300"></div>
      </div>

      {/* Content wrapper with comfortable spacing */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-widest font-semibold text-[#c99a24]">
              {service.category}
            </span>
            <div className="flex items-center gap-1 text-[#6b6258] text-[10px] uppercase tracking-wider">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-3 h-3 text-[#6b6258]/70">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <span>{service.location}</span>
            </div>
          </div>

          <h3 className="text-[#242424] font-serif font-bold text-base md:text-lg tracking-tight group-hover:text-[#c99a24] transition-colors duration-200 line-clamp-1">
            {service.name}
          </h3>

          {/* Dynamic features checklist */}
          <ul className="space-y-1 pt-1">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-[#6b6258] text-[10px] uppercase tracking-wider font-semibold">
                <span className="text-[#c99a24] text-xs font-bold leading-none mt-0.5">•</span>
                <span className="line-clamp-1">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price and Details button */}
        <div className="border-t border-[#e8dfd2]/60 mt-5 pt-4 space-y-3.5">
          <div className="flex justify-between items-baseline">
            <span className="text-[#6b6258] text-[9px] uppercase tracking-wider">Starting from</span>
            <span className="text-base font-serif font-black text-[#c99a24]">
              ₹{service.price}
            </span>
          </div>

          <Link
            href={`/services/${service._id}`}
            className="block w-full text-center bg-[#242424] hover:bg-[#3a3a3a] text-white text-[10px] uppercase font-bold tracking-wider py-3 rounded-md btn-premium"
          >
            View Event
          </Link>
        </div>
      </div>
    </div>
  );
}
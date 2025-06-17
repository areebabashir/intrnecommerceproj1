import React from "react";

// Default placeholder image
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300x200?text=No+Image";

const Card = ({ imageSrc, altText, tags = [], title, oldPrice, price }) => {
  // Use placeholder if no valid imageSrc
  const validImageSrc =
    typeof imageSrc === "string" && imageSrc.startsWith("http")
      ? imageSrc
      : PLACEHOLDER_IMAGE;

  return (
    <div className="p-5 outline outline-1 outline-stone-200 flex-col justify-start items-start gap-6 relative max-w-[300px] min-h-[420px] overflow-hidden bg-white shadow-md rounded-lg">
      <div className="relative w-full h-80">
        <img
          className="w-full h-full object-cover rounded"
          src={validImageSrc}
          alt={altText || "Product"}
        />

        {/* Tags */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-2 max-w-[90%]">
          {tags.slice(0, 4).map(({ label, bgColorClass }, index) => (
            <div
              key={index}
              className={`h-8 px-4 py-1 inline-flex justify-center items-center gap-2.5 rounded ${bgColorClass}`}
            >
              <div className="text-stone-200 text-sm font-normal lowercase">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-start items-center gap-2 w-full">
        <div className="text-stone-800 text-xl font-semibold uppercase text-center w-full truncate">
          {title}
        </div>

        <div className="inline-flex justify-center items-center gap-2">
          {oldPrice && (
            <div className="text-stone-400 text-base font-normal line-through uppercase">
              ${oldPrice}
            </div>
          )}
          <div className="flex justify-start items-start gap-1.5">
            <div className="text-stone-800 text-3xl font-bold uppercase">
              ${price}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;

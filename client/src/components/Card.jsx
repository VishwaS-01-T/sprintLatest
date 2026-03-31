const toneToBg = {
  red: "text-[--color-red]",
  green: "text-[--color-green]",
  orange: "text-[--color-orange]",
};

export default function Card({
  title,
  description,
  subtitle,
  meta,
  imageSrc,
  imageAlt = title,
  price,
  href,
  badge,
  className = "",
}) {
  const displayPrice =
    price === undefined ? undefined : typeof price === "number" ? `₹${price.toFixed(2)}` : price;
  const content = (
    <article
      className={`group rounded-xl bg-light-100 ring-1 ring-light-300 transition-colors hover:ring-dark-500 ${className}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-light-200">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="mb-1 flex items-baseline justify-between gap-3">
          <h3 className="text-heading-3 text-dark-900">{title}</h3>
          {displayPrice && <span className="text-body-medium text-dark-900">{displayPrice}</span>}
        </div>
        {description && <p className="text-body text-dark-700">{description}</p>}
        {subtitle && <p className="text-body text-dark-700">{subtitle}</p>}
        {meta && (
          <p className="mt-1 text-caption text-dark-700">
            {Array.isArray(meta) ? meta.join(" • ") : meta}
          </p>
        )}
      </div>
    </article>
  );

  return href ? (
    <a
      href={href}
      aria-label={title}
      className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
    >
      {content}
    </a>
  ) : (
    content
  );
}

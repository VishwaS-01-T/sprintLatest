import { cn } from '../lib/utils';

const toneToBg = {
  red: "text-[--color-red]",
  green: "text-[--color-green]",
  orange: "text-[--color-orange]",
};

/**
 * Card Component - Design System
 * 
 * Consistent card styling with rounded-2xl (16px) border radius.
 * Supports multiple variants and hover effects.
 * 
 * @param {Object} props - Component props
 * @param {'default' | 'elevated' | 'outlined' | 'ghost'} props.variant - Card style variant
 * @param {boolean} props.hoverable - Enable hover effects
 */
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
  variant = 'default',
  hoverable = true,
  className = "",
}) {
  const displayPrice =
    price === undefined ? undefined : typeof price === "number" ? `₹${price.toFixed(2)}` : price;
  
  // Variant styles
  const variants = {
    default: 'bg-light-100 ring-1 ring-light-300 hover:ring-dark-500 hover:shadow-[var(--shadow-soft)]',
    elevated: 'bg-white shadow-sm hover:shadow-[var(--shadow-soft)]',
    outlined: 'bg-white border-2 border-neutral-200 hover:border-neutral-300 hover:shadow-sm',
    ghost: 'bg-transparent hover:bg-neutral-50',
  };
  
  const content = (
    <article
      className={cn(
        'group rounded-[20px] transition-all duration-300 ease-out',
        variants[variant],
        hoverable && 'hover:-translate-y-1',
        !hoverable && 'hover:ring-light-300 hover:shadow-none hover:border-neutral-200',
        className
      )}
    >
      {imageSrc && (
        <div className="relative aspect-square overflow-hidden rounded-t-[20px] bg-light-200">
          <img
            src={imageSrc}
            alt={imageAlt}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-transform duration-300',
              hoverable && 'group-hover:scale-[1.04]'
            )}
          />
          {badge && (
            <div className="absolute top-3 right-3">
              {badge}
            </div>
          )}
        </div>
      )}
      <div className="p-5">
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
      className="block rounded-[20px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
    >
      {content}
    </a>
  ) : (
    content
  );
}

/**
 * Card subcomponents for more flexible layouts
 */
export function CardHeader({ children, className }) {
  return (
    <div className={cn('p-5 border-b border-neutral-200', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }) {
  return (
    <div className={cn('p-5', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }) {
  return (
    <div className={cn('p-5 border-t border-neutral-200', className)}>
      {children}
    </div>
  );
}

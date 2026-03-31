import React from "react";
import { Link } from "../hooks/useRouter.jsx";
import { Instagram, Linkedin } from "lucide-react";

const FooterLink = ({ href, children }) => (
  <li>
    <Link
      href={href}
      className="text-neutral-500 hover:text-white transition-all duration-[250ms] ease text-sm cursor-pointer"
    >
      {children}
    </Link>
  </li>
);

/**
 * Footer Component
 */
const Footer = () => {
  return (
    <footer className="bg-neutral-950 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8">

          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-2 flex flex-col gap-6">
            <div>
              <p className="text-xl sm:text-2xl font-black tracking-tight">
                SPRINT SHOES
              </p>
              <p className="text-muted text-xs sm:text-sm mt-2 leading-relaxed max-w-xs">
                Crafted for speed. Built for style. Premium footwear for every stride.
              </p>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-neutral-800 flex items-center justify-center text-muted hover:text-white hover:border-neutral-600 transition-all duration-[250ms] ease cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full border border-neutral-800 flex items-center justify-center text-muted hover:text-white hover:border-neutral-600 transition-all duration-[250ms] ease cursor-pointer"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>

            {/* Contact */}
            <div className="space-y-1.5 text-sm">
              <a href="mailto:hello@sprintwear.com" className="block text-neutral-500 hover:text-white transition-all duration-[250ms] ease cursor-pointer">
                hello@sprintwear.com
              </a>
              <a href="tel:+919700000003" className="block text-neutral-500 hover:text-white transition-all duration-[250ms] ease cursor-pointer">
                +91 97*******3
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-3 sm:mb-5">
              Company
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/craftsmanship">Craftsmanship</FooterLink>
              <FooterLink href="/garage">The Inventory</FooterLink>
              <FooterLink href="/vault">The Vault</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-5">Support</h4>
            <ul className="space-y-3">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/stores">Store Locator</FooterLink>
              <FooterLink href="/returns">Returns & Exchanges</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-5">Legal</h4>
            <ul className="space-y-3">
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms & Conditions</FooterLink>
              <FooterLink href="/refund">Refund Policy</FooterLink>
              <FooterLink href="/care">Care Guide</FooterLink>
              <FooterLink href="/returns-policy">Exchange Policy</FooterLink>
            </ul>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="mt-8 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} SprintShoes. All rights reserved.
          </p>
          <p className="text-xs text-neutral-700">
            Designed with care for athletes everywhere.
          </p>
        </div>
      </div>

      {/* Watermark */}
      <div className="overflow-hidden">
        <p
          className="text-center font-black uppercase select-none leading-none tracking-tighter"
          style={{
            fontSize: "clamp(4rem, 14vw, 13rem)",
            background: "linear-gradient(to bottom, rgba(80,80,80,0.18) 0%, rgba(10,10,10,0) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          SPRINTSHOES
        </p>
      </div>
    </footer>
  );
};

export default Footer;

import Link from "next/link";

import MobileMenu from "./mobile-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/authors", label: "Authors" },
];

export default function SiteHeader({ title }: { title: string }) {
  return (
    <header className="relative border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between px-5 py-4">
        <Link href="/" className="text-xl font-bold tracking-tighter">
          {title}
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-8 text-lg">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <MobileMenu links={navLinks} />
      </div>
    </header>
  );
}

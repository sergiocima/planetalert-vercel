"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          PlanetAlert
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/about" className="hover:text-primary transition-colors">
            Chi siamo
          </Link>
          <Link href="/sources" className="hover:text-primary transition-colors">
            Fonti
          </Link>
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Plus } from "lucide-react"

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-bold text-xl">
          PlanetAlert
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/events">
            <Button variant="ghost">Eventi</Button>
          </Link>
          <Link href="/sources">
            <Button variant="ghost">Fonti</Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost">Info</Button>
          </Link>
          <Link href="/events/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuovo Evento
            </Button>
          </Link>
          <ModeToggle />
        </nav>
      </div>
    </header>
  )
}

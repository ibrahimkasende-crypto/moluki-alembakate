"use client"

import { useState } from "react"

export function Greeting() {
  const hour = new Date().getHours()
  return <p className="text-[11px] uppercase tracking-[0.18em] text-stone">{hour < 18 ? "Bonjour" : "Bonsoir"}</p>
}

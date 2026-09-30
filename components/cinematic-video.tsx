"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

export function CinematicVideo({
  src,
  poster,
  eager = false,
  className,
}: {
  src: string
  poster: string
  eager?: boolean
  className?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()
  const [active, setActive] = useState(eager)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const node = videoRef.current
    if (!node || reduce) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.45)
        if (visible) {
          setActive(true)
          if (node.getAttribute("src")) {
            node.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
          }
        } else {
          node.pause()
          setPlaying(false)
        }
      },
      { threshold: [0, 0.45] },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reduce])

  useEffect(() => {
    const node = videoRef.current
    if (!node || reduce || !active) return
    const play = () => {
      node.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
    if (node.readyState >= 2) play()
    else node.addEventListener("loadeddata", play, { once: true })
    return () => node.removeEventListener("loadeddata", play)
  }, [active, reduce])

  if (reduce) {
    return <img src={poster} alt="" className={cn("h-full w-full object-cover", className)} />
  }

  return (
    <div className="relative h-full w-full">
      <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <video
        ref={videoRef}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
          eager && "drift",
          playing ? "opacity-100" : "opacity-0",
          className,
        )}
        poster={poster}
        src={active ? src : undefined}
        muted
        loop
        playsInline
        preload={eager ? "metadata" : "none"}
      />
    </div>
  )
}

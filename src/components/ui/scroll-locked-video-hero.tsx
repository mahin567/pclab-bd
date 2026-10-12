"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────────
// Scroll-locked, scroll-scrubbed video hero.
// Page scroll is pinned while the user's wheel/touch input scrubs the video.
// When the video reaches the end, the lock is released so the page below can
// be scrolled; scrolling back up from the very top re-engages the lock.
// ─────────────────────────────────────────────────────────────

export interface MetroHeroProps {
  videoSrc?: string
  /** Still product photo used instead of the video. The scroll drives a cinematic zoom. */
  imageSrc?: string
  title?: string
  scrollHint?: string
  tagline?: string
  signature?: { name: string; url: string } | false
  /** Total input distance (px) needed to scrub the full video. Tune to taste. */
  scrubDistance?: number
  /** Release the scroll lock once the video finishes so the page can continue. Default true. */
  releaseOnComplete?: boolean
  className?: string
  style?: React.CSSProperties
}

const DEFAULT_VIDEO =
  "https://cdn.21st.dev/assets/mirror/21/21a77eac28eacbb7e142016eefeaa0b4a766619e51113629a3bc6df6af066c0f.mp4"
const DEFAULT_SIGNATURE = { name: "guglielmogiannattasio.exe", url: "https://www.guglielmogiannattasio.it" }

const COL_BG = "#05070d"
const COL_TEXT = "#f2f4f8"

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

export function MetroHero({
  videoSrc = DEFAULT_VIDEO,
  imageSrc,
  title = "THE CITY OPENS",
  scrollHint = "SCROLL",
  tagline = "Every door in the city is already open.",
  signature = DEFAULT_SIGNATURE,
  scrubDistance = 3200,
  releaseOnComplete = true,
  className,
  style,
}: MetroHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current // null in image mode
    const section = sectionRef.current
    if (!section) return
    if (imgRef.current?.complete) setReady(true)

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

    let duration = 0
    let rafId = 0
    let targetProgress = 0
    let currentProgress = 0
    let hasStartedScrolling = false
    let isSeeking = false
    let pendingTime: number | null = null
    let lastSeek = -1
    let locked = false
    let lockedScrollY = 0
    let touchStartY = 0

    const onLoadedData = () => {
      duration = video?.duration || 0
      setReady(true)
      if (reduceMotion && video) video.currentTime = duration * 0.92
    }
    video?.addEventListener("loadeddata", onLoadedData)

    // iOS Safari: kick off buffering with a silent play() → pause().
    if (video) {
      const p = video.play()
      if (p && typeof p.then === "function") p.then(() => video.pause()).catch(() => {})
      else video.pause()
    }

    const onSeeked = () => {
      isSeeking = false
      if (pendingTime !== null) {
        const t = pendingTime
        pendingTime = null
        isSeeking = true
        if (video) video.currentTime = t
      }
    }
    video?.addEventListener("seeked", onSeeked)

    function seekTo(t: number) {
      if (!video) return
      if (Math.abs(t - lastSeek) < 0.005) return
      lastSeek = t
      if (isSeeking) {
        pendingTime = t
        return
      }
      isSeeking = true
      video.currentTime = t
    }

    function engageLock() {
      if (locked) return
      locked = true
      lockedScrollY = window.scrollY
      const b = document.body.style
      b.position = "fixed"
      b.top = `-${lockedScrollY}px`
      b.left = "0"
      b.right = "0"
      b.width = "100%"
      b.height = "100%"
      b.overscrollBehavior = "none"
      section!.style.touchAction = "none"
    }

    function releaseLock() {
      if (!locked) return
      locked = false
      const y = lockedScrollY
      const b = document.body.style
      b.position = ""
      b.top = ""
      b.left = ""
      b.right = ""
      b.width = ""
      b.height = ""
      b.overscrollBehavior = ""
      section!.style.touchAction = "pan-y"
      window.scrollTo(0, y)
    }

    function addDelta(deltaY: number) {
      targetProgress = clamp(targetProgress + deltaY / scrubDistance, 0, 1)
      if (targetProgress > 0.001) hasStartedScrolling = true
    }

    // Returns true when the event was consumed (caller should preventDefault).
    function handleDelta(deltaY: number): boolean {
      if (locked) {
        if (releaseOnComplete && deltaY > 0 && targetProgress >= 0.999 && currentProgress > 0.97) {
          releaseLock()
          window.scrollBy(0, deltaY)
          return true
        }
        addDelta(deltaY)
        return true
      }
      // Unlocked: only re-engage when the user pulls back up past the top of the page.
      if (releaseOnComplete && deltaY < 0 && window.scrollY <= 0) {
        engageLock()
        addDelta(deltaY)
        return true
      }
      return false
    }

    const onWheel = (e: WheelEvent) => {
      if (handleDelta(e.deltaY)) e.preventDefault()
    }
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchStartY
      const deltaY = touchStartY - y
      touchStartY = y
      if (handleDelta(deltaY)) e.preventDefault()
    }

    if (reduceMotion) {
      // No lock, no scrubbing: show the end of the video and the title, let the page scroll normally.
      if (titleRef.current) titleRef.current.style.opacity = "1"
      if (hintRef.current) hintRef.current.style.opacity = "0"
      section.style.touchAction = "pan-y"
    } else {
      engageLock()
      window.addEventListener("wheel", onWheel, { passive: false })
      window.addEventListener("touchstart", onTouchStart, { passive: true })
      window.addEventListener("touchmove", onTouchMove, { passive: false })

      const frame = () => {
        currentProgress += (targetProgress - currentProgress) * 0.18
        if (Math.abs(targetProgress - currentProgress) < 0.0004) currentProgress = targetProgress

        if (duration > 0) seekTo(currentProgress * duration)

        const media = videoRef.current ?? imgRef.current
        if (media) {
          const zoom = video ? 0.06 : 0.18
          media.style.transform = `scale(${1 + currentProgress * zoom}) translateY(${-currentProgress * (video ? 0 : 2)}%)`
        }
        if (scrimRef.current) scrimRef.current.style.opacity = String(0.62 - currentProgress * 0.27)
        if (titleRef.current) {
          const t = 1 - clamp(currentProgress / 0.35, 0, 1)
          titleRef.current.style.opacity = String(t)
          titleRef.current.style.transform = `translateY(${(1 - t) * -24}px) scale(${0.96 + t * 0.04})`
          titleRef.current.style.filter = `blur(${(1 - t) * 10}px)`
        }
        if (hintRef.current) hintRef.current.style.opacity = hasStartedScrolling ? "0" : "1"
        if (taglineRef.current) {
          const t = clamp((currentProgress - 0.82) / 0.18, 0, 1)
          taglineRef.current.style.opacity = String(t)
          taglineRef.current.style.transform = `translateY(${(1 - t) * 20}px) scale(${0.97 + t * 0.03})`
          taglineRef.current.style.filter = `blur(${(1 - t) * 8}px)`
        }
        if (progressBarRef.current) progressBarRef.current.style.transform = `scaleX(${currentProgress})`

        rafId = requestAnimationFrame(frame)
      }
      rafId = requestAnimationFrame(frame)
    }

    return () => {
      video?.removeEventListener("loadeddata", onLoadedData)
      video?.removeEventListener("seeked", onSeeked)
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      cancelAnimationFrame(rafId)
      releaseLock()
    }
  }, [scrubDistance, releaseOnComplete, imageSrc])

  return (
    <div
      ref={sectionRef}
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height: "100dvh", background: COL_BG, touchAction: "none", ...style }}
    >
      {imageSrc ? (
        <img
          ref={imgRef}
          src={imageSrc}
          alt=""
          onLoad={() => setReady(true)}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition: "center 42%",
            opacity: ready ? 1 : 0,
            transformOrigin: "center 55%",
            willChange: "transform",
            transition: "opacity 0.6s ease",
          }}
        />
      ) : (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: ready ? 1 : 0,
            transformOrigin: "center center",
            willChange: "transform",
            transition: "opacity 0.6s ease",
            touchAction: "none",
          }}
        />
      )}

      {imageSrc && (
        <div ref={scrimRef} className="pointer-events-none absolute inset-0" style={{ background: COL_BG, opacity: 0.62 }} />
      )}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,7,13,0.35), rgba(5,7,13,0) 30%, rgba(5,7,13,0.15) 70%, rgba(5,7,13,0.55))",
        }}
      />

      <div
        ref={titleRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center px-[6%] text-center"
      >
        <span
          className="inline-block font-extrabold"
          style={{
            fontSize: "clamp(30px, 7vw, 96px)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: COL_TEXT,
            textShadow: "0 4px 30px rgba(0,0,0,0.5)",
            willChange: "transform, filter, opacity",
          }}
        >
          {title}
        </span>
      </div>

      {tagline && (
        <div
          ref={taglineRef}
          className="pointer-events-none absolute inset-0 flex items-center justify-center px-[8%] text-center"
          style={{ opacity: 0 }}
        >
          <span
            className="font-bold"
            style={{
              fontSize: "clamp(20px, 3.4vw, 40px)",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              color: COL_TEXT,
              textShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            {tagline}
          </span>
        </div>
      )}

      <div
        ref={hintRef}
        className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-semibold"
        style={{
          bottom: "clamp(20px, 6vh, 48px)",
          color: "rgba(240,244,248,0.75)",
          fontSize: "clamp(10px, 1.4vw, 12px)",
          letterSpacing: "0.3em",
          transition: "opacity 0.4s ease",
        }}
      >
        <span>{scrollHint}</span>
        <svg width="14" height="18" viewBox="0 0 14 18" style={{ animation: "metro-hero-bounce 1.6s ease-in-out infinite" }}>
          <style>{`
            @keyframes metro-hero-bounce {
              0%, 100% { transform: translateY(0); opacity: 0.5; }
              50% { transform: translateY(5px); opacity: 1; }
            }
          `}</style>
          <path d="M7 1 L7 17 M2 12 L7 17 L12 12" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-0.5" style={{ background: "rgba(255,255,255,0.12)" }}>
        <div
          ref={progressBarRef}
          className="h-full w-full"
          style={{
            background: "linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.95))",
            transform: "scaleX(0)",
            transformOrigin: "left center",
          }}
        />
      </div>

      {signature && (
        <span
          className="absolute z-[2] font-medium"
          style={{
            right: "clamp(12px, 2.5vw, 24px)",
            bottom: "clamp(10px, 2vw, 18px)",
            fontSize: "clamp(11px, 1.4vw, 13px)",
            letterSpacing: "0.01em",
            color: "rgba(220,224,232,0.6)",
          }}
        >
          by{" "}
          <a
            href={signature.url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:!text-[#f2f4f8]"
            style={{ color: "rgba(220,224,232,0.6)", textDecoration: "none" }}
          >
            {signature.name}
          </a>
        </span>
      )}
    </div>
  )
}

export default function DemoOne() {
  return <MetroHero />
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import JourneyScene from "./Scene";
import { STATIONS, DOCUMENTS, PHOTOS, BOOK_TITLE, BOOK_AUTHOR, type Station } from "./stations";

export default function Journey() {
  const [focus, setFocus] = useState<Station | null>(null);
  const [docsOpen, setDocsOpen] = useState(false);
  const [photosOpen, setPhotosOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const select = useCallback((s: Station) => {
    setFocus(s);
  }, []);

  // stop audio when the station changes
  useEffect(() => {
    audioRef.current?.pause();
  }, [focus?.slug]);

  const index = focus ? STATIONS.findIndex((s) => s.slug === focus.slug) : -1;

  return (
    <div className="fixed inset-0 bg-[#a7abb0]">
      <JourneyScene focus={focus} onSelect={select} />

      {/* header */}
      <div className="absolute top-16 left-0 right-0 px-4 py-3 pointer-events-none">
        <div className="max-w-6xl mx-auto flex items-start justify-between">
          <div className="pointer-events-auto">
            <Link
              href="/command-responsibility"
              className="text-xs tracking-widest text-black/50 hover:text-black transition-colors uppercase"
            >
              ← {BOOK_TITLE}
            </Link>
            <h1 className="font-serif text-xl md:text-2xl text-black/80 tracking-wide">The Journey — a memorial landscape</h1>
            <p className="text-xs text-black/50 max-w-md mt-1">
              {BOOK_AUTHOR}&apos;s path, 1940–1945. Select a station to listen to that chapter.
            </p>
            <p className="text-[10px] text-black/40 mt-0.5 uppercase tracking-widest">
              Arrow keys / WASD to move · drag to look · scroll to zoom
            </p>
          </div>
          <div className="pointer-events-auto flex gap-5">
            <button
              onClick={() => {
                setPhotosOpen((o) => !o);
                setDocsOpen(false);
              }}
              className="text-xs uppercase tracking-widest text-black/50 hover:text-black transition-colors"
            >
              Photos
            </button>
            <button
              onClick={() => {
                setDocsOpen((o) => !o);
                setPhotosOpen(false);
              }}
              className="text-xs uppercase tracking-widest text-black/50 hover:text-black transition-colors"
            >
              Documents
            </button>
          </div>
        </div>
      </div>

      {/* station panel */}
      {focus && (
        <div className="absolute bottom-0 left-0 right-0 md:bottom-6 md:left-auto md:right-6 md:w-[380px] pointer-events-auto">
          <div className="bg-[#161513]/95 backdrop-blur border border-white/10 md:rounded-xl p-5 text-gray-200">
            <div className="flex items-start justify-between gap-3 mb-1">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-accent">
                  Station {String(index + 1).padStart(2, "0")} · {focus.place}
                </p>
                <h2 className="font-serif text-2xl">{focus.title}</h2>
              </div>
              <button onClick={() => setFocus(null)} className="text-gray-500 hover:text-white text-xl leading-none">
                ×
              </button>
            </div>
            {focus.excerpt && <p className="text-sm text-gray-400 leading-relaxed mt-2 mb-3">{focus.excerpt}</p>}
            {focus.mentions && (
              <p className="text-[11px] text-gray-500 mb-4">
                <span className="uppercase tracking-widest text-gray-600">Places in this chapter: </span>
                {focus.mentions}
              </p>
            )}
            {focus.audio ? (
              <audio ref={audioRef} key={focus.slug} controls preload="none" className="w-full mb-3">
                <source src={focus.audio} type="audio/mpeg" />
              </audio>
            ) : (
              <p className="text-xs text-gray-500 mb-3">No audio for this chapter.</p>
            )}
            <div className="flex items-center justify-between text-xs">
              <Link href={`/command-responsibility/${focus.slug}`} className="text-accent hover:underline">
                Read this chapter →
              </Link>
              <div className="flex gap-3">
                <button
                  onClick={() => index > 0 && setFocus(STATIONS[index - 1])}
                  disabled={index <= 0}
                  className="text-gray-400 hover:text-white disabled:opacity-30 uppercase tracking-widest"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => index < STATIONS.length - 1 && setFocus(STATIONS[index + 1])}
                  disabled={index >= STATIONS.length - 1}
                  className="text-gray-400 hover:text-white disabled:opacity-30 uppercase tracking-widest"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* start hint */}
      {!focus && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
          <button
            onClick={() => setFocus(STATIONS[0])}
            className="pointer-events-auto px-6 py-2 bg-[#161513]/90 border border-white/10 rounded-full text-sm text-gray-300 hover:text-accent transition-colors"
          >
            Begin in Vienna — Station 01
          </button>
        </div>
      )}

      {/* photos drawer */}
      {photosOpen && (
        <div className="absolute top-32 right-4 w-[380px] max-w-[calc(100vw-2rem)] max-h-[60vh] overflow-y-auto bg-[#161513]/95 backdrop-blur border border-white/10 rounded-xl p-5 text-gray-300 pointer-events-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs uppercase tracking-widest text-gray-500">Photographs from the book</h3>
            <button onClick={() => setPhotosOpen(false)} className="text-gray-500 hover:text-white leading-none">
              ×
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {PHOTOS.map((photo, i) => (
              <button key={photo.src} onClick={() => setLightbox(i)} className="text-left group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.caption}
                  loading="lazy"
                  className="w-full h-24 object-cover rounded border border-white/10 group-hover:border-accent/60 transition-colors"
                />
                <p className="mt-1 text-[10px] text-gray-500 leading-snug line-clamp-2">{photo.caption}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* photo lightbox */}
      {lightbox !== null && PHOTOS[lightbox] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm px-4"
          onClick={() => setLightbox(null)}
        >
          <div className="max-w-3xl w-full text-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PHOTOS[lightbox].src}
              alt={PHOTOS[lightbox].caption}
              className="max-h-[72vh] w-auto mx-auto rounded shadow-2xl"
            />
            <p className="mt-4 text-gray-300 font-serif">{PHOTOS[lightbox].caption}</p>
            <p className="mt-1 text-xs text-gray-500">
              From the chapter{" "}
              <Link href={`/command-responsibility/${PHOTOS[lightbox].chapter}`} className="text-accent hover:underline">
                {PHOTOS[lightbox].chapterTitle}
              </Link>
            </p>
            <div className="mt-5 flex items-center justify-center gap-6 text-sm">
              <button
                onClick={() => setLightbox((i) => (i !== null && i > 0 ? i - 1 : i))}
                disabled={lightbox <= 0}
                className="text-gray-400 hover:text-white disabled:opacity-30 uppercase tracking-widest"
              >
                ← Prev
              </button>
              <button
                onClick={() => setLightbox(null)}
                className="px-5 py-1.5 border border-white/20 text-gray-300 hover:text-white uppercase tracking-widest text-xs"
              >
                Close
              </button>
              <button
                onClick={() => setLightbox((i) => (i !== null && i < PHOTOS.length - 1 ? i + 1 : i))}
                disabled={lightbox >= PHOTOS.length - 1}
                className="text-gray-400 hover:text-white disabled:opacity-30 uppercase tracking-widest"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* documents drawer */}
      {docsOpen && (
        <div className="absolute top-32 right-4 w-[320px] max-w-[calc(100vw-2rem)] bg-[#161513]/95 backdrop-blur border border-white/10 rounded-xl p-5 text-gray-300 pointer-events-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs uppercase tracking-widest text-gray-500">Documents & context</h3>
            <button onClick={() => setDocsOpen(false)} className="text-gray-500 hover:text-white leading-none">
              ×
            </button>
          </div>
          <ul className="space-y-2 text-sm">
            {DOCUMENTS.map((d) => (
              <li key={d.slug}>
                <Link href={`/command-responsibility/${d.slug}`} className="hover:text-accent transition-colors">
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

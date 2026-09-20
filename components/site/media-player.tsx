"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "cn";
import type { MediaDetail } from "@/lib/content/types";

/**
 * The player, mounted only when a record actually carries a `source`.
 *
 * It is a thin shell over the native element: the browser's own controls are
 * kept, because they are keyboard accessible, respect the platform's caption
 * and playback-rate settings, and behave correctly with a screen reader. What
 * this adds is chapter seeking, which the native controls have no concept of.
 */
export function MediaPlayer({ item }: { item: MediaDetail }) {
  const ref = useRef<HTMLMediaElement>(null);
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const source = item.source;

  const seek = useCallback((id: string, startSeconds: number) => {
    const element = ref.current;
    if (!element) return;
    element.currentTime = startSeconds;
    setActiveChapter(id);
    void element.play().catch(() => {
      // Autoplay can be refused; the seek has still happened, which is the
      // part the reader asked for.
    });
  }, []);

  if (!source) return null;
  const isAudio = source.mimeType.startsWith("audio/");

  return (
    <div className="overflow-hidden rounded-3xl border border-hairline bg-card">
      {isAudio ? (
        <div className="bg-forest p-6 sm:p-8">
          <audio
            ref={ref as React.RefObject<HTMLAudioElement>}
            controls
            preload="metadata"
            className="w-full"
          >
            <source src={source.url} type={source.mimeType} />
            {source.captionsUrl && (
              <track
                kind="captions"
                src={source.captionsUrl}
                srcLang="en"
                label="English"
                default
              />
            )}
          </audio>
        </div>
      ) : (
        <video
          ref={ref as React.RefObject<HTMLVideoElement>}
          controls
          preload="metadata"
          poster={source.posterUrl}
          playsInline
          className="aspect-video w-full bg-forest"
        >
          <source src={source.url} type={source.mimeType} />
          {source.captionsUrl && (
            <track
              kind="captions"
              src={source.captionsUrl}
              srcLang="en"
              label="English"
              default
            />
          )}
        </video>
      )}

      {item.chapters.length > 0 && (
        <div className="border-t border-hairline p-4 sm:p-5">
          <p className="text-eyebrow text-muted-foreground">Jump to a chapter</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {item.chapters.map((chapter) => (
              <li key={chapter.id}>
                <button
                  type="button"
                  onClick={() => seek(chapter.id, chapter.startSeconds)}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-[0.8rem] font-bold transition-colors",
                    activeChapter === chapter.id
                      ? "border-primary/50 bg-primary/15 text-brand-ink"
                      : "border-hairline bg-card text-muted-foreground hover:border-primary/35 hover:text-foreground"
                  )}
                >
                  {chapter.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

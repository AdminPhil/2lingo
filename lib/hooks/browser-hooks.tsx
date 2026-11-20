"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * CroLingo v2 Zero-Dependency Native React Browser Hooks
 * Replaces `react-use` (incompatible with React 19) with lean, predictable hooks.
 */

export function useMount(fn: () => void) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => {
    fnRef.current();
  }, []);
}

export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}

export function useMedia(query: string, defaultState = false): boolean {
  const [matches, setMatches] = useState(defaultState);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export function useKey(
  key: string,
  handler: (event: KeyboardEvent) => void,
  _options?: Record<string, unknown>,
  deps: React.DependencyList = []
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === key) {
        handlerRef.current(event);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ...deps]);
}

type AudioControls = {
  play: () => Promise<void> | void;
  pause: () => void;
};

export function useAudio(props: {
  src: string;
  autoPlay?: boolean;
}): [React.ReactElement, { playing: boolean }, AudioControls] {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const play = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    try {
      el.currentTime = 0;
      const promise = el.play();
      if (promise && typeof promise.catch === "function") {
        return promise.catch(() => {
          // Ignore browser autoplay policy rejections
        });
      }
    } catch {
      // Ignore audio element playback errors in headless/test environments
    }
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const element = useMemo(
    () => (
      <audio
        ref={audioRef}
        src={props.src || undefined}
        autoPlay={props.autoPlay}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    ),
    [props.src, props.autoPlay]
  );

  const controls = useMemo(() => ({ play, pause }), [play, pause]);

  return [element, { playing }, controls];
}

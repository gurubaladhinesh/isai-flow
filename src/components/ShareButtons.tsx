"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Copy, MessageCircle, Share2 } from "lucide-react";
import { SITE_NAME } from "@/src/lib/site";

interface ShareButtonsProps {
  title: string;
  url: string;
}

function buildWhatsAppUrl(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

function buildTwitterUrl(text: string, url: string) {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}

function subscribe() {
  return () => {};
}

function getCanNativeShare() {
  return typeof navigator.share === "function";
}

function getServerCanNativeShare() {
  return false;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const canNativeShare = useSyncExternalStore(
    subscribe,
    getCanNativeShare,
    getServerCanNativeShare,
  );

  const shareText = `Listen to ${title} live on ${SITE_NAME}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text: shareText, url });
      } catch {
        // User cancelled or share failed — no action needed
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
        <Share2 className="h-3.5 w-3.5" />
        Share
      </span>

      <a
        href={buildWhatsAppUrl(`${shareText}\n${url}`)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-3.5 py-2 text-xs font-medium text-[#4ade80] transition hover:bg-[#25D366]/20"
        aria-label={`Share ${title} on WhatsApp`}
      >
        <MessageCircle className="h-3.5 w-3.5" />
        WhatsApp
      </a>

      <a
        href={buildTwitterUrl(shareText, url)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[var(--border)] bg-white/5 px-3.5 py-2 text-xs font-medium text-[var(--muted)] transition hover:text-[var(--text)]"
        aria-label={`Share ${title} on X`}
      >
        <span className="font-semibold">𝕏</span>
        Post
      </a>

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[var(--border)] bg-white/5 px-3.5 py-2 text-xs font-medium text-[var(--muted)] transition hover:text-[var(--text)]"
        aria-label="Copy station link"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-[var(--accent-bright)]" />
            Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            Copy link
          </>
        )}
      </button>

      {canNativeShare ? (
        <button
          type="button"
          onClick={handleNativeShare}
          className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[var(--border)] bg-white/5 px-3.5 py-2 text-xs font-medium text-[var(--muted)] transition hover:text-[var(--text)] sm:hidden"
          aria-label="Share station"
        >
          <Share2 className="h-3.5 w-3.5" />
          More
        </button>
      ) : null}
    </div>
  );
}

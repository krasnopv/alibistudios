const PENDING_HASH_KEY = 'alibi:pendingHashScroll';

export function normalizePathname(pathname: string) {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function parseHashHref(href: string): { pathname: string; hash: string } | null {
  const trimmed = href.trim();
  const hashIndex = trimmed.indexOf('#');
  if (hashIndex === -1) return null;

  let pathname = trimmed.slice(0, hashIndex);
  const hash = trimmed.slice(hashIndex + 1);
  if (!hash) return null;

  if (!pathname) pathname = '/';
  pathname = normalizePathname(pathname);

  return { pathname, hash };
}

export function buildHashHref(pathname: string, hash: string) {
  const cleanHash = hash.replace(/^#/, '');
  const path = normalizePathname(pathname);
  if (path === '/') return `/#${cleanHash}`;
  return `${path}#${cleanHash}`;
}

export function normalizeHashHref(href: string) {
  const trimmed = href.trim();
  if (trimmed.startsWith('#') && !trimmed.startsWith('/')) {
    return `/${trimmed}`;
  }
  return trimmed;
}

export function markPendingHashScroll(hash: string) {
  const sectionId = hash.replace(/^#/, '');
  if (sectionId) {
    sessionStorage.setItem(PENDING_HASH_KEY, sectionId);
  }
}

export function consumePendingHashScroll(): string | null {
  const value = sessionStorage.getItem(PENDING_HASH_KEY);
  if (value) sessionStorage.removeItem(PENDING_HASH_KEY);
  return value;
}

function shouldWaitForContentOnLoad(): boolean {
  if (typeof window === 'undefined' || !window.location.hash) return false;
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  return nav?.type === 'navigate' || nav?.type === 'reload';
}

function waitForElement(sectionId: string, maxWaitMs: number, intervalMs: number): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    const existing = document.getElementById(sectionId);
    if (existing) {
      resolve(existing);
      return;
    }

    const start = Date.now();
    const interval = window.setInterval(() => {
      const element = document.getElementById(sectionId);
      if (element || Date.now() - start > maxWaitMs) {
        window.clearInterval(interval);
        resolve(element);
      }
    }, intervalMs);
  });
}

function waitForWindowLoad(): Promise<void> {
  if (document.readyState === 'complete') return Promise.resolve();
  return new Promise((resolve) => {
    window.addEventListener('load', () => resolve(), { once: true });
  });
}

/** Re-align scroll while images above the target finish loading and shift layout. */
function watchLayoutAndRealign(sectionId: string, durationMs = 3000): () => void {
  let debounceTimer: number | undefined;

  const realign = () => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  };

  const debouncedRealign = () => {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(realign, 120);
  };

  const observer = new ResizeObserver(debouncedRealign);
  observer.observe(document.body);

  const stopTimer = window.setTimeout(() => {
    observer.disconnect();
  }, durationMs);

  return () => {
    observer.disconnect();
    window.clearTimeout(debounceTimer);
    window.clearTimeout(stopTimer);
  };
}

export function scrollToHashSection(
  hash: string,
  options?: {
    behavior?: ScrollBehavior;
    maxWaitMs?: number;
    intervalMs?: number;
    /** Wait for async content + window load before jumping to section (cross-page / direct URL) */
    waitForContent?: boolean;
  }
): () => void {
  const sectionId = hash.replace(/^#/, '');
  if (!sectionId) return () => {};

  let cancelled = false;
  const cleanups: Array<() => void> = [];

  const cancel = () => {
    cancelled = true;
    cleanups.forEach((fn) => fn());
  };

  const scrollToTarget = (behavior: ScrollBehavior) => {
    const section = document.getElementById(sectionId);
    if (!section) return false;
    section.scrollIntoView({ behavior, block: 'start' });
    return true;
  };

  const run = async () => {
    const maxWaitMs = options?.maxWaitMs ?? 15000;
    const intervalMs = options?.intervalMs ?? 200;
    const element = await waitForElement(sectionId, maxWaitMs, intervalMs);
    if (cancelled || !element) return;

    if (options?.waitForContent) {
      await waitForWindowLoad();
      if (cancelled) return;

      scrollToTarget('auto');
      cleanups.push(watchLayoutAndRealign(sectionId));
    } else {
      scrollToTarget(options?.behavior ?? 'smooth');
    }
  };

  void run();
  return cancel;
}

export function scrollToHashFromLocation(options?: { samePage?: boolean }): () => void {
  const pending = consumePendingHashScroll();
  const hash = pending ? `#${pending}` : window.location.hash;
  if (!hash || hash.length <= 1) return () => {};

  const waitForContent = !options?.samePage && (Boolean(pending) || shouldWaitForContentOnLoad());

  return scrollToHashSection(hash, {
    waitForContent,
    behavior: waitForContent ? 'auto' : 'smooth',
  });
}

export function navigateToHashHref(
  href: string,
  options?: { onBeforeNavigate?: () => void }
): boolean {
  const normalized = normalizeHashHref(href);
  const parsed = parseHashHref(normalized);
  if (!parsed) return false;

  options?.onBeforeNavigate?.();

  const currentPath = normalizePathname(window.location.pathname);
  const targetPath = normalizePathname(parsed.pathname);

  if (currentPath === targetPath) {
    window.history.pushState(null, '', buildHashHref(parsed.pathname, parsed.hash));
    scrollToHashSection(parsed.hash, { behavior: 'smooth' });
  } else {
    markPendingHashScroll(parsed.hash);
    window.location.assign(buildHashHref(parsed.pathname, parsed.hash));
  }

  return true;
}

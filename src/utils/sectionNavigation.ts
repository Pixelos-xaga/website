const SECTION_SCROLL_OFFSET = 96;

type HistoryMode = 'push' | 'replace' | 'none';

type SectionRoute = {
  sectionId: string;
  path: string;
  aliases?: string[];
};

const sectionRoutes: SectionRoute[] = [
  { sectionId: 'changelog', path: '/changelogs', aliases: ['/changelog'] },
  { sectionId: 'downloads', path: '/downloads' },
  { sectionId: 'guide', path: '/instructions', aliases: ['/guide'] },
  {
    sectionId: 'troubleshooting',
    path: '/support',
    aliases: ['/troubleshooting', '/faq', '/integrity', '/intrgrity', '/report-bugs', '/bugs', '/logcat'],
  },
];

const normalizePath = (pathname: string) => {
  if (!pathname || pathname === '/') {
    return '/';
  }

  const normalized = pathname.replace(/\/+$/, '');
  return normalized || '/';
};

const getCanonicalRoute = (sectionId: string) => {
  return sectionRoutes.find((route) => route.sectionId === sectionId) ?? null;
};

const updateUrl = (path: string, mode: HistoryMode) => {
  if (mode === 'none') {
    return;
  }

  const normalizedPath = normalizePath(path);
  const currentPath = normalizePath(window.location.pathname);
  const nextUrl = `${normalizedPath}${window.location.search}`;

  if (currentPath === normalizedPath && !window.location.hash) {
    return;
  }

  if (mode === 'push') {
    window.history.pushState(null, '', nextUrl);
    return;
  }

  window.history.replaceState(null, '', nextUrl);
};

const scrollToElement = (sectionId: string, behavior: ScrollBehavior) => {
  const element = document.getElementById(sectionId);

  if (!element) {
    return false;
  }

  const top = Math.max(0, element.getBoundingClientRect().top + window.scrollY - SECTION_SCROLL_OFFSET);
  window.scrollTo({ top, behavior });
  return true;
};

const resolvePathToRoute = (pathname: string) => {
  const normalizedPath = normalizePath(pathname);

  for (const route of sectionRoutes) {
    if (route.path === normalizedPath) {
      return route;
    }

    if (route.aliases?.includes(normalizedPath)) {
      return { ...route, path: normalizedPath };
    }
  }

  return null;
};

export const getSectionPath = (sectionId: string) => {
  return getCanonicalRoute(sectionId)?.path ?? '/';
};

export const scrollToSection = (
  sectionId: string,
  options: { behavior?: ScrollBehavior; history?: HistoryMode; path?: string } = {}
) => {
  const { behavior = 'smooth', history = 'push', path } = options;
  const didScroll = scrollToElement(sectionId, behavior);

  if (!didScroll) {
    if (path) {
      updateUrl(path, history);
    }

    return false;
  }

  const targetPath = path ?? getCanonicalRoute(sectionId)?.path;

  if (targetPath) {
    updateUrl(targetPath, history);
  }

  return true;
};

export const syncLocationToSection = (behavior: ScrollBehavior = 'auto') => {
  const route = resolvePathToRoute(window.location.pathname);

  if (route) {
    return scrollToSection(route.sectionId, { behavior, history: 'replace', path: route.path });
  }

  if (window.location.hash) {
    const sectionId = window.location.hash.replace(/^#/, '');

    if (sectionId === 'preloader-download') {
      return scrollToSection(sectionId, { behavior, history: 'replace', path: getSectionPath('downloads') });
    }

    return scrollToSection(sectionId, { behavior, history: 'replace' });
  }

  if (normalizePath(window.location.pathname) !== '/') {
    updateUrl('/', 'replace');
  }

  return false;
};

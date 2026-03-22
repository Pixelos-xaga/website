const defineRoute = (id, path, label, icon, loader, showInNav = true) => ({
  id,
  path,
  label,
  icon,
  loader,
  showInNav
});

export const APP_ROUTES = [
  defineRoute('home', '/', 'Home', 'home', () => import('../routes/home-view.js')),
  defineRoute('instructions', '/instructions', 'Instructions', 'terminal', () => import('../routes/instructions-view.js')),
  defineRoute('downloads', '/downloads', 'Downloads & Resources', 'folder_zip', () => import('../routes/downloads-view.js')),
  defineRoute('changelogs', '/changelogs', 'Changelogs', 'history', () => import('../routes/changelogs-view.js')),
  defineRoute('troubleshooting', '/troubleshooting', 'Troubleshooting', 'build_circle', () => import('../routes/troubleshooting-view.js'))
];

export const NAV_ROUTES = APP_ROUTES.filter((route) => route.showInNav);
export const ROUTE_VIEW_LOADERS = Object.fromEntries(APP_ROUTES.map(({ id, loader }) => [id, loader]));

const SECONDARY_ROUTES = APP_ROUTES.filter(({ path }) => path !== '/');
const ROUTE_PATHS = Object.fromEntries(APP_ROUTES.map(({ id, path }) => [id, path]));
const LEGACY_HASH_ROUTES = ['instructions', 'changelogs'];

export function normalizePathname(pathname = '/') {
  return String(pathname).toLowerCase().replace(/\/+$/, '') || '/';
}

export function getRouteFromPathname(pathname) {
  const normalized = normalizePathname(pathname);
  return SECONDARY_ROUTES.find(({ path }) => normalized === path || normalized.startsWith(`${path}/`))?.id || 'home';
}

export function getRoutePath(route) {
  return ROUTE_PATHS[route] || '/';
}

export function getLegacyHashRoute(hash = '') {
  const normalized = String(hash).replace(/^#\/?/, '').toLowerCase();
  return LEGACY_HASH_ROUTES.find((route) => normalized.startsWith(route)) || '';
}

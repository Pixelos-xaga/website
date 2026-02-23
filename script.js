const copyButtons = document.querySelectorAll('.copy-btn');

copyButtons.forEach((button) => {
  const icon = button.querySelector('md-icon');
  const defaultIcon = icon?.textContent.trim() || 'content_copy';

  button.addEventListener('click', async () => {
    const command = button.dataset.copy || '';

    try {
      await navigator.clipboard.writeText(command);
      if (icon) {
        icon.textContent = 'check';
      }
      button.setAttribute('aria-label', 'Copied');
      setTimeout(() => {
        if (icon) {
          icon.textContent = defaultIcon;
        }
      }, 1100);
    } catch {
      if (icon) {
        icon.textContent = 'error';
      }
      button.setAttribute('aria-label', 'Copy failed');
      setTimeout(() => {
        if (icon) {
          icon.textContent = defaultIcon;
        }
      }, 1100);
    }
  });
});

const navTabs = document.querySelectorAll('md-primary-tab[data-href]');

navTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const href = tab.dataset.href;
    if (href) {
      window.location.href = href;
    }
  });
});

const copyButtons = document.querySelectorAll('.copy-btn');

copyButtons.forEach((button) => {
  const defaultLabel = button.textContent.trim() || 'Copy';

  button.addEventListener('click', async () => {
    const command = button.dataset.copy || '';

    try {
      await navigator.clipboard.writeText(command);
      button.textContent = 'Copied';
      setTimeout(() => {
        button.textContent = defaultLabel;
      }, 1100);
    } catch {
      button.textContent = 'Failed';
      setTimeout(() => {
        button.textContent = defaultLabel;
      }, 1100);
    }
  });
});

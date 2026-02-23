const copyButtons = document.querySelectorAll('.copy-btn');

copyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const command = button.dataset.copy || '';

    try {
      await navigator.clipboard.writeText(command);
      const previous = button.textContent;
      button.textContent = 'Copied';
      setTimeout(() => {
        button.textContent = previous;
      }, 1100);
    } catch {
      button.textContent = 'Failed';
      setTimeout(() => {
        button.textContent = 'Copy';
      }, 1100);
    }
  });
});

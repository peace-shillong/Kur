// FOUC prevention: set color-scheme, active theme classes and data-theme from localStorage before render
(function () {
  try {
    var storedMode = localStorage.getItem('tipkur-theme-mode') || 'light';
    var customVar = localStorage.getItem('tipkur-theme-custom') || 'heritage';

    document.documentElement.classList.remove('dark', 'theme-light', 'theme-dark', 'theme-heritage', 'theme-forest', 'theme-dawki');

    if (storedMode === 'dark') {
      document.documentElement.classList.add('dark', 'theme-dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (storedMode === 'custom') {
      document.documentElement.classList.add('theme-' + customVar);
      document.documentElement.setAttribute('data-theme', 'custom-' + customVar);
    } else {
      document.documentElement.classList.add('theme-light');
      document.documentElement.setAttribute('data-theme', 'light');
    }

    var meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) {
      meta.content = storedMode === 'dark' ? 'dark' : 'light';
    }
  } catch (e) { }
})();

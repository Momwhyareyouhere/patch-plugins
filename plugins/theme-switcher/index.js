var isDark = true;

function toggleTheme() {
  isDark = !isDark;
  var theme = isDark ? 'vs-dark' : 'vs';
  patch.settings.update({ theme: theme });
  patch.ui.showNotification('Switched to ' + (isDark ? 'Dark' : 'Light') + ' theme');
}

patch.commands.register('theme-switcher.toggle', 'Toggle Theme', function() {
  toggleTheme();
});

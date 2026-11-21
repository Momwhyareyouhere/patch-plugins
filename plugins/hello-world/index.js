patch.commands.register('hello-world.say-hello', 'Hello World', function() {
  if (patch.ui && typeof patch.ui.showNotification === 'function') {
    patch.ui.showNotification('Hello, World!');
  } else {
    patch.ui.addStatus('Hello, World!');
  }
});

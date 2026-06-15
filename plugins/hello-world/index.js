patch.commands.register('hello-world.say-hello', 'Hello World', function() {
  patch.ui.showNotification('Hello, World!');
});

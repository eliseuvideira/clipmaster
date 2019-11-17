const { ipcRenderer } = require('electron');

ipcRenderer.on('show-notification', (event, title, body) => {
  new Notification(title, { body });
});

const { app, Menu, Tray } = require('electron');
const path = require('path');

/** @type {Electron.Tray | null} */
let tray = null;

app.on('ready', () => {
  if (app.dock) {
    app.dock.hide();
  }

  tray = new Tray(path.join(__dirname, getIcon()));

  if (process.platform === 'win32') {
    tray.on('click', tray.popUpContextMenu);
  }

  const menu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click() {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Clipmaster');

  tray.setContextMenu(menu);
});

/** @type {() => string} */
const getIcon = () => {
  if (process.platform === 'win32') {
    return 'icon-light@2x.ico';
  }
  if (process.platform === 'darwin') {
    return 'icon-dark.png';
  }
  return 'Icon-light@2x.png';
};

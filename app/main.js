const { app, Menu, Tray, systemPreferences } = require('electron');
const path = require('path');

/** @type {Electron.Tray | null} */
let tray = null;
const clippings = [];

app.on('ready', () => {
  if (app.dock) {
    app.dock.hide();
  }

  tray = new Tray(path.join(__dirname, getIcon()));

  if (process.platform === 'win32') {
    tray.on('click', tray.popUpContextMenu);
  }

  updateMenu();

  tray.setToolTip('Clipmaster');
});

/** @type {() => string} */
const getIcon = () => {
  if (process.platform === 'win32') {
    return 'icon-light@2x.ico';
  }
  if (process.platform === 'darwin') {
    if (systemPreferences.isDarkMode()) {
      return 'Icon-light.png';
    }
    return 'icon-dark.png';
  }
  return 'Icon-light@2x.png';
};

const updateMenu = () => {
  const menu = Menu.buildFromTemplate([
    {
      label: 'Create New Clipping',
      click() {
        null;
      },
    },
    { type: 'separator' },
    ...clippings.map((clipping) => ({ label: clipping })),
    { type: 'separator' },
    {
      label: 'Quit',
      click() {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(menu);
};

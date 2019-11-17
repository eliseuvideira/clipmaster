const { app, Menu, Tray, systemPreferences, clipboard } = require('electron');
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
      accelerator: 'CommandOrControl+Shift+C',
      click() {
        addClipping();
      },
    },
    { type: 'separator' },
    ...clippings.map(createClippingMenuItem),
    { type: 'separator' },
    {
      label: 'Quit',
      accelerator: 'CommandOrControl+Q',
      click() {
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(menu);
};

const addClipping = () => {
  const clipping = clipboard.readText();
  clippings.push(clipping);
  updateMenu();
  return clipping;
};

const createClippingMenuItem = (clipping, index) => {
  return {
    label: clipping,
    click() {
      clipboard.writeText(clipping);
    },
    accelerator: `CommandOrControl+${index}`,
  };
};

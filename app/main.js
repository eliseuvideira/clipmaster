const {
  app,
  Menu,
  Tray,
  systemPreferences,
  clipboard,
  globalShortcut,
  BrowserWindow,
} = require('electron');
const path = require('path');

/** @type {Electron.Tray | null} */
let tray = null;
const clippings = [];
let browserWindow = null;

app.on('ready', () => {
  if (app.dock) {
    app.dock.hide();
  }

  browserWindow = new BrowserWindow({ show: false });

  browserWindow.loadURL(`file://${__dirname}/index.html`);

  tray = new Tray(path.join(__dirname, getIcon()));

  tray.setPressedImage(path.join(__dirname, 'Icon-light.png'));

  if (process.platform === 'win32') {
    tray.on('click', tray.popUpContextMenu);
  }

  const activationShortcut = globalShortcut.register(
    'CommandOrControl+Option+C',
    () => {
      tray.popUpContextMenu();
    },
  );

  if (!activationShortcut) {
    console.error('Global activation shortcut failed to register');
  }

  const newClippingShortcut = globalShortcut.register(
    'CommandOrControl+Shift+C',
    () => {
      const clipping = addClipping();
      if (clipping) {
        browserWindow.webContents.send(
          'show-notification',
          'Clipping Added',
          clipping,
        );
      }
    },
  );

  if (!newClippingShortcut) {
    console.error('Global activation shortcut failed to register');
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
    ...clippings.slice(0, 10).map(createClippingMenuItem),
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
  if (clippings.includes(clipping)) {
    return;
  }
  clippings.unshift(clipping);
  updateMenu();
  return clipping;
};

const createClippingMenuItem = (clipping, index) => {
  return {
    label: clipping.length > 20 ? clipping.slice(0, 20) + '...' : clipping,
    click() {
      clipboard.writeText(clipping);
    },
    accelerator: `CommandOrControl+${index}`,
  };
};

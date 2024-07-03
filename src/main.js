const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

// Function to create the main application window
function createWindow() {
  // Create a new browser window with specified dimensions and web preferences
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load the initial HTML file into the window
  mainWindow.loadFile('index.html');

  // Create a custom menu template
  const menu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'Home',
          click() {
            mainWindow.loadFile('index.html'); // Load Home page
          }
        },
        {
          label: 'Word of the Day',
          click() {
            mainWindow.loadFile('wordOfTheDay.html'); // Load Word of the Day page
          }
        },
        {
          type: 'separator' // Separator for menu items
        },
        {
          label: 'Exit',
          click() {
            app.quit(); // Exit the application
          }
        }
      ]
    }
  ]);

  // Set the application menu to the created menu template
  Menu.setApplicationMenu(menu);
}

// Event listener for when Electron has finished initialization
app.on('ready', createWindow);

// Event listener for when all windows are closed
app.on('window-all-closed', () => {
  // Quit the application if not on macOS (Darwin)
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Event listener for when the application is activated (e.g., clicking the dock icon on macOS)
app.on('activate', () => {
  // Create a new window if no windows are open
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

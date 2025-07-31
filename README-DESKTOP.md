# Vikas Milk Center Pro - Desktop Application

🥛 **Complete Offline Desktop ERP for Milk Distribution Business**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation & Setup

1. **Clone/Download the project**
   ```bash
   git clone <repository-url>
   cd vikas-milk-center-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Development Mode**
   ```bash
   # Start web development server and Electron together
   npm run electron:dev
   
   # Or run separately:
   npm run dev          # Start web server
   npm run electron     # Start Electron (in another terminal)
   ```

4. **Build Desktop Application**
   ```bash
   # Build for current platform
   node build-desktop.js
   
   # Build for specific platform
   node build-desktop.js windows
   node build-desktop.js mac
   node build-desktop.js linux
   
   # Build for all platforms
   node build-desktop.js all
   ```

## 📁 Project Structure

```
vikas-milk-center-pro/
├── electron/                 # Electron main process files
│   ├── main.js              # Entry point
│   ├── preload.js           # Preload script for API exposure
│   ├── window-manager.js    # Window management
│   ├── app-lifecycle.js     # App lifecycle management
│   ├── api-manager.js       # IPC API management
│   └── api/                 # API modules
├── src/                     # React application source
│   ├── components/          # UI components
│   ├── pages/              # Application pages
│   ├── services/           # Business logic & services
│   │   ├── database/       # Offline database (Dexie)
│   │   └── ElectronService.ts # Electron integration
│   └── types/              # TypeScript definitions
├── build/                  # Build assets (icons, splash)
├── dist/                   # Web build output
├── dist_electron/          # Desktop build output
├── electron-builder.json   # Electron Builder configuration
└── build-desktop.js       # Build script
```

## 🔧 Features

### Core Business Features
- ✅ **Customer Management** - Add, edit, manage customers
- ✅ **Product Catalog** - Product management with categories
- ✅ **Order Entry** - Create and manage orders
- ✅ **Invoice Generator** - GST compliant invoices with PDF export
- ✅ **Payment Tracking** - Record and track payments
- ✅ **Delivery Sheets** - Editable delivery challans
- ✅ **Stock Management** - Inventory tracking
- ✅ **Reports & Analytics** - Business intelligence dashboard
- ✅ **Customer Ledger** - Complete payment history

### Technical Features
- 🔌 **100% Offline** - Works without internet after installation
- 💾 **Local Database** - Uses IndexedDB with Dexie for data storage
- 📱 **Responsive Design** - Works on all screen sizes
- 🎨 **Modern UI** - Clean, professional interface
- 📊 **Export Capabilities** - PDF, Excel export functionality
- 🔐 **Data Security** - Local data encryption
- 🔄 **Data Backup/Restore** - Import/Export business data

## 🖥️ Building Desktop Applications

### Windows (.exe)
```bash
node build-desktop.js windows
```
**Output**: `dist_electron/Vikas Milk Center Pro-[version]-win.exe`

### macOS (.dmg)
```bash
node build-desktop.js mac
```
**Output**: `dist_electron/Vikas Milk Center Pro-[version]-mac.dmg`

### Linux (.AppImage)
```bash
node build-desktop.js linux  
```
**Output**: `dist_electron/Vikas Milk Center Pro-[version]-linux.AppImage`

## 📦 Distribution

### For End Users

1. **Download** the appropriate installer for your platform
2. **Install** by running the downloaded file
3. **Launch** "Vikas Milk Center Pro" from your applications
4. **Setup** your business data on first run

### Installation Features
- ✅ Desktop shortcut creation
- ✅ Start menu integration (Windows)
- ✅ Auto-updater support
- ✅ Uninstaller included
- ✅ Data persistence across updates

## 💾 Data Management

### Offline Storage
- **Database**: IndexedDB with Dexie
- **Location**: `%APPDATA%/VikasGroup/MilkCenter` (Windows)
- **Backup**: Export/Import functionality built-in

### Initial Data
The application automatically creates sample data on first run:
- Sample customers and products
- Default categories and areas
- Template invoices and reports

### Data Backup
```javascript
// Export all data
await dataMigration.exportAllData();

// Import data from backup
await dataMigration.importAllData();
```

## 🔧 Configuration

### Electron Builder Configuration
Located in `electron-builder.json`:

```json
{
  "appId": "com.vikasgroup.milkcenter",
  "productName": "Vikas Milk Center Pro",
  "directories": {
    "output": "dist_electron"
  },
  "win": {
    "target": "nsis",
    "icon": "build/icon.ico"
  },
  "mac": {
    "target": "dmg", 
    "icon": "build/icon.icns"
  },
  "linux": {
    "target": "AppImage",
    "icon": "build/icon.png"
  }
}
```

### Environment Variables
- `NODE_ENV`: Set to 'development' or 'production'
- `ELECTRON_IS_DEV`: Automatically detected

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Electron Won't Start**
   ```bash
   # Check if all dependencies are installed
   npm run postinstall
   ```

3. **Icon Missing**
   - Ensure `build/icon.png` exists
   - Check `electron-builder.json` icon paths

4. **Data Not Persisting**
   - Check browser/Electron storage permissions
   - Verify IndexedDB is enabled

### Development Tools

```bash
# Check build output
npm run build:dev

# Test Electron in development
npm run electron

# Debug with DevTools
# DevTools automatically open in development mode
```

## 📄 License & Credits

- **Application**: Vikas Group Milk Center Management System
- **Technology Stack**: Electron + React + TypeScript + Vite
- **Database**: Dexie (IndexedDB wrapper)
- **UI Framework**: Tailwind CSS + Radix UI

## 🔄 Updates

The application includes auto-updater functionality:
- Checks for updates on startup
- Downloads updates in background
- Prompts user for installation
- Maintains data during updates

## 📞 Support

For technical support or business inquiries:
- **Email**: support@vikasgroup.com
- **Documentation**: Check README files in project
- **Issues**: Create GitHub issue for bug reports

---

**🎉 Ready to Launch Your Milk Distribution Business!** 

This desktop application provides everything you need to manage your milk distribution business offline, with professional invoicing, customer management, and comprehensive reporting capabilities.
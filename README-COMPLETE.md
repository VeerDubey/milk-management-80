# Vikas Milk Center Pro - Complete Project Documentation

## 🏢 Project Overview

**Vikas Milk Center Pro** is a comprehensive milk center management system built with modern web technologies and packaged as both a web application and desktop software.

### 🛠️ Technology Stack
- **Frontend**: React 18.3.1 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Design System
- **UI Components**: Radix UI + Shadcn/ui
- **Desktop**: Electron for offline desktop app
- **State Management**: React Context + Custom Hooks
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Charts**: Chart.js + Recharts
- **PDF Generation**: jsPDF + jsPDF-AutoTable
- **Excel Export**: XLSX
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📋 Features

### Core Business Features
- **Customer Management**: Customer directory, profiles, and contact management
- **Product Management**: Product catalog, pricing, and categories
- **Order Management**: Order entry, tracking, and history
- **Invoice Generation**: Professional invoice creation with templates
- **Payment Tracking**: Payment records and outstanding dues management
- **Delivery Management**: Delivery sheets and route management
- **Stock Management**: Inventory tracking and alerts
- **Reporting**: Sales reports, customer reports, and analytics
- **Analytics Dashboard**: Business intelligence and metrics

### Technical Features
- **Offline Support**: Full offline functionality with local storage
- **Desktop App**: Electron-based Windows application
- **Responsive Design**: Mobile-friendly responsive layout
- **Dark/Light Mode**: Theme switching support
- **Multi-user Access**: Role-based access control
- **Data Export**: Excel and PDF export capabilities
- **Real-time Analytics**: Performance metrics and insights
- **Backup/Restore**: Data backup and restoration features

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm (comes with Node.js)
- Windows 10/11 (for desktop build)

### Quick Start

1. **Clone the repository**
```bash
git clone [repository-url]
cd vikas-milk-center-pro
```

2. **Install dependencies (npm only)**
```bash
# Use emergency setup to avoid installation issues
node emergency-npm-setup.js

# Or use alternative installers
node force-npm-install.js
# or
node install-npm-only.js
```

3. **Start development server**
```bash
npm run dev
```

4. **Access the application**
- Web: http://localhost:5173
- Login: Any credentials (demo mode)

### Build for Production

#### Web Application
```bash
npm run build
npm run preview  # Test production build
```

#### Windows Desktop Application
```bash
# Quick build (recommended)
./build-windows.bat

# Or manual build
npm run build
npx electron-builder --win --x64 --publish=never
```

**Desktop installer location**: `dist_electron/Vikas Milk Center Pro-[version]-win.exe`

## 📁 Project Structure

```
vikas-milk-center-pro/
├── electron/                    # Electron main process files
│   ├── main.js                 # Main electron process
│   ├── preload.js             # Preload script for security
│   ├── window-manager.js      # Window management
│   └── api/                   # Electron API handlers
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Shadcn/ui components
│   │   ├── auth/            # Authentication components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── layout/          # Layout components
│   │   └── ...              # Feature-specific components
│   ├── pages/               # Route pages
│   ├── contexts/            # React contexts for state
│   ├── services/            # Business logic services
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript type definitions
│   └── data/                # Sample/initial data
├── public/                   # Static assets
├── build/                    # Electron build assets
│   ├── icon.png             # App icon (PNG)
│   └── icon.ico             # App icon (Windows ICO)
├── scripts/                  # Build and utility scripts
└── dist_electron/           # Built desktop applications
```

## 🎨 Design System

The application uses a comprehensive design system with:

- **Color Tokens**: HSL-based semantic color system
- **Typography**: Responsive font scales
- **Spacing**: Consistent spacing tokens
- **Components**: Reusable UI components with variants
- **Dark/Light Themes**: Automatic theme switching

### Key Design Files
- `src/index.css` - Design tokens and global styles
- `tailwind.config.ts` - Tailwind configuration
- `src/components/ui/` - Base UI components

## 🔧 Configuration Files

### Package Management
- `.npmrc` - npm configuration (disables git operations)
- `package.json` - Project dependencies and scripts
- `package-lock.json` - Dependency lock file

### Build Configuration
- `vite.config.ts` - Vite build configuration
- `electron-builder.json` - Electron build configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration

### Electron Configuration
- `electron/main.js` - Main Electron process
- `electron-builder.json` - Desktop app build settings

## 📱 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run dev:electron # Start Electron development mode
```

### Building
```bash
npm run build                    # Build web application
npm run build:electron          # Build desktop application
npm run build:windows           # Build Windows installer
```

### Utilities
```bash
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Installation Fails with Git Errors
**Problem**: `error: "git clone" for "@electron/node-gyp" failed`
**Solution**: Use the emergency npm setup:
```bash
node emergency-npm-setup.js
```

#### 2. Bun Usage Errors
**Problem**: Project tries to use Bun instead of npm
**Solution**: The project is configured for npm only:
```bash
node force-npm-install.js
```

#### 3. Desktop Build Fails
**Problem**: Electron build fails on Windows
**Solution**: Use the Windows build script:
```bash
./build-windows.bat
```

#### 4. Missing Dependencies
**Problem**: Some packages not installed
**Solution**: Use fallback installer:
```bash
node fallback-install.js
```

### Debug Mode
Enable detailed debugging:
```bash
DEBUG=electron-builder npm run build:electron
```

## 🔐 Security Features

- **Content Security Policy**: Strict CSP for Electron
- **Process Isolation**: Separate main and renderer processes
- **Secure Preload**: Controlled API exposure
- **No Node Integration**: Renderer process isolation
- **Local Storage**: Encrypted local data storage

## 📊 Performance

- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Dead code elimination
- **Asset Optimization**: Image and font optimization
- **Bundle Analysis**: Built-in bundle analyzer
- **Offline Caching**: Service worker for offline support

## 🌐 Deployment Options

### Web Deployment
- Build with `npm run build`
- Deploy `dist/` folder to any static hosting
- Compatible with Vercel, Netlify, GitHub Pages

### Desktop Distribution
- Windows installer: `.exe` file
- Portable version: `-portable.exe` file
- Auto-updater ready for production

## 📝 License & Credits

- **Project**: Vikas Milk Center Pro
- **Version**: 1.0.0
- **Author**: Vikas Group
- **License**: Proprietary

## 🚀 Getting Started for Developers

1. **Fork the repository**
2. **Follow installation steps above**
3. **Make your changes**
4. **Test thoroughly**:
   ```bash
   npm run dev        # Test web version
   npm run build      # Test production build
   ./build-windows.bat # Test desktop build
   ```
5. **Submit pull request**

## 📞 Support

For issues and support:
1. Check this documentation
2. Review troubleshooting section
3. Check existing issues
4. Create new issue with details

---

**Built with ❤️ for the dairy industry**
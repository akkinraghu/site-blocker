# Site Blocker Pro - Chrome Extension

A professional website blocker Chrome extension with customizable features and scheduling capabilities.

## Features

- Block specific websites
- Customizable block page
- Schedule blocking times
- Enable/disable blocking with one click
- Beautiful and intuitive user interface
- Sync settings across devices

## Installation for Development

1. Clone this repository
```bash
git clone <repository-url>
cd site-block
```

2. Install dependencies
```bash
npm install
```

3. Build the extension
```bash
npm run build
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` folder from this project

## Usage

1. Click the extension icon in Chrome to open the popup
2. Add websites to block (e.g., facebook.com, twitter.com)
3. Create schedules for when blocking should be active
4. Customize the block page appearance
5. Toggle the extension on/off using the switch

## Publishing to Chrome Web Store

1. Create a developer account at the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Compress the `dist` directory into a ZIP file
3. Follow the Chrome Web Store's submission process
4. Set your desired pricing model (free, one-time payment, or subscription)

## Development

The extension is built with:
- Vanilla JavaScript
- Chrome Extension Manifest V3
- Bootstrap 5 for UI
- Webpack for building

### Project Structure

```
site-block/
├── manifest.json        # Extension manifest
├── background.js       # Service worker for blocking
├── popup.html         # Extension popup UI
├── popup.js          # Popup functionality
├── block.html       # Blocked site page
├── webpack.config.js # Build configuration
└── package.json     # Project dependencies
```

### Adding New Features

1. The extension is designed to be modular and extensible
2. Background script handles all blocking logic
3. Popup handles user interaction and settings
4. Block page is customizable and shows remaining time

## Monetization Features

The extension is prepared for monetization through:
1. Chrome Web Store payments
2. Premium features (can be added)
3. Subscription model support (can be implemented)

## License

MIT License - See LICENSE file for details

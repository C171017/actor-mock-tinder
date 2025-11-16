# Actor Tinder 🎬

A Tinder-style card swiping web application for browsing and rating actors. Swipe through actor profiles with multiple images, like or pass on your favorites, and track your preferences.

## Features

- 🎴 **Tinder-style Swiping**: Swipe left to pass or right to like actors
- 🖼️ **Multiple Images**: Each actor has 5 images that can be swiped through horizontally
- 🌍 **Multi-language Support**: Available in Simplified Chinese (简体中文), Traditional Chinese (繁體中文), and English
- 📊 **Stats Tracking**: View counts of liked and passed actors
- 🎨 **Smooth Animations**: Beautiful card animations with rotation and scaling effects
- 📱 **Touch & Mouse Support**: Works seamlessly on both desktop and mobile devices
- 🔄 **Reset Functionality**: Start over and browse through actors again

## Tech Stack

- **React 18.2.0** - UI framework
- **Vite 5.0.8** - Build tool and dev server
- **Tailwind CSS 4.1.17** - Styling
- **React DOM 18.2.0** - React rendering

## Project Structure

```
Actor tinder/
├── public/
│   └── actors/          # Actor images (290 JPG files)
├── src/
│   ├── components/
│   │   ├── ActorCard.jsx        # Individual actor card component
│   │   ├── ActorCard.css        # Card styling
│   │   ├── LanguageSwitcher.jsx # Language selection component
│   │   └── LanguageSwitcher.css # Language switcher styling
│   ├── data/
│   │   └── actors.js            # Actor data (58 actors)
│   ├── hooks/
│   │   └── useTranslation.js    # Translation hook for i18n
│   ├── App.jsx                   # Main application component
│   ├── App.css                   # App styling
│   ├── main.jsx                  # Application entry point
│   ├── index.css                 # Global styles
│   └── translations.js           # Translation strings
├── index.html                    # HTML template
├── package.json                  # Dependencies
└── vite.config.js               # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Actor tinder"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5174` (or the next available port).

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Swipe Cards**: 
   - Drag cards left to pass or right to like
   - Cards show visual indicators when swiping

2. **Browse Images**:
   - Swipe horizontally on the actor's image to see more photos
   - Click the dots at the bottom of the image to jump to a specific photo

3. **Change Language**:
   - Use the language selector in the header to switch between languages
   - Your preference is saved in localStorage

4. **View Stats**:
   - See how many actors you've liked (❤️) and passed (👎) in the header

5. **Reset**:
   - After viewing all actors, click "Start Over" to reset and browse again

## Actor Data

The application includes 58 actors from various countries and industries:
- Hollywood actors (Chris Evans, Henry Cavill, Ryan Gosling, etc.)
- Korean actors (Lee Min Ho, Park Seo Joon, Song Kang, etc.)
- Chinese actors (Xiao Zhan, Wang Yibo, Yang Yang, etc.)
- Japanese actors (Kento Yamazaki, Takeru Satoh, etc.)
- Thai actors (Bright Vachirawit, Win Metawin, etc.)
- And more!

Each actor has:
- Name (with Chinese nickname when applicable)
- Age
- Bio (translated based on selected language)
- 5 images showcasing their physique

## Supported Languages

- **简体中文** (Simplified Chinese) - Default
- **繁體中文** (Traditional Chinese)
- **English**

Language preference is automatically saved to localStorage and persists across sessions.

## Development

### Key Components

- **App.jsx**: Manages application state, handles swipe actions, and renders the main UI
- **ActorCard.jsx**: Handles individual card rendering, drag interactions, and image swiping
- **LanguageSwitcher.jsx**: Provides language selection dropdown
- **useTranslation.js**: Custom hook for internationalization with localStorage persistence

### Adding New Actors

To add new actors, edit `src/data/actors.js` and add a new actor object:

```javascript
{
  id: 59,
  name: "Actor Name",
  age: 30,
  bioKey: "actor.name",
  images: [
    "/actors/Actor_Name_physique_1.jpg",
    "/actors/Actor_Name_physique_2.jpg",
    // ... up to 5 images
  ],
  chineseNickname: "中文昵称" // Optional
}
```

Then add the corresponding bio translations in `src/translations.js` for each language.

### Adding New Languages

1. Add the language code to `SUPPORTED_LANGUAGES` in `src/hooks/useTranslation.js`
2. Add translations object in `src/translations.js`
3. Add language name mapping in `src/components/LanguageSwitcher.jsx`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is private and not licensed for public use.

## Contributing

This is a private project. Contributions are not currently accepted.

---

Made with ❤️ using React and Vite


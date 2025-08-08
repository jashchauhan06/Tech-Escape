# Tech Escape - Next.js Version

A digital treasure hunt game built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎮 Interactive challenge system
- 👥 Team registration and login
- ⏱️ Countdown timer
- 💡 Hint system
- 📊 Progress tracking
- 🎨 Modern UI with animations
- 🔍 Hidden flag challenges

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tech-escape-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Game Structure

### Authentication
- Team registration with leader, email, and team size
- Team login with saved progress
- Demo mode for quick testing

### Challenges
1. **Hidden Flag Challenge** - Find the hidden flag in the interface
2. **Binary & Hex Challenge** - Number system conversions
3. **Programming Logic** - Basic programming problems

### Features
- **Progress Tracking** - Visual progress bar and challenge nodes
- **Hint System** - Limited hints per game session
- **Timer** - 15-minute countdown timer
- **Responsive Design** - Works on desktop and mobile

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom CSS variables
- **Icons**: Font Awesome
- **Fonts**: Inter and Fira Code (Google Fonts)

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and CSS variables
│   ├── layout.tsx           # Root layout with fonts and metadata
│   └── page.tsx             # Main page component
├── components/
│   ├── AuthContainer.tsx    # Login/registration forms
│   ├── GameContainer.tsx    # Game interface
│   ├── Header.tsx           # Header with timer and logo
│   └── MessageContainer.tsx # Notification system
└── hooks/
    └── useGameState.ts      # Game state management
```

## Customization

### Colors
The game uses CSS custom properties for theming. Main colors are defined in `globals.css`:

```css
:root {
  --primary-color: #0066cc;
  --accent-color: #00aaff;
  --success-color: #00cc66;
  --warning-color: #ff9900;
  --danger-color: #ff3333;
}
```

### Adding New Challenges
To add new challenges, modify the `riddles` array in `GameContainer.tsx`:

```typescript
const riddles = [
  {
    id: 1,
    question: 'Your challenge question here',
    answer: 'correct_answer',
    hint: 'Helpful hint for players'
  }
]
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
Build the project for production:
```bash
npm run build
npm start
```

## Hidden Features

- Click the IEEE logo to reveal a hidden flag
- Check the browser console for additional clues
- Inspect page elements for hidden content

## License

This project is for educational purposes and IEEE SIT events.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Tech Escape** - Digital Treasure Hunt by IEEE SIT

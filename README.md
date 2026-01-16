<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CULTIV - Cultivate Discipline

A beautiful, interactive botanical habit tracker that grows your personal development through consistent habit tracking. Watch your digital garden flourish as you cultivate discipline and build meaningful habits.

## 🌱 Live Demo

Visit the live application: **[https://ram-charan-boddupally.github.io/cultiv/](https://ram-charan-boddupally.github.io/cultiv/)**

## 📋 About

CULTIV is a modern habit tracking application with a botanical theme. It combines the power of habit formation with visual progression through a unique tree and garden ecosystem:

- **Track Habits**: Monitor daily, weekly, or custom-scheduled habits
- **Tree Growth**: Watch your personal progress tree grow as you complete habits
- **Yearly Garden**: Visualize your yearly habit completion patterns
- **Calendar Heatmap**: See your consistency at a glance with an interactive calendar
- **Harvest Spectrum**: Experience color-coded feedback on your habit health
- **Multiple Categories**: Organize habits by tags (Fitness, Mind, Work, Social, Nature, etc.)

## 🚀 Tech Stack

- **Framework**: React 19.2.3 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: Modern CSS
- **State Management**: React Hooks
- **Storage**: Browser-based Database

## ✨ Features

### Habit Management
- Create and manage multiple habits
- Set custom schedules (daily, weekly, or custom intervals)
- Add descriptions and organize with tags
- Track completion history with timestamps
- Add notes and comments to completions

### Visualization
- **Tree Component**: Visual representation of habit health
- **Calendar Heatmap**: 365-day completion calendar
- **Yearly Garden**: Garden visualization of your yearly progress
- **Today Status**: Quick view of today's habits and completions
- **Habit Cards**: Individual habit tracking cards with completion buttons

### Data Persistence
- All data persists locally in browser storage
- No backend required
- Complete privacy - your data stays on your device

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd cultiv
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

## 📦 Project Structure

```
cultiv/
├── components/          # React components
│   ├── CalendarHeatmap.tsx    # Yearly calendar view
│   ├── HabitCard.tsx          # Individual habit cards
│   ├── TodayStatus.tsx        # Today's status overview
│   ├── Tree.tsx               # Tree visualization
│   └── YearlyGarden.tsx       # Garden view
├── services/           # Service layer
│   └── db.ts          # Database operations
├── utils/             # Utility functions
│   ├── date.utils.ts  # Date helpers
│   └── tree.utils.ts  # Tree calculation logic
├── App.tsx            # Main application component
├── index.tsx          # React root entry point
├── types.ts           # TypeScript type definitions
├── vite.config.ts     # Vite configuration
├── tsconfig.json      # TypeScript configuration
├── package.json       # Project dependencies
└── index.html         # HTML template
```

## 📖 Usage

1. **Create a Habit**:
   - Click the "Add Habit" button
   - Fill in habit name, description, and tags
   - Set the schedule (daily, weekly, or custom)
   - Submit to create

2. **Track Progress**:
   - Mark habits as completed in the home view
   - Add optional notes/comments
   - Watch your tree grow as you maintain consistency

3. **View Analytics**:
   - Switch to "Yearly Garden" to see full-year progress
   - Check calendar heatmap for consistency patterns
   - Monitor individual habit details

## 🎨 Habit Categories

Default categories include:
- **Fitness**: Physical activity and health
- **Mind**: Mental wellness and learning
- **Work**: Professional development
- **Social**: Relationships and connections
- **Nature**: Environmental and outdoor activities

Create custom tags as needed!

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve CULTIV.

## 📝 License

This project is open source and available under the MIT License.

## 🌟 Development Notes

The application uses:
- **React 19** with modern hooks for state management
- **TypeScript** for type safety
- **Vite** for fast development and optimized builds
- **gh-pages** for easy GitHub Pages deployment

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy to GitHub Pages

## 📧 Support

For questions or feedback, please open an issue on the GitHub repository.

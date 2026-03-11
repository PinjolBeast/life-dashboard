# To-Do List Life Dashboard - Specification

## 1. Project Overview

**Project Name:** Life Dashboard  
**Type:** Single-page web application (dashboard/homepage)  
**Core Functionality:** A personal dashboard that displays time, a to-do list, focus timer, and quick links to favorite websites. All data persists in Local Storage.  
**Target Users:** Anyone who wants a simple, distraction-free homepage to organize their day.

---

## 2. UI/UX Specification

### Layout Structure

**Page Sections:**
- **Header:** Greeting area with custom name and time-based message
- **Main Content (3-column grid on desktop, stacked on mobile):**
  - Left: Focus Timer
  - Center: To-Do List
  - Right: Quick Links
- **Footer:** Minimal, shows current date

**Grid/Flex Layout:**
- CSS Grid for main layout: `grid-template-columns: 1fr 1.5fr 1fr` on desktop
- Flexbox for internal component layouts
- Gap: 24px between sections

**Responsive Breakpoints:**
- Desktop: ≥1024px (3-column layout)
- Tablet: 768px-1023px (2-column, timer and links stack)
- Mobile: <768px (single column, stacked vertically)

### Visual Design

**Color Palette:**

*Light Mode:*
- Background: `#f8f7f4` (warm off-white)
- Card Background: `#ffffff`
- Primary Text: `#2d3436`
- Secondary Text: `#636e72`
- Accent (Primary): `#e17055` (coral/terracotta)
- Accent (Secondary): `#00b894` (mint green for success/completed)
- Border/Divider: `#dfe6e9`
- Timer Active: `#fdcb6e` (warm yellow)
- Danger: `#d63031`

*Dark Mode:*
- Background: `#1a1a2e`
- Card Background: `#16213e`
- Primary Text: `#eaeaea`
- Secondary Text: `#a0a0a0`
- Accent (Primary): `#ff7675` (coral)
- Accent (Secondary): `#55efc4` (mint)
- Border/Divider: `#2d3a5f`
- Timer Active: `#ffeaa7`

**Typography:**
- Font Family: `'Outfit', sans-serif` (Google Fonts)
- Headings: 
  - H1 (Greeting): 2.5rem, weight 600
  - H2 (Section titles): 1.25rem, weight 500
- Body: 1rem, weight 400
- Small/Time: 0.875rem

**Spacing System:**
- Base unit: 8px
- Card padding: 24px
- Section gap: 24px
- Element spacing: 16px
- Button padding: 12px 20px

**Visual Effects:**
- Card shadow: `0 4px 20px rgba(0,0,0,0.08)`
- Hover lift: `transform: translateY(-2px)` with shadow increase
- Border radius: 16px for cards, 8px for buttons/inputs
- Transitions: 0.3s ease for all interactive elements

### Components

**1. Greeting Header**
- Large greeting text ("Good morning/afternoon/evening, [Name]!")
- Custom name can be set via settings icon
- Current time display (HH:MM:SS, updates every second)
- Current date display (Day, Month Date, Year)
- Settings icon (gear) to edit name

**2. Focus Timer (Pomodoro)**
- Large circular timer display (MM:SS format)
- Default: 25 minutes
- Configurable duration (15, 25, 30, 45, 60 minutes)
- States: Idle, Running, Paused
- Buttons: Start, Pause, Reset
- Visual feedback: Pulsing glow when active
- Audio notification when timer completes (optional beep)

**3. To-Do List**
- Input field with "Add task..." placeholder
- Add button (+ icon)
- Task list with checkboxes
- Each task shows:
  - Checkbox (circle style)
  - Task text
  - Edit button (pencil icon)
  - Delete button (trash icon)
- Completed tasks: strikethrough text, muted color
- Empty state message when no tasks
- "Clear completed" button when there are completed tasks

**4. Quick Links**
- Predefined default links: Google, YouTube, GitHub, Gmail
- "Add link" button
- Each link is a card/button with:
  - Favicon (or first letter as avatar)
  - Website name
  - Delete button (small x)
- Modal or inline form to add new link (URL + Name)

**5. Settings Modal**
- Overlay modal for settings
- Custom name input field
- Pomodoro duration dropdown
- Toggle for Light/Dark mode
- Save and Cancel buttons

---

## 3. Functionality Specification

### Core Features

**Time & Greeting:**
- Real-time clock updating every second
- Greeting changes based on time of day:
  - 5:00-11:59 → "Good morning"
  - 12:00-16:59 → "Good afternoon"
  - 17:00-20:59 → "Good evening"
  - 21:00-4:59 → "Good night"
- Date displayed in format: "Monday, January 15, 2024"

**Focus Timer:**
- Default 25-minute countdown
- Configurable to: 15, 25, 30, 45, 60 minutes
- Start: begins countdown
- Pause: freezes countdown
- Reset: returns to initial duration
- When timer reaches 0:00, show alert/modal, auto-reset option

**To-Do List:**
- Add task: Enter text, press Enter or click Add
- Edit task: Click edit icon, inline edit mode
- Complete task: Click checkbox
- Delete task: Click delete icon
- Prevent duplicate tasks (case-insensitive check)
- Sort: Auto-sort incomplete tasks to top, completed to bottom
- Persistence: All tasks saved to Local Storage

**Quick Links:**
- Default links pre-populated on first load
- Add custom link: Enter URL and name
- Delete link: Click X on link card
- Open link: Click link card, opens in new tab
- Persistence: Links saved to Local Storage

**Local Storage Keys:**
- `lifedashboard_name`: User's custom name
- `lifedashboard_tasks`: Array of task objects
- `lifedashboard_links`: Array of link objects
- `lifedashboard_timerDuration`: Timer duration in minutes
- `lifedashboard_theme`: "light" or "dark"

### User Interactions

- All buttons have hover/active states
- Form inputs have focus states
- Smooth transitions between states
- Keyboard support: Enter to submit forms

### Edge Cases

- Empty task input: Prevent adding
- Duplicate task: Show warning, prevent adding
- Invalid URL for quick link: Validate and show error
- Timer running when page refreshes: Timer resets (simple version)
- Very long task text: Truncate with ellipsis

---

## 4. Acceptance Criteria

### Visual Checkpoints
- [ ] Page loads with warm, inviting aesthetic
- [ ] All three main sections visible on desktop
- [ ] Responsive layout works on mobile
- [ ] Dark mode toggle works correctly
- [ ] Animations are smooth (hover effects, transitions)

### Functional Checkpoints
- [ ] Clock updates every second
- [ ] Greeting changes appropriately based on time
- [ ] Custom name can be set and persists after refresh
- [ ] Timer counts down correctly
- [ ] Timer can be started, paused, and reset
- [ ] Timer duration can be changed
- [ ] Tasks can be added, edited, completed, deleted
- [ ] Tasks persist after page refresh
- [ ] Duplicate tasks are prevented
- [ ] Quick links can be added and deleted
- [ ] Quick links open in new tabs
- [ ] Quick links persist after refresh
- [ ] Theme preference persists after refresh

---

## 5. Optional Challenges (3 Selected)

1. **Light/Dark mode** - Implemented with toggle
2. **Custom name in greeting** - Implemented via settings
3. **Change Pomodoro time** - Implemented with dropdown

---

## 6. File Structure

```
c:/kiro/revou/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── SPEC.md
```


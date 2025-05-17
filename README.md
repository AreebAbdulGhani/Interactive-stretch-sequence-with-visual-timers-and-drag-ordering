# StretchFlow Interactive

![StretchFlow App](https://i.ibb.co/7nQMRyL/stretchflow-preview.jpg)

An interactive web application for creating and following personalized stretch routines with visual timers and drag-to-reorder functionality. This project was created for the CodeCircuit Hackathon.

## 🌟 Features

- **Drag and Drop Sequence Builder**: Easily rearrange stretches with a smooth, responsive interface
- **Visual Timer Animations**: Beautiful, animated countdown timers for each stretch
- **Mobile-Responsive Design**: Works seamlessly on all devices
- **Premium Visual Effects**: Floating animations and decorative elements for a polished experience
- **Save and Load Routines**: Create your perfect stretch sequence and reload it anytime
- **Quick Start Mode**: Begin with a pre-configured routine
- **Benefits & Tips**: Learn about each stretch's benefits while you exercise

## 🚀 Tech Stack

- **React.js** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Beautiful DnD** - Drag and drop functionality
- **GSAP** - Animations
- **Zustand** - State management

## 📋 Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/AreebAbdulGhani/StretchFlow-Interactive.git
cd StretchFlow-Interactive
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173/
```

## 🚀 Building for Production

To create a production build:

```bash
npm run build
```

The build will be available in the `dist` directory.

## 🌐 Deployment

This application is configured for GitHub Pages deployment. After pushing to GitHub, you can set up GitHub Pages to serve from the `/dist` folder.

## 🧠 Project Structure

```
/src
  /components      # UI components
  /hooks           # Custom React hooks
  /store           # Zustand state management
  /assets          # Images and static assets
  /styles          # CSS files
  App.jsx          # Main application component
  main.jsx         # Application entry point
```

## 📱 Usage

1. **Create a Routine**: Drag and drop stretches to build your sequence
2. **Start the Routine**: Click "Start Sequence" to begin your stretching session
3. **Follow Along**: Visual timers will guide you through each stretch
4. **Modify Anytime**: Return to edit mode to adjust your routine

## 👤 Author

- **Areeb Abdul Ghani**
  - [LinkedIn](https://www.linkedin.com/in/areeb-abdul-ghani-aaa46a1b7/)
  - [Twitter/X](https://x.com/AreebAbdulGhan1)

## 📄 License

This project is licensed under the MIT License.

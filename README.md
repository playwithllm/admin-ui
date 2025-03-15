# PlaywithLLM Admin UI

A React administration dashboard for managing LLM API access, monitoring usage, and handling user requests.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## Overview

PlaywithLLM Admin UI is a comprehensive administration interface built with React and TypeScript. It provides a dashboard for managing API keys, monitoring requests, analyzing usage statistics, and tracking costs.

## Features

- **Dashboard:** Overview of key metrics and performance indicators
- **API Key Management:** Create, view, and revoke API keys
- **Usage Monitoring:** Track token usage and request metrics
- **Cost Analysis:** View cost breakdowns by day, model, or API key
- **Request Monitoring:** Review and analyze API requests
- **Documentation:** Built-in API documentation
- **Authentication:** Secure user login and registration

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **UI Components:** MUI
- **State Management:** React Context API
- **Routing:** React Router DOM
- **API Communication:** Axios, Socket.io
- **Data Visualization:** Recharts
- **Styling:** Emotion/styled-components
- **Authentication:** JWT-based (backend implementation)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/playwithllm/admin-ui.git
   cd admin-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

### Environment Setup

1. Create a `.env` file in the root directory based on the `.env.example` file:
   ```bash
   cp .env.example .env
   ```

2. Update the environment variables in the `.env` file as needed:
   ```
   VITE_API_URL=http://localhost:4000
   VITE_WS_URL=ws://localhost:4000
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Open your browser and navigate to http://localhost:3030

## Available Scripts

In the project directory, you can run:

- `npm run dev` - Runs the app in development mode on http://localhost:3030
- `npm run build` - Builds the app for production to the `dist` folder
- `npm run preview` - Previews the production build locally
- `npm run lint` - Lints the codebase for potential errors
- `npm run prod` - Builds and previews the production app

## Project Structure

```
src/
  ├── assets/         # Static assets like images
  ├── components/     # Reusable UI components
  ├── context/        # React Context providers
  ├── hooks/          # Custom React hooks
  ├── pages/          # Application pages
  ├── theme/          # Theme configuration
  ├── types/          # TypeScript type definitions
  ├── utils/          # Utility functions
  ├── App.tsx         # Main app component
  └── main.tsx        # Application entry point
```

## API Documentation

API documentation is available within the application through the Documentation page. It includes:

- Authentication instructions
- Available endpoints
- Request/response formats
- Rate limiting information

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

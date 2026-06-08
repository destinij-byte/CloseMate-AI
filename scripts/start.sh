#!/bin/bash

# Install dependencies if node_modules don't exist
if [ ! -d "backend/node_modules" ]; then
  echo "Installing backend dependencies..."
  npm install --prefix backend
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install --prefix frontend
fi

# Run both backend and frontend in development mode
# Note: In a production environment, you'd build and serve.
# For Replit dev, this is convenient.
npm run dev --prefix backend & npm run dev --prefix frontend

#!/bin/bash
cd /app

echo "Node version:"
node -v

echo "Installing dependencies..."
npm install

echo "Starting app"
npm start

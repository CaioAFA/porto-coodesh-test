#!/bin/bash
cd /app

echo "Node version:"
node -v

echo "Installing dependencies..."
npm install

echo "Starting Script"
npm run feed-database

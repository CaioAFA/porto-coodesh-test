#!/bin/bash
cd /app

echo "Node version:"
node -v

echo "Installing dependencies..."
npm install

pwd

echo "Starting Script"
npm run delete-collection

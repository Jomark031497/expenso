#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 5

# Run migrations
echo "Running migrations..."
pnpm drizzle-kit migrate

# Start the application
echo "Starting the application..."
pnpm dev
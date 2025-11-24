#!/bin/bash

echo "🗑️  Resetting database..."
npx prisma db push --force-reset

echo "🌱 Seeding database..."
npm run db:seed

echo "✅ Database reset and seeded successfully!"
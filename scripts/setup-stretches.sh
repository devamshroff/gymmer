#!/bin/bash

echo "Setting up stretches for routine builder..."
echo ""

echo "Step 1: Adding muscle_groups column to stretches table..."
npx tsx scripts/add-stretch-muscle-groups.ts

echo ""
echo "Step 2: Seeding stretches database with 20 stretches..."
npx tsx scripts/seed-stretches.ts

echo ""
echo "✅ Setup complete! You can now use stretches in your routine builder."

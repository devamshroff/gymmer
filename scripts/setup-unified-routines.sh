#!/bin/bash

echo "Setting up unified routines system..."
echo ""

echo "Step 1: Migrating to unified routines table..."
npx tsx scripts/migrate-to-unified-routines.ts

echo ""
echo "Step 2: Importing JSON workout plans..."
npx tsx scripts/import-json-routines.ts

echo ""
echo "✅ Setup complete! All routines are now in the database."
echo ""
echo "You can now:"
echo "  - View all routines on the home page"
echo "  - Create new custom routines"
echo "  - Import more routines from JSON files"

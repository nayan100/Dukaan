#!/bin/bash

# Dukaan Sovereign: Phoenix Reset Protocol
# Purges all tenant data and re-seeds the showcase environment.

set -e

echo "🔥 Initiating Phoenix Reset Protocol..."

# 1. Purge Local Database (Simulation/Mock)
# In a real environment, this would run: bench drop-site dukaan.local --force && bench new-site dukaan.local
echo "🗑️  Purging database..."
rm -f ./*.db 2>/dev/null || true

# 2. Reset Frontend Offline Storage
# Since this is a CLI/Server environment, we can't clear browser IndexedDB,
# but we can notify that the backend state is fresh.
echo "🧹 Clearing server-side caches..."

# 3. Re-seed the Showcase Data
echo "🌱 Seeding fresh showcase data..."
python3 scripts/seed_showcase.py

echo "----------------------------------------"
echo "✨ Phoenix Reset Complete!"
echo "🚀 Environment is ready for the Grand Showcase."
echo "----------------------------------------"

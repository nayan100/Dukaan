#!/bin/bash

# conductor-sync.sh
# Helper script to create an Obsidian note placeholder for a Conductor task.

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ./conductor-sync.sh <track_id> <task_name>"
    exit 1
fi

TRACK_ID=$1
TASK_NAME=$2
DATE=$(date +"%Y-%m-%d")

# Define target folder based on track
TARGET_FOLDER="conductor/tracks/$TRACK_ID"

if [ ! -d "$TARGET_FOLDER" ]; then
    echo "Error: Track folder $TARGET_FOLDER does not exist."
    exit 1
fi

# Create a simple note placeholder
NOTE_PATH="$TARGET_FOLDER/${TASK_NAME// /_}.md"

cat <<EOF > "$NOTE_PATH"
---
type: task
track_id: $TRACK_ID
status: open
created: $DATE
tags: [conductor/task]
---
# Task: $TASK_NAME

## Context
- **Track:** [[$TRACK_ID]]

## Summary
Placeholder created by conductor-sync.sh

## Verification Outcome
- [ ] Automated Tests Pass
- [ ] Manual Verification Confirmed
EOF

echo "Created Obsidian note placeholder at $NOTE_PATH"

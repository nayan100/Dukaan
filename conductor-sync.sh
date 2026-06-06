#!/bin/bash

# conductor-sync.sh
# Helper script to create/manage Obsidian note placeholders for Conductor tasks.

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ./conductor-sync.sh <track_id> <task_name>"
    exit 1
fi

TRACK_ID=$1
TASK_NAME=$2
DATE=$(date +"%Y-%m-%d")

# 1. Resolve Target Folder (Search Tracks Registry and Archive)
if [ -d "conductor/tracks/$TRACK_ID" ]; then
    TARGET_FOLDER="conductor/tracks/$TRACK_ID"
elif [ -d "conductor/archive/$TRACK_ID" ]; then
    TARGET_FOLDER="conductor/archive/$TRACK_ID"
else
    echo "Error: Track folder '$TRACK_ID' not found in conductor/tracks/ or conductor/archive/."
    exit 1
fi

# 2. Sanitize Task Name for Filename
SAFE_TASK_NAME="${TASK_NAME// /_}"
NOTE_PATH="$TARGET_FOLDER/$SAFE_TASK_NAME.md"

# 3. Handle Existing Notes (Do not overwrite)
if [ -f "$NOTE_PATH" ]; then
    echo "Info: Note already exists at $NOTE_PATH. Skipping creation."
    # Future enhancement: Update status or append outcomes here
    exit 0
fi

# 4. Create Note Placeholder
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
- **Track:** [[$TRACK_ID/index|Track Index]]

## Summary
Placeholder created by conductor-sync.sh

## Verification Outcome
- [ ] Automated Tests Pass
- [ ] Manual Verification Confirmed

## Outcomes & SHAs
- (Pending implementation)
EOF

echo "Created Obsidian note placeholder at $NOTE_PATH"

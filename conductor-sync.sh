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
TEMPLATE_PATH="Templates/Conductor-Task-Template.md"
ATLAS_PATH="_ProjectAtlas.md"

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
    exit 0
fi

# 4. Atlas Lookup (Bidirectional Linking)
MOC_LINK=""
# Search in _Systems and _Components for the track link
MATCHING_MOC=$(grep -l "\[\[.*$TRACK_ID/index" _Systems/*.md _Components/*.md 2>/dev/null | head -n 1)
if [ -n "$MATCHING_MOC" ]; then
    # Extract filename without extension and path
    MOC_NAME=$(basename "$MATCHING_MOC" .md)
    MOC_DIR=$(dirname "$MATCHING_MOC")
    MOC_LINK="[[$MOC_DIR/$MOC_NAME|$MOC_NAME]]"
    echo "Info: Found matching MOC: $MOC_LINK"
fi

# 5. Use Template (Unification)
if [ -f "$TEMPLATE_PATH" ]; then
    # Use a temporary file to perform replacements to avoid echo/newline issues
    cp "$TEMPLATE_PATH" "$NOTE_PATH"
    
    # Perform variable replacement using sed with | as delimiter
    # Use -i for in-place edit
    sed -i "s|track_id: |track_id: $TRACK_ID|" "$NOTE_PATH"
    sed -i "s|<% tp.file.creation_date() %>|$DATE|g" "$NOTE_PATH"
    sed -i "s|<% tp.file.title %>|$TASK_NAME|g" "$NOTE_PATH"
    sed -i "s|<% tp.file.folder() %>|$TRACK_ID/index\|Track Index|g" "$NOTE_PATH"
    sed -i "s|<% tp.cursor() %>|Placeholder created by conductor-sync.sh|g" "$NOTE_PATH"
    
    # Inject MOC Link if found
    if [ -n "$MOC_LINK" ]; then
        # Find the line starting with - **Track:** and append the System link after it
        sed -i "/- \*\*Track:\*\*/a - **System:** $MOC_LINK" "$NOTE_PATH"
    fi
else
    echo "Warning: Template not found at $TEMPLATE_PATH. Falling back to hardcoded structure."
    # Hardcoded fallback
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
EOF
    if [ -n "$MOC_LINK" ]; then
        echo "- **System:** $MOC_LINK" >> "$NOTE_PATH"
    fi
    cat <<EOF >> "$NOTE_PATH"

## Summary
Placeholder created by conductor-sync.sh (Fallback)

## Verification Outcome
- [ ] Automated Tests Pass
- [ ] Manual Verification Confirmed
EOF
fi

echo "Created Obsidian note placeholder at $NOTE_PATH"

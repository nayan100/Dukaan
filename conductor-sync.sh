#!/bin/bash

# conductor-sync.sh
# Helper script to create/manage Obsidian note placeholders for Conductor tasks.

usage() {
    echo "Usage: ./conductor-sync.sh [--update] <track_id> <task_name>"
    exit 1
}

UPDATE_MODE=false

# Parse flags
if [ "$1" == "--update" ]; then
    UPDATE_MODE=true
    shift
fi

if [ -z "$1" ] || [ -z "$2" ]; then
    usage
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

# 3. Fetch Status and SHA from plan.md
PLAN_PATH="$TARGET_FOLDER/plan.md"
TASK_STATUS="open"
TASK_SHA=""

if [ -f "$PLAN_PATH" ]; then
    # Grep the line containing the task name
    # Format expected: - [ ] Task: <task_name> <sha>
    LINE=$(grep -F "Task: $TASK_NAME" "$PLAN_PATH" | head -n 1)
    if [ -n "$LINE" ]; then
        if [[ "$LINE" == *"[x]"* ]]; then
            TASK_STATUS="completed"
            # Extract SHA (last 7 chars if it matches regex)
            TASK_SHA=$(echo "$LINE" | grep -oE "[a-f0-9]{7}$")
        elif [[ "$LINE" == *"[~]"* ]]; then
            TASK_STATUS="in_progress"
        fi
    fi
fi

# 4. Atlas Lookup (Bidirectional Linking)
MOC_LINK=""
MATCHING_MOC=$(grep -l "\[\[.*$TRACK_ID/index" _Systems/*.md _Components/*.md 2>/dev/null | head -n 1)
if [ -n "$MATCHING_MOC" ]; then
    MOC_NAME=$(basename "$MATCHING_MOC" .md)
    MOC_DIR=$(dirname "$MATCHING_MOC")
    MOC_LINK="[[$MOC_DIR/$MOC_NAME|$MOC_NAME]]"
    echo "Info: Found matching MOC: $MOC_LINK"
fi

# 5. Create or Update Note
if [ ! -f "$NOTE_PATH" ]; then
    # Creation logic (from template)
    if [ -f "$TEMPLATE_PATH" ]; then
        cp "$TEMPLATE_PATH" "$NOTE_PATH"
        sed -i "s|track_id: |track_id: $TRACK_ID|" "$NOTE_PATH"
        sed -i "s|^status: .*|status: $TASK_STATUS|" "$NOTE_PATH"
        sed -i "s|<% tp.file.creation_date() %>|$DATE|g" "$NOTE_PATH"
        sed -i "s|<% tp.file.title %>|$TASK_NAME|g" "$NOTE_PATH"
        sed -i "s|<% tp.file.folder() %>|$TRACK_ID/index\|Track Index|g" "$NOTE_PATH"
        sed -i "s|<% tp.cursor() %>|Placeholder created by conductor-sync.sh|g" "$NOTE_PATH"
        if [ -n "$MOC_LINK" ]; then
            sed -i "/- \*\*Track:\*\*/a - **System:** $MOC_LINK" "$NOTE_PATH"
        fi
    else
        echo "Warning: Template not found at $TEMPLATE_PATH. Falling back to hardcoded structure."
        cat <<EOF > "$NOTE_PATH"
---
type: task
track_id: $TRACK_ID
status: $TASK_STATUS
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
else
    # Update logic (Phase 3)
    echo "Info: Updating existing note at $NOTE_PATH..."
    # Update Frontmatter status
    sed -i "s|^status: .*|status: $TASK_STATUS|" "$NOTE_PATH"
    
    # Inject SHA if present and not already there
    if [ -n "$TASK_SHA" ]; then
        if ! grep -q "$TASK_SHA" "$NOTE_PATH"; then
            # Find the header or end of file
            if grep -q "## Outcomes & SHAs" "$NOTE_PATH"; then
                sed -i "/## Outcomes & SHAs/a - Commit: $TASK_SHA (Synced on $DATE)" "$NOTE_PATH"
            else
                echo -e "\n## Outcomes & SHAs\n- Commit: $TASK_SHA (Synced on $DATE)" >> "$NOTE_PATH"
            fi
            # Also check off automated tests if SHA exists
            sed -i "s|- \[ \] Automated Tests Pass|- [x] Automated Tests Pass|" "$NOTE_PATH"
        fi
    fi
    echo "Sync complete for $NOTE_PATH"
fi

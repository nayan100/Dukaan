#!/bin/bash

# conductor-sync.sh
# Helper script to manage Obsidian task notes. 
# NOTE: Task notes are now OPTIONAL and must be created manually if deep documentation is needed.

usage() {
    echo "Usage: ./conductor-sync.sh --update <track_id> <task_name>"
    exit 1
}

if [ "$1" != "--update" ]; then
    echo "Info: Automatic note creation is disabled to prevent token bloat."
    echo "Manually create a note at 'conductor/tracks/<id>/<task_name>.md' if needed."
    usage
fi

shift # Remove --update

if [ -z "$1" ] || [ -z "$2" ]; then
    usage
fi

TRACK_ID=$1
TASK_NAME=$2
DATE=$(date +"%Y-%m-%d")

# 1. Resolve Target Folder
if [ -d "conductor/tracks/$TRACK_ID" ]; then
    TARGET_FOLDER="conductor/tracks/$TRACK_ID"
elif [ -d "conductor/archive/$TRACK_ID" ]; then
    TARGET_FOLDER="conductor/archive/$TRACK_ID"
else
    echo "Error: Track folder '$TRACK_ID' not found."
    exit 1
fi

# 2. Resolve Note Path
SAFE_TASK_NAME=$(echo "$TASK_NAME" | sed 's/[`*]//g' | sed 's/[ /\\:?\"&]/ /g' | xargs | sed 's/ /_/g')
NOTE_PATH="$TARGET_FOLDER/$SAFE_TASK_NAME.md"

if [ ! -f "$NOTE_PATH" ]; then
    echo "Info: No specific note found for '$TASK_NAME'. Skipping note sync."
    exit 0
fi

# 3. Fetch Status and SHA from plan.md
PLAN_PATH="$TARGET_FOLDER/plan.md"
TASK_STATUS="open"
TASK_SHA=""

if [ -f "$PLAN_PATH" ]; then
    FUZZY_TARGET=$(echo "$TASK_NAME" | sed 's/[`*]//g')
    while IFS= read -r line; do
        if [[ "$line" == *"- ["*"] Task:"* ]] || [[ "$line" == *"- ["*"] "* ]]; then
            CLEAN_LINE=$(echo "$line" | sed 's/[`*]//g')
            if [[ "$CLEAN_LINE" == *"$FUZZY_TARGET"* ]]; then
                if [[ "$line" == *"[x]"* ]]; then
                    TASK_STATUS="completed"
                    TASK_SHA=$(echo "$line" | grep -oE "[a-f0-9]{7}$")
                elif [[ "$line" == *"[~]"* ]]; then
                    TASK_STATUS="in_progress"
                fi
                break
            fi
        fi
    done < "$PLAN_PATH"
fi

# 4. Update Existing Note
echo "Info: Updating existing note at $NOTE_PATH..."
sed -i "s|^status: .*|status: $TASK_STATUS|" "$NOTE_PATH"

if [ -n "$TASK_SHA" ]; then
    if ! grep -q "$TASK_SHA" "$NOTE_PATH"; then
        if grep -q "## Outcomes & SHAs" "$NOTE_PATH"; then
            sed -i "/## Outcomes & SHAs/a - Commit: $TASK_SHA (Synced on $DATE)" "$NOTE_PATH"
        else
            echo -e "\n## Outcomes & SHAs\n- Commit: $TASK_SHA (Synced on $DATE)" >> "$NOTE_PATH"
        fi
        sed -i "s|- \[ \] Automated Tests Pass|- [x] Automated Tests Pass|" "$NOTE_PATH"
    fi
fi

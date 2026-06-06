# Obsidian Setup & Workflow

This document guides you through the configuration of Obsidian to integrate with the Conductor workflow.

## 1. Templater Configuration

The `Templates/` folder contains predefined templates for the project. To enable "Auto-Pathing" (moving notes to correct directories based on type):

1.  **Install Templater:** Ensure the "Templater" community plugin is installed and enabled.
2.  **Set Template Folder:** In Templater settings, set the "Template folder location" to `Templates`.
3.  **Enable "Trigger Templater on new file creation":** This ensures templates are applied when you create a new note.
4.  **Auto-Pathing Script:** You can use a Templater script in your templates to move files. 
    *   Add this to the top of your `Project-Module-Template.md` to move it to `_Systems/` if it's a backend module:
        ```javascript
        <%*
        const folder = tp.file.title.includes("Backend") ? "_Systems" : "_Components";
        await tp.file.move(`${folder}/${tp.file.title}`);
        %>
        ```

## 2. Calendar Integration

1.  **Install Calendar Plugin:** Enable the "Calendar" community plugin.
2.  **Daily Notes:** Configure Daily Notes to be stored in a `Journal/` folder (create this folder if needed).
3.  **Task Tracking:** Use the calendar to link to Conductor track milestones.

## 3. Advanced Canvas Visualization

1.  **Product Command Center:** Create a Canvas named `Product Command Center.canvas` in the root.
2.  **Linking:** Add cards that link to `conductor/product.md`, `conductor/tracks.md`, and active `plan.md` files.

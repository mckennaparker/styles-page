# Ultifilm: Keyframing Player Movement Prototype

**Author:** McKenna Parker 
**Team:** McKenna Parker, Khang Le, Gabriel Thiessen  
**Course:** CIS 5120 Spring 2026 | Assignment 5  
**Project Mentor:** Alice Liu  
**Mentor meeting date:** 03/27/2026 @ 9:30am EST

---

## How to Run
Visit the working prototype site live at https://mckennaparker.github.io/styles-page

---

## Technical Requirement

**Player Movement Tracking via Keyframing** Ultifilm allows coaches to select players on both offense and defense to track via keyframing. Since this is a proof of concept prototype, I just need to show that a user is able to add a player, select a few keyframes for that player over the course of the video, and then see a top down recreated view of the play that was jsut keyframed. The next steps of project progression are to combine this functionality with the annotation and database functionality implemented by my teammates.

---

## Evidence

📹 **(https://youtu.be/a6C9Gom-MVk)**

Instructions to follow along:
1. Open https://mckennaparker.github.io/styles-page in a browser
2. Enter a player name for the offense and/or defense
3. Click on the player's name on the right-hand side player listing that you want to keyframe
4. Pause the video to get more accurate results and click on the player to create a first keyframe
5. Play the video again and pause once the player has moved to a new position on the field
6. Pause the video and click on the player to create another keyframe in the sequence
7. Click the "Visualization" button to see a top down 2D view of the play that you just keyframed
8. Drag the time stamp to see how the player moved over the course of the play
---

## AI Attribution

This prototype was built with the assistance of **Claude** (Anthropic, claude.ai) and **GitHub Copilot** (GitHub, github.com/features/copilot). Claude generated all CSS and the original JavaScript used for the video annotation and play visualization functionality. GitHub Copilot was then used to integrate this code into my existing GitHub repository/Vite project which was built with TypeScript. The main changes were small details within function signatures, function definitions, and variable definitions. I then used GitHub Copilot to restructure my code base so that the video editor was on the home page, the play visualization was on a separate page accessible via a button, and the styles page was also separate and accessible via a button. The styles page was created entirely by me.

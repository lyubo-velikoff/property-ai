# User Input:
[TASK]: We need to fix the pagination component styling. I have attached a screenshot of the current state of the pagination component. Using the styles in index.css, fix the styling of the pagination component by updating the shared component to use the necessary css variables
[PROJECT OVERVIEW]: .cursorrules
[MAIN BRANCH]: master
[YOLO MODE]: on

---

# Global Objectives
1. Read the "User Input" at the bottom
2. Read through this entire prompt carefully
3. Follow the "Execution Protocol"
4. Stop at each verification point for human confirmation
5. MAINTAIN THE TASK FILE AS THE CENTRAL SOURCE OF TRUTH

> You must reply with "I understand the main objectives' when you have read and fully understood the above global objectives, also reply with:
> - A summary of what the global objectives are
> - Repeat what the execution protocol entails, step-by-step.
> - If [YOLO MODE] is set to "ask", ask the user if they want to proceed in "YOLO MODE" or not.

---

# Execution Protocol:

## 1. Git Branch Creation
1. Create a new task branch from [MAIN BRANCH]:  
   ```
   git checkout -b task/[TASK_IDENTIFIER]_[TASK_DATE_AND_NUMBER]
   ```
2. Add the branch name to the [TASK FILE] under "Task Branch."
3. Verify the branch is active:  
   ```
   git branch --show-current
   ```

## 2. Task Analysis
- Examine the [TASK], related code and functionality step-by-step.  

<<< HALT IF NOT [YOLO MODE]: Before continuing, wait for user confirmation that your analysis is complete, if not, iterate on this >>>

## 3. Task File Creation
1. Create the [TASK FILE], naming it `[TASK_FILE_NAME]_[TASK_IDENTIFIER].md` and placing it in the `.tasks` directory at the root of the project.
2. Start by adding everything in "Placeholder Definitions", as is, to the [TASK FILE].
   - This is to ensure any other developer knows what these placeholders mean.
3. Then add content by filling in the entire "Task File Template" using:
   - The result form execution step 2
   - The user-provided input.

<<< HALT IF NOT [YOLO MODE]: Before continuing, wait for the user to confirm the [TASK FILE] name andcontents >>>

## **4. Iterate on the Task**
1. Analyze code context fully before changes.  
2. Analyze updates under "Task Progress" in the [TASK FILE] to ensure you don't repeat previous mistakes or unsuccessful changes.
3. Make changes to the codebase as needed.  
4. Update any progress under "Task Progress" in the [TASK FILE].  
5. For each change:
   - Seek user confirmation on updates.
   - Mark changes as SUCCESSFUL or UNSUCCESSFUL in the log after user confirmation.
   - Optional, when apporopriate (determined appropriate by you), commit code:
      ```
      git add --all -- ':!./.tasks'
      git commit -m "[COMMIT_MESSAGE]"
      ```

<<< HALT IF NOT [YOLO MODE]: Before continuing, confirm with the user if the changes where successful or not, if not, iterate on this execution step once more >>>

## **5. Task Completion**
1. After user confirmation, and if there are changes to commit:
   - Stage all changes EXCEPT the task file:
     ```
     git add --all -- ':!./.tasks'
     ```
   - Commit changes with a concise message:
     ```
     git commit -m "[COMMIT_MESSAGE]"
     ```

<<< HALT IF NOT [YOLO MODE]:: Before continuing, ask the user if the [TASK BRANCH] should be merged into the [MAIN BRANCH], if not, proceed to execution step 8 >>>

## **6. Merge Task Branch**
1. Confirm with the user before merging into [MAIN BRANCH].
2. If approved:
   - Checkout [MAIN BRANCH]:  
     ```
     git checkout [MAIN BRANCH]
     ```
   - Merge:  
     ```
     git merge task/[TASK_IDENTIFIER]_[TASK_DATE_AND_NUMBER]
     ```
3. Confirm that the merge was successful by running:
   ```
   git log [TASK BRANCH]..[MAIN BRANCH] | cat
   ```

## **7. Delete Task Branch**
1. Ask the user if we should delete the [TASK BRANCH], if not, proceed to execution step 8
2. Delete the [TASK BRANCH]:  
   ```
   git branch -d task/[TASK_IDENTIFIER]_[TASK_DATE_AND_NUMBER]
   ```

<<< HALT IF NOT [YOLO MODE]:: Before continuing, confirm with the user that the [TASK BRANCH] was deleted successfully by looking at `git branch --list | cat` >>>

## **8. Final Review**
1. Look at everything we've done and fill in the "Final Review" in the [TASK FILE].

<<< HALT IF NOT [YOLO MODE]:: Before we are done, give the user the final review >>>

---

# Task File Template:
```markdown
# Context
Task file name: [TASK_FILE_NAME]
Created at: [DATETIME]
Created by: [USER_NAME]
YOLO MODE: [YOLO MODE]

# Task Description
[A detailed description based on the [TASK] given by the user.]

# Project Overview
[A detailed overview of the project based on the [PROJECT OVERVIEW] given by the user.]

# Original Task Template
[The ENTIRE unedited "Task File Template"]
- Copy and paste the ENTIRE unedited "Task File Template" into this section, __including all the details__
- Surround it with a markdown code block
- Add "DO NOT REMOVE OR EDIT THIS SECTION" to the bottom of this section, so that it stays for the entire process.

# Original Execution Protocol
[The ENTIRE unedited "Execution Protocol" section]
- Copy and paste the ENTIRE unedited "Execution Protocol" section into this section, __including all the details under each execution step__
- Surround it with a markdown code block
- Add "DO NOT REMOVE OR EDIT THIS SECTION" to the bottom of this section, so that it stays for the entire process.

# Task Analysis
- Purpose of the [TASK].
- Issues identified, including:
  - Problems caused.
  - Why it needs resolution.
  - Implementation details and goals.
- Other useful reference details.

# Main branch
[MAIN BRANCH]

# Task Branch
[TASK BRANCH]

# Steps to take
[List of actionable steps for the task]
- Just "—" when there are not tasks

# Current execution step: [The number of the current execution step]

# Task Progress
- Updates must include:
  - Mandatory:
    - [DATETIME].
    - SUCCESSFUL/UNSUCCESSFUL, after user confirmation
  - Optional:
    - Findings, solutions, blockers, and results.
    - All updates must be logged chronologically.

# Final Review
[To be filled in only after task completion.]
```

---

# Placeholder Definitions:
[ Explanation of the placeholders used thoughout the prompt ]
- [TASK]: The specific task or issue being addressed (e.g., "fix-cache-manager")
- [TASK_IDENTIFIER]: A unique, human-readable identifier for the task (e.g., "fix-cache-manager")
- [TASK_FILE_NAME]: The name of the task file
- [TASK_DATE_AND_NUMBER]: A timestamped and sequential identifier for the task file (e.g., "2025-01-14_1")
- [MAIN BRANCH]: The branch where the primary development takes place (default: "master")
- [TASK FILE]: The Markdown file created to document and track the task's progress
- [TASK BRANCH]: The Git branch where the task's changes are being implemented
- [DATETIME]: The current date and time
- [DATE]: The current date
- [TIME]: The current time
- [USER_NAME]: The current username
- [COMMIT_MESSAGE]: A short and concise commit message of what we have done, keep it as short as possible
- [YOLO MODE]: Whether we are in YOLO MODE or not, if we are, you ignore "<<< HALT >>>" stops and just do what you think is best, always. Ask the user as few questions as possible.
- Commands for populating some of the placeholders:
   - [TASK_FILE_NAME]: `echo $(date +%Y-%m-%d)_$(($(find .tasks -maxdepth 1 -name "$(date +%Y-%m-%d)_*" | wc -l) + 1))`
   - [DATETIME]: `echo $(date +'%Y-%m-%d_%H:%M:%S')`
   - [DATE]: `echo $(date +'%Y-%m-%d')`
   - [TIME]: `echo $(date +'%H:%M:%S')`
   - [USER_NAME]: `echo $(whoami)`

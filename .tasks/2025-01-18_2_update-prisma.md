# Context
Task file name: 2025-01-18_2_update-prisma
Created at: 2025-01-18_12:27:09
Created by: lyubo
Main branch: master
Task Branch: task/update-prisma-6
YOLO MODE: on

# Task Description
Update Prisma from v5.22.0 to v6.2.1 (latest stable version), handling all breaking changes and ensuring smooth migration.

# Project Overview
Professional real estate website project with a strong focus on type safety, component reusability, and modern development practices. The monorepo structure allows for good code organization and sharing of common components and types across different parts of the application.

# Original Execution Protocol
[The execution protocol content should NEVER be removed or edited]
```
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
   1.1. Find out the core files and implementation details involved in the [TASK].
        - Store what you've found under the "Task Analysis Tree" of the [TASK FILE].
   1.2. Branch out
        - Analyze what is currently in the "Task Analysis Tree" of the [TASK FILE].
        - Look at other files and functionality related to what is currently in the "Task Analysis Tree", by looking at even more details, be thorough and take your time.

## 2. Task File Creation
1. Create the [TASK FILE], naming it `[TASK_FILE_NAME]_[TASK_IDENTIFIER].md` and place it in the `.tasks` directory at the root of the project.
2. The [TASK FILE] should be implemented strictly using the "Task File Template" below, and also contain:
   a. Accurately fill in the "Original Execution Protocol" and "Original Safety Procedures" by following the detailed descriptions outlined in each respective section.
   b. Adjust the values of all placeholders based on the "User Input" and placeholder terminal commands.
3. Make a visible note in the [TASK FILE] that the "Execution Protocol" and "Safety Procedures" content should NEVER be removed or edited

<<< HALT IF NOT [YOLO MODE]: Before continuing, wait for the user to confirm the name and contents of the [TASK FILE] >>>

## 3. Task Analysis
1. Examine the [TASK] by looking at related code and functionality step-by-step to get a birds eye view of everything. It is important that you do the following, in that specific order, one step at a time:
  a. Find out the core files and implementation details involved in the [TASK].
    - Store what you've found under the "Task Analysis Tree" of the [TASK FILE].
  b. Branch out
    - Analyze what is currently in the "Task Analysis Tree" of the [TASK FILE].
    - Look at other files and functionality related to what is currently in the "Task Analysis Tree", by looking at even more details, be thorough and take your time.
  c. Repeat b until you have a full understanding of everything that might be involved in solving the task, then follow the below steps:
    - Do NOT stop until you can't find any more details that might be relevant to the [TASK].
2. Double check everything you've entered in the "Task Analysis Tree" of the [TASK FILE]
  - Look through everything in the "Task Analysis Tree" and make sure you weed out everything that is not essential for solving the [TASK].

<<< HALT IF NOT [YOLO MODE]: Before continuing, wait for user confirmation that your analysis is satisfactory, if not, iterate on this >>>

## **4. Iterate on the Task**
1. Follow Safety Procedures section 1 before making any changes
2. Analyze code context fully before changes
3. Analyze updates under "Task Progress" in the [TASK FILE] to ensure you don't repeat previous mistakes or unsuccessful changes
4. Make changes to the codebase as needed
5. If errors occur, follow Safety Procedures section 2
6. For each change:
   - Seek user confirmation on updates
   - Mark changes as SUCCESSFUL/UNSUCCESSFUL
     - ONLY after you or the user have tested and reviewed the result of the change.
   - After successful changes, follow Safety Procedures section 3
   - Optional, when appropriate (determined appropriate by you), commit code:
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

<<< HALT IF NOT [YOLO MODE]: Before continuing, ask the user if the [TASK BRANCH] should be merged into the [MAIN BRANCH], if not, proceed to execution step 8 >>>

## **6. Merge Task Branch**
1. Confirm with the user before merging into [MAIN BRANCH].
2. If approved:
   - Checkout [MAIN BRANCH]:
     ```
     git checkout [MAIN BRANCH]
     ```
   - Merge:
     ```
     git merge -
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

<<< HALT IF NOT [YOLO MODE]: Before continuing, confirm with the user that the [TASK BRANCH] was deleted successfully by looking at `git branch --list | cat` >>>

## **8. Final Review**
1. Look at everything we've done and fill in the "Final Review" in the [TASK FILE].

<<< HALT IF NOT [YOLO MODE]: Before we are done, give the user the final review >>>
```

# Task Analysis
- Purpose of the task: Upgrade Prisma from v5.22.0 to v6.2.1 while handling all breaking changes and ensuring database operations continue to work correctly.
- Issues identified:
  - Major version upgrade (5.x to 6.x)
  - Breaking changes in transaction handling
  - Breaking changes in error handling
  - Changes in client initialization
  - New type safety features to leverage
- Implementation details and goals:
  - Backup database before migration
  - Update Prisma dependencies
  - Update schema and migrations
  - Test all database operations
  - Update error handling
  - Leverage new features where beneficial
- Other useful reference details:
  - Node.js version: v20.12.2 (compatible)
  - Using SQLite/MongoDB as database

# Task Analysis Tree
- apps/api/package.json
  - @prisma/client: "^5.22.0"
  - prisma: "^5.22.0"
- apps/api/prisma/
  - schema.prisma
  - migrations/
- apps/api/src/
  - Database operations
  - Transaction handling
  - Error handling
  - Client initialization

# Steps to take
1. Preparation
   - Backup database
   - Create test database
   - Document current schema
2. Update Dependencies
   - Update prisma and @prisma/client
   - Regenerate client
3. Schema and Migration Updates
   - Review schema compatibility
   - Update schema if needed
   - Run migrations
4. Code Updates
   - Update transaction handling
   - Update error handling
   - Update client initialization
   - Leverage new features
5. Testing
   - Run existing tests
   - Add new tests for changes
   - Test all CRUD operations
   - Test transactions
   - Test error scenarios
6. Documentation
   - Update API documentation
   - Document breaking changes
   - Update development guides

# Current execution step: 1

# Important Notes
- Major version upgrade requires careful testing
- Breaking changes in core functionality:
  - Transaction handling changes
  - Error handling modifications
  - Client initialization updates
- New features to consider:
  - Enhanced type safety
  - Improved performance
  - Better error messages
- Need to maintain backward compatibility
- Consider impact on development workflow

# Task Progress
[No progress yet - task is in planning phase]

# Final Review
[To be filled in when the task is complete] 

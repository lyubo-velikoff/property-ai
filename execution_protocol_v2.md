# Execution Protocol v2

## Placeholder Definitions
- [TASK]: The specific task or change request to be implemented
- [PROJECT OVERVIEW]: Current state and context of the project
- [DATETIME]: Current date and time in ISO format
- [YOLO MODE]: Expedited execution mode that skips backup creation and reduces documentation overhead. 
  **NOTE**: Even in YOLO mode, analysis and planned steps MUST still be presented for review before implementation.

## Pre-Execution Checklist
Before starting any task:

1. Initial Understanding
   - [ ] Read and understand the [TASK]
   - [ ] Review the [PROJECT OVERVIEW]
   - [ ] Check current codebase state

2. Task Scope Definition
   - [ ] List affected components/files
   - [ ] Identify potential risks
   - [ ] Note dependencies between changes

3. Documentation Preparation
   - [ ] Get task file name using provided commands
   - [ ] Prepare task file structure
   - [ ] Document initial findings

## Analysis Templates

### Code Change Analysis
For each file to be modified:
```
File: [path/to/file]
Current State:
  - Purpose: [file's current purpose]
  - Key Functions: [list of important functions]
  - Dependencies: [list of dependencies]
Planned Changes:
  - What: [description of changes]
  - Why: [justification]
  - Impact: [potential effects]
  - Risks: [potential issues]
```

### Test Impact Analysis
```
Affected Tests:
  - Unit Tests: [list affected tests]
  - Integration Tests: [list affected tests]
New Tests Needed:
  - [ ] [description of new test]
  - [ ] [description of new test]
```

## Change Verification Plan
Each change must include:

1. Immediate Verification
   - [ ] Syntax check
   - [ ] Lint check
   - [ ] Type check
   - [ ] Unit tests

2. Integration Verification
   - [ ] Build check
   - [ ] Integration tests
   - [ ] System tests

3. Rollback Plan
   - [ ] Backup strategy
   - [ ] Restore procedure
   - [ ] Verification steps

## Quality Gates
Each phase must pass these gates:

### Planning Gate
- [ ] Complete analysis documented
- [ ] All affected files identified
- [ ] Test strategy defined
- [ ] Backup strategy defined
- [ ] User approval received

### Implementation Gate
- [ ] All tests passing
- [ ] No new lint errors
- [ ] All backups verified
- [ ] Changes documented
- [ ] No unintended side effects

### Completion Gate
- [ ] All changes committed
- [ ] Tests passing on main branch
- [ ] Documentation updated
- [ ] Backups cleaned up

## Execution Steps

1. Task Branch Creation
   ```bash
   git checkout -b task/[TASK_NAME]_$(date +%Y-%m-%d)_1
   ```

2. Task Documentation Creation
   ```bash
   # Get task file name and metadata
   echo $(date +%Y-%m-%d)_$(($(find .tasks -maxdepth 1 -name "$(date +%Y-%m-%d)_*" | wc -l) + 1))
   echo $(date +'%Y-%m-%d_%H:%M:%S')
   whoami
   ```

3. Task Progress Tracking
   Each update MUST include:

   ## Change Set [NUMBER]
   ```
   Time: [DATETIME]
   Phase: [PLANNING|IMPLEMENTATION]
   Status: [IN_PROGRESS|SUCCESSFUL|UNSUCCESSFUL]

   Changes:
   1. [file_path]:
      - Purpose: [why this change]
      - Details: [what changed]
      - Verification: [how verified]
      - Status: [result]

   Dependencies:
   - Required: [list of required changes]
   - Affected: [list of affected components]

   Verification:
   - Tests Run: [list of tests]
   - Results: [test results]

   Backup Status:
   - Files: [list of backed up files]
   - Location: [backup location]
   - Status: [Created|Removed]
   ```

4. Final Review
   ```
   Task: [TASK]
   Branch: [BRANCH_NAME]
   Status: [COMPLETED|FAILED]
   
   Changes Made:
   1. [file_path]: [summary of changes]
   
   Test Results:
   - [test_suite]: [PASS|FAIL]
   
   Backup Status:
   - Location: [backup_location]
   - Status: [Exists|Removed]
   
   Impact:
   - [description of changes made]
   - [affected components]
   
   Next Steps:
   1. [next step]
   2. [next step]
   ```

5. Cleanup
   - Merge changes (if approved)
   - Delete task branch
   - Remove backup files (if exists)
   - Update documentation

## Task File Template
```markdown
# Task: [TASK_NAME]
Created: [DATETIME]
Author: [USERNAME]

## Overview
[Brief description of the task]

## Analysis
[Detailed analysis using the Analysis Templates]

## Execution Plan
1. [Step 1]
2. [Step 2]
...

## Progress
[Progress updates using the Change Set template]

## Final Review
[Final review using the Final Review template]
``` 

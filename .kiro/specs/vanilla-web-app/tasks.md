# Implementation Plan: Vanilla Web App Dashboard

## Overview

Implement a single-page personal dashboard in plain HTML, CSS, and JavaScript. All logic lives in three files: `index.html`, `css/style.css`, and `js/app.js`. Modules are initialised on `DOMContentLoaded` and use `StorageService` for all persistence.

## Tasks

- [x] 1. Create file structure and HTML scaffold
  - Create `index.html` with semantic sections for each module (greeting, timer, task manager, link manager)
  - Create `css/style.css` with base styles and a CSS class for completed tasks (e.g. `.completed` with strikethrough)
  - Create `js/app.js` with a `DOMContentLoaded` listener and empty module stubs
  - _Requirements: 9.1_

- [ ] 2. Implement StorageService
  - [x] 2.1 Implement `StorageService` with `get`, `set`, and `KEYS` (`vwa_tasks`, `vwa_links`)
    - `get` wraps `JSON.parse` in try/catch and returns `fallback` on error or missing key
    - `set` wraps `JSON.stringify` + `localStorage.setItem` in try/catch and silently ignores errors
    - _Requirements: 6.2, 6.3_

  - [ ]* 2.2 Write property test for StorageService serialisation round-trip
    - **Property 13: StorageService serialisation round-trip**
    - **Validates: Requirements 6.2, 6.3**

- [ ] 3. Implement GreetingModule
  - [x] 3.1 Implement `GreetingModule.init()` and `_tick()` using `setInterval` (1-second interval)
    - Display time in HH:MM:SS format (zero-padded), current date in human-readable format, and time-based greeting
    - _Requirements: 1.1, 1.2_

  - [ ]* 3.2 Write property test for time formatting (Property 1)
    - **Property 1: Time formatting is always HH:MM:SS**
    - **Validates: Requirements 1.1**

  - [ ]* 3.3 Write property test for date formatting (Property 2)
    - **Property 2: Date formatting always contains weekday, day, month, and year**
    - **Validates: Requirements 1.2**

  - [x] 3.4 Implement `_getGreeting(hour)` pure function
    - Returns "Good Morning" for hours 5–11, "Good Afternoon" for 12–17, "Good Evening" for 18–21, "Good Night" for 22–23 and 0–4
    - _Requirements: 1.3, 1.4, 1.5, 1.6_

  - [ ]* 3.5 Write property test for greeting correctness (Property 3)
    - **Property 3: Greeting is correct for every hour of the day**
    - **Validates: Requirements 1.3, 1.4, 1.5, 1.6**

- [ ] 4. Implement TimerModule
  - [x] 4.1 Implement `TimerModule` with internal state `{ remaining, intervalId }`, initialised to 25:00
    - `start()` creates interval only if `intervalId === null`; `stop()` clears interval and retains remaining; `reset()` stops and restores to 1500 seconds
    - `_tick()` decrements remaining and calls `stop()` when it reaches 0
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ]* 4.2 Write unit tests for TimerModule
    - Timer initialises to 25:00; decrements by 1 after one tick; stop retains remaining; reset restores to 25:00; auto-stops at 00:00
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ]* 4.3 Write property test for start idempotency (Property 4)
    - **Property 4: Start is idempotent on a running timer**
    - **Validates: Requirements 2.7**

- [x] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement TaskManager
  - [x] 6.1 Implement `TaskManager.init()` — loads tasks from `StorageService` (fallback `[]`) and calls `_render()`
    - _Requirements: 6.1, 6.4_

  - [x] 6.2 Implement `_addTask(label)` — trims label, rejects empty/whitespace with inline validation message, creates task `{ id, label, completed: false }`, persists, re-renders
    - _Requirements: 3.2, 3.3, 3.4_

  - [ ]* 6.3 Write property test for valid task addition (Property 5)
    - **Property 5: Adding a valid task creates it with correct defaults and persists it**
    - **Validates: Requirements 3.2, 3.3**

  - [ ]* 6.4 Write property test for whitespace task rejection (Property 6)
    - **Property 6: Whitespace-only task labels are always rejected**
    - **Validates: Requirements 3.4**

  - [x] 6.5 Implement `_editTask(id, newLabel)` — trims label, rejects empty/whitespace (restores original), updates task, persists, re-renders
    - _Requirements: 4.3, 4.4_

  - [ ]* 6.6 Write property test for valid task edit (Property 7)
    - **Property 7: Editing a task with a valid label updates and persists it**
    - **Validates: Requirements 4.3**

  - [ ]* 6.7 Write property test for whitespace edit rejection (Property 8)
    - **Property 8: Editing a task with a whitespace-only label preserves the original label**
    - **Validates: Requirements 4.4**

  - [x] 6.8 Implement `_toggleTask(id)` — inverts `completed`, persists, re-renders
    - _Requirements: 5.2_

  - [ ]* 6.9 Write property test for double-toggle (Property 9)
    - **Property 9: Toggling completion twice restores original state**
    - **Validates: Requirements 5.2**

  - [x] 6.10 Implement `_deleteTask(id)` — removes task, persists, re-renders
    - _Requirements: 5.5_

  - [ ]* 6.11 Write property test for task deletion (Property 11)
    - **Property 11: Deleting a task removes it from state and storage**
    - **Validates: Requirements 5.5**

  - [x] 6.12 Implement `_render()` — full DOM re-render; each task row includes edit control, completion toggle, delete control; completed tasks get `.completed` CSS class
    - _Requirements: 3.1, 4.1, 4.2, 5.1, 5.3, 5.4_

  - [ ]* 6.13 Write property test for completed task visual distinction (Property 10)
    - **Property 10: Completed tasks are visually distinguished in the rendered list**
    - **Validates: Requirements 5.3**

  - [ ]* 6.14 Write property test for task load round-trip (Property 12)
    - **Property 12: Loading tasks round-trips through StorageService**
    - **Validates: Requirements 6.1**

  - [ ]* 6.15 Write unit tests for TaskManager DOM structure
    - DOM contains task input field and submit button; edit control shows pre-filled input; DOM contains completion toggle and delete control per task; empty task list renders without error
    - _Requirements: 3.1, 4.1, 4.2, 5.1, 5.4, 6.4_

- [x] 7. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement LinkManager
  - [x] 8.1 Implement `LinkManager.init()` — loads links from `StorageService` (fallback `[]`) and calls `_render()`
    - _Requirements: 8.2, 8.3_

  - [x] 8.2 Implement `_addLink(label, url)` — trims label, validates URL via `new URL(url)` in try/catch, rejects invalid inputs with inline validation message, creates link `{ id, label, url }`, persists, re-renders
    - _Requirements: 7.2, 7.3_

  - [ ]* 8.3 Write property test for valid link addition (Property 14)
    - **Property 14: Adding a valid link creates it and persists it**
    - **Validates: Requirements 7.2**

  - [ ]* 8.4 Write property test for invalid link rejection (Property 15)
    - **Property 15: Invalid link submissions are always rejected**
    - **Validates: Requirements 7.3**

  - [x] 8.5 Implement `_deleteLink(id)` — removes link, persists, re-renders
    - _Requirements: 7.5_

  - [ ]* 8.6 Write property test for link deletion (Property 16)
    - **Property 16: Deleting a link removes it from state and storage**
    - **Validates: Requirements 7.5**

  - [x] 8.7 Implement `_render()` — renders each link as an anchor with `target="_blank"` and a delete control; empty state renders without error
    - _Requirements: 7.1, 7.4, 8.1, 8.3_

  - [ ]* 8.8 Write property test for link load round-trip (Property 17)
    - **Property 17: Loading links round-trips through StorageService**
    - **Validates: Requirements 8.2**

  - [ ]* 8.9 Write unit tests for LinkManager DOM structure
    - DOM contains link label input, URL input, submit button, delete control per link; activating a link calls `window.open` with correct URL and `"_blank"`; empty link list renders without error
    - _Requirements: 7.1, 7.4, 8.1, 8.3_

- [ ] 9. Wire all modules together and apply styling
  - [x] 9.1 Call `GreetingModule.init()`, `TimerModule.init()`, `TaskManager.init()`, `LinkManager.init()` inside the `DOMContentLoaded` listener in `js/app.js`
    - _Requirements: 9.1, 9.2_

  - [x] 9.2 Complete `css/style.css` — layout, typography, `.completed` strikethrough, responsive adjustments
    - _Requirements: 5.3, 9.1_

- [x] 10. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests use **fast-check** (`fc.assert(fc.property(...))`) with a minimum of 100 iterations each
- Each property test file should include a comment: `// Feature: vanilla-web-app, Property N: <property text>`
- Unit tests and property tests are complementary — both should be present for full coverage
- All persistence goes through `StorageService`; modules must not access `localStorage` directly

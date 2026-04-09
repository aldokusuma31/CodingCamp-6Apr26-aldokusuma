# Requirements Document

## Introduction

A personal dashboard web app built with vanilla HTML, CSS, and JavaScript. It runs entirely in the browser with no backend, using Local Storage for persistence. The dashboard provides four core modules: a greeting with live clock, a focus (Pomodoro-style) timer, a to-do list, and a quick links panel. The target user is anyone who wants a lightweight, distraction-free start page or productivity tool.

## Glossary

- **Dashboard**: The single-page web application containing all four modules.
- **Greeting_Module**: The section that displays the current time, date, and a time-based greeting message.
- **Timer**: The focus timer module that counts down from 25 minutes.
- **Task_Manager**: The to-do list module responsible for creating, editing, completing, and deleting tasks.
- **Task**: A single to-do item with a text label and a completion state.
- **Link_Manager**: The quick links module that stores and displays user-defined website shortcuts.
- **Link**: A saved shortcut consisting of a label and a URL.
- **Local_Storage**: The browser's built-in client-side key-value storage API.
- **Storage_Service**: The JavaScript layer that reads and writes data to Local Storage.

---

## Requirements

### Requirement 1: Live Greeting

**User Story:** As a user, I want to see the current time, date, and a contextual greeting when I open the dashboard, so that I have an immediate sense of the time of day.

#### Acceptance Criteria

1. THE Greeting_Module SHALL display the current time in HH:MM:SS format, updated every second.
2. THE Greeting_Module SHALL display the current date in a human-readable format (e.g., Monday, 14 July 2025).
3. WHEN the current hour is between 05:00 and 11:59, THE Greeting_Module SHALL display the greeting "Good Morning".
4. WHEN the current hour is between 12:00 and 17:59, THE Greeting_Module SHALL display the greeting "Good Afternoon".
5. WHEN the current hour is between 18:00 and 21:59, THE Greeting_Module SHALL display the greeting "Good Evening".
6. WHEN the current hour is between 22:00 and 04:59, THE Greeting_Module SHALL display the greeting "Good Night".

---

### Requirement 2: Focus Timer

**User Story:** As a user, I want a 25-minute countdown timer with start, stop, and reset controls, so that I can time focused work sessions.

#### Acceptance Criteria

1. THE Timer SHALL initialise with a countdown value of 25 minutes (25:00).
2. WHEN the user activates the start control, THE Timer SHALL begin counting down in one-second intervals.
3. WHILE the Timer is counting down, THE Timer SHALL update the displayed time every second.
4. WHEN the user activates the stop control, THE Timer SHALL pause the countdown and retain the current remaining time.
5. WHEN the user activates the reset control, THE Timer SHALL stop any active countdown and restore the displayed time to 25:00.
6. WHEN the countdown reaches 00:00, THE Timer SHALL stop automatically.
7. IF the user activates the start control while the Timer is already counting down, THEN THE Timer SHALL ignore the action.

---

### Requirement 3: To-Do List — Task Creation

**User Story:** As a user, I want to add tasks to a list, so that I can track what I need to do.

#### Acceptance Criteria

1. THE Task_Manager SHALL provide an input field and a submit control for entering new tasks.
2. WHEN the user submits a non-empty task label, THE Task_Manager SHALL add a new Task with that label and a default completion state of false.
3. WHEN a new Task is added, THE Task_Manager SHALL persist all tasks to Local Storage via the Storage_Service.
4. IF the user submits an empty or whitespace-only task label, THEN THE Task_Manager SHALL reject the submission and display an inline validation message.

---

### Requirement 4: To-Do List — Task Editing

**User Story:** As a user, I want to edit existing task labels, so that I can correct or update what I wrote.

#### Acceptance Criteria

1. THE Task_Manager SHALL provide an edit control for each Task in the list.
2. WHEN the user activates the edit control for a Task, THE Task_Manager SHALL replace the task label with an editable input field pre-filled with the current label.
3. WHEN the user confirms the edit with a non-empty label, THE Task_Manager SHALL update the Task label and persist the change via the Storage_Service.
4. IF the user confirms the edit with an empty or whitespace-only label, THEN THE Task_Manager SHALL reject the change and restore the original label.

---

### Requirement 5: To-Do List — Task Completion and Deletion

**User Story:** As a user, I want to mark tasks as done and delete tasks I no longer need, so that I can manage my list effectively.

#### Acceptance Criteria

1. THE Task_Manager SHALL provide a completion toggle control for each Task.
2. WHEN the user activates the completion toggle for a Task, THE Task_Manager SHALL invert the Task's completion state and persist the change via the Storage_Service.
3. THE Task_Manager SHALL visually distinguish completed Tasks from incomplete Tasks (e.g., strikethrough text).
4. THE Task_Manager SHALL provide a delete control for each Task.
5. WHEN the user activates the delete control for a Task, THE Task_Manager SHALL remove the Task from the list and persist the updated list via the Storage_Service.

---

### Requirement 6: To-Do List — Persistence

**User Story:** As a user, I want my tasks to be saved automatically, so that they are still there when I reopen the dashboard.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Task_Manager SHALL retrieve all stored tasks from Local Storage via the Storage_Service and render them.
2. THE Storage_Service SHALL serialise the task list as a JSON array when writing to Local Storage.
3. THE Storage_Service SHALL deserialise the JSON array when reading from Local Storage.
4. IF Local Storage contains no task data, THEN THE Task_Manager SHALL render an empty list without error.

---

### Requirement 7: Quick Links — Management

**User Story:** As a user, I want to save and manage shortcut links to my favourite websites, so that I can open them quickly from the dashboard.

#### Acceptance Criteria

1. THE Link_Manager SHALL provide input fields for a link label and a URL, and a submit control for adding a new Link.
2. WHEN the user submits a Link with a non-empty label and a valid URL, THE Link_Manager SHALL add the Link and persist all links via the Storage_Service.
3. IF the user submits a Link with an empty label or an invalid URL, THEN THE Link_Manager SHALL reject the submission and display an inline validation message.
4. THE Link_Manager SHALL provide a delete control for each saved Link.
5. WHEN the user activates the delete control for a Link, THE Link_Manager SHALL remove the Link and persist the updated list via the Storage_Service.

---

### Requirement 8: Quick Links — Navigation and Persistence

**User Story:** As a user, I want my saved links to open in a new tab and to persist across sessions, so that they are always available and don't disrupt my current page.

#### Acceptance Criteria

1. WHEN the user activates a saved Link, THE Link_Manager SHALL open the associated URL in a new browser tab.
2. WHEN the Dashboard loads, THE Link_Manager SHALL retrieve all stored links from Local Storage via the Storage_Service and render them.
3. IF Local Storage contains no link data, THEN THE Link_Manager SHALL render an empty links panel without error.

---

### Requirement 9: Single-File Structure and Compatibility

**User Story:** As a developer, I want the app to follow a strict file structure and run in all modern browsers without a build step, so that it is easy to maintain and deploy.

#### Acceptance Criteria

1. THE Dashboard SHALL be implemented using exactly one HTML file, one CSS file inside a `css/` directory, and one JavaScript file inside a `js/` directory.
2. THE Dashboard SHALL function correctly in the current stable releases of Chrome, Firefox, Edge, and Safari without requiring a build tool or server.
3. THE Dashboard SHALL load and become interactive in under 2 seconds on a standard broadband connection.

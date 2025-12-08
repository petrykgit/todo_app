ToDo App

1. Live Preview
[DEMO LINK](https://petrykgit.github.io/todo_app/)

2. Design Reference
This project implements a clean, modern, and highly functional ToDo list interface, focusing on exceptional user experience.

3. Technologies Used
- React	- Library used for building the component-based user interface.
- TypeScript	- Crucial for strong typing, reducing runtime errors, and improving code maintainability.
- Vite	- Used for fast development and optimized production builds.
- SCSS	- Provides powerful features like variables and nesting for organized and maintainable stylesheets.
- React Hooks	- Manages local and asynchronous state efficiently (e.g., useState, useEffect).

4. Getting Started
Follow these steps to set up and run the ToDo application locally.

Prerequisites
- Node.js
- npm

Installation
Clone the repository:
- git clone https://github.com/petrykgit/todo_app.git
- cd todo_app

Install dependencies:
- npm install

Running the Project.
Start the development server:
- npm start

Build for Production:
- npm run build

5. Features.
This application showcases robust full CRUD functionality and advanced UI/UX practices for handling asynchronous operations:

- Full CRUD Functionality: Seamlessly Create, Read, Update (toggle completion, edit title), and Delete tasks.
- API Interaction Management: Efficiently handles asynchronous operations, preventing race conditions and ensuring data integrity.
- Visual Feedback: Incorporates loaders (spinners) and notifications to provide clear user feedback during ongoing API calls (adding, updating, deleting).
- Task Filtering: Users can filter the list to view all tasks, active tasks, or completed tasks.
- Toggle All: Single action to mark all tasks as completed or active.
- Clear Completed: Dedicated action to efficiently delete all completed tasks.
- Clean Architecture: Built with an emphasis on clean code, custom hooks (useTodos, useErrorNotification, useTodosFiltering), and strong TypeScript contracts for enhanced maintainability.

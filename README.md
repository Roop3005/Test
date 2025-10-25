# Interactive Hierarchical Visualization

This project is a web-based tool for interactively visualizing hierarchical data. It allows users to explore complex, nested datasets through a simple and intuitive zoom-and-click interface.

## 🧭 Overview

The primary problem this project solves is the challenge of representing and navigating hierarchical data structures in a user-friendly way. Instead of static trees or lists, this tool provides a dynamic, visual exploration experience. Users can start with a high-level overview and progressively drill down into deeper levels of the hierarchy. The example data visualizes a geographical hierarchy of continents, countries, and cities, but the engine is generic and can be used for any nested dataset.

## 🧩 Design

### Architectural Approach

The application is a self-contained, single-page frontend application with no backend dependencies. The architecture is straightforward:

-   **Data:** The hierarchical data is loaded from a `config.json` file. This keeps the data separate from the application logic, making it easy to swap in different datasets.
-   **Rendering Engine:** A custom rendering engine built with the HTML5 Canvas API is responsible for drawing the data on the screen. It handles the layout of nodes (represented as rectangles) and the smooth animated transitions between layers.
-   **State Management:** The application state, including the current layer, navigation history, and zoom/pan offsets, is managed within the main JavaScript file (`app.js`).

### UI/UX Design

The user interface is designed to be minimal and intuitive, focusing on the visualization itself:

-   **Interactive Canvas:** The main view is a full-screen canvas where the data is rendered. Users interact directly with the visualized nodes.
-   **Zoom Navigation:** Clicking on a node zooms in to reveal its children, providing a clear drill-down path. Right-clicking or using the scroll wheel zooms out to the parent layer.
-   **Breadcrumb Navigation:** A series of colored bubbles at the top of the screen acts as a breadcrumb trail, showing the user's current path in the hierarchy. This allows for quick navigation back to any previous level.
-   **Home Button:** A "Home" button provides a one-click way to return to the top-level overview.
-   **Animations:** Smooth, fading transitions between layers provide a polished user experience and help maintain context during navigation.

## ⚙️ Tech Choices

The technology stack was chosen to be lightweight, dependency-free, and universally supported by modern web browsers.

-   **HTML5:** Provides the basic structure of the application, including the `<canvas>` element which is central to the visualization.
-   **CSS3:** Used for styling the UI components like the home button and breadcrumb bubbles. It adds modern touches like box shadows and hover effects for better usability.
--   **JavaScript (ES6):** All the application logic is written in plain JavaScript. This includes event handling (clicks, scroll), state management, and all the rendering logic for the canvas. The choice to avoid external libraries or frameworks makes the project lightweight and demonstrates the power of modern browser APIs.
-   **JSON (JavaScript Object Notation):** The data is stored in a simple and human-readable JSON format, which is natively supported by JavaScript and easy to edit or generate programmatically.

## ✅ Tests

Since this is a simple, self-contained frontend project, there are no automated tests. To run and verify the application, follow these manual steps:

### Running the Application

1.  Clone or download the repository to your local machine.
2.  Open the `index.html` file in a modern web browser (e.g., Chrome, Firefox, Safari, Edge).

### Verification Steps

1.  **Initial View:** On loading, you should see the top-level "Continents" layer with two colored rectangles labeled "North America" and "Europe".
2.  **Zoom In:** Click on the "North America" rectangle. The view should smoothly transition to show the "Countries" layer, displaying "USA" and "Canada".
3.  **Breadcrumbs:** The breadcrumb navigation at the top should now show two colored bubbles, representing the "Continents" and "Countries" layers.
4.  **Drill Down:** Click on the "USA" rectangle. The view will transition again to show the "Cities" layer, displaying "New York".
5.  **Zoom Out:** Right-click anywhere on the canvas or scroll down with your mouse wheel. The view should transition back to the previous layer (e.g., from "Cities" to "Countries").
6.  **Home Button:** Click the "Home" button. The view should immediately return to the top-level "Continents" layer.
7.  **Breadcrumb Navigation:** Click on one of the previous bubbles in the breadcrumb trail. The view should jump directly to that layer.

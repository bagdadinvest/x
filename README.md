# Playwright Login Script README

## Overview
This script automates login to a specified website using Playwright. It simulates user actions like entering login credentials, navigating to a specific page, and interacting with content (such as liking posts). The script also supports pausing for manual inspection and saving session cookies for future reuse.

## Dependencies
To run the script, the following dependencies are required:

1. **Node.js** (v14+ recommended)
   - The script runs on Node.js, so ensure it's installed on your system. You can download it from [Node.js official site](https://nodejs.org/).

2. **NPM packages**
   - Install the required npm packages by running:
     ```bash
     npm install playwright fs chokidar readline
     ```
   
   **Package details**:
   - `playwright`: For browser automation.
   - `fs`: Built-in Node.js file system module for file operations.
   - `chokidar`: For watching changes in the script file and restarting automatically.
   - `readline`: For taking user input from the command line.

3. **Nodemon (Optional)**
   - To automatically restart the script on file changes, you can use `nodemon`. Install it globally using:
     ```bash
     npm install -g nodemon
     ```

## Running the Script
To run the script, use the following command in the terminal:
```bash
node test.js
```
Alternatively, if you're using `nodemon` to monitor changes:
```bash
nodemon test.js
```

## URL Input Format
- The script will prompt you to enter the URL you want to navigate to after login.
- The URL should be entered in the following format:
  - Full URLs with protocol: `https://example.com/path`.
  - Make sure to provide the full URL, including `https://` or `http://`.

### Example Input
```
Please enter the URL you want to navigate to: https://x.com/TeamMessi
```

## Features
1. **Automatic Login**: The script performs the login process automatically, using saved credentials.
2. **Session Persistence**: Cookies are saved in a `cookies.json` file, allowing for seamless login in future runs.
3. **Like Posts**: After navigating to the specified page, the script interacts with the content by clicking the first 3 'like' buttons.
4. **Manual Inspection**: The script pauses to allow manual inspection of the browser state for debugging.
5. **Live Reloading**: `chokidar` watches for changes in the script file and automatically reloads it.

## Notes
- **Credentials**: The script currently has hardcoded login credentials (`lotfikanouni4@gmail.com` and password). Update them as needed.
- **Cookies**: Cookies are saved in `cookies.json`. Make sure to delete this file if you need to re-run the login process from scratch.
- **Manual Pause**: The script includes `await page.pause();` to pause and allow manual inspection through Playwright's Inspector.

## Troubleshooting
1. **Login Issues**: If the login fails, verify the credentials and check the login page structure for updates that might require adjustments in the selectors.
2. **Timeout Errors**: If you encounter navigation timeout errors, try increasing the timeout value or ensure your internet connection is stable.
3. **File Changes Not Detected**: Ensure `chokidar` and `nodemon` are properly installed for live script reloading.



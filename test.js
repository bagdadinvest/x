const { chromium, devices } = require('playwright');
const fs = require('fs');
const chokidar = require('chokidar');
const readline = require('readline');

// Watch for changes in the script file and restart from the saved state
chokidar.watch(__filename).on('change', () => {
    console.log("Script file changed. Reloading...");
    process.exit(0); // Exit to allow a restart with nodemon or similar tools
});

// Utility function to wait for a random time between actions
function getRandomTimeout(min = 1000, max = 3000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to get headers for different devices
function getRandomUserAgent() {
    const userAgents = [
        devices['iPhone 12'].userAgent,
        devices['Pixel 5'].userAgent,
        devices['iPad Pro 11'].userAgent,
        devices['Desktop Chrome'].userAgent,
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Function to load cookies if available
async function loadCookies(context) {
    if (fs.existsSync('cookies.json')) {
        const cookies = JSON.parse(fs.readFileSync('cookies.json'));
        await context.addCookies(cookies);
        console.log("Cookies loaded from file.");
    }
}

// Function to save cookies after login
async function saveCookies(context) {
    const cookies = await context.cookies();
    fs.writeFileSync('cookies.json', JSON.stringify(cookies));
    console.log("Cookies saved to file.");
}

// Function to save the current state (URL)
function saveState(url) {
    fs.writeFileSync('state.json', JSON.stringify({ url }));
    console.log("State saved to file.");
}

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getUserInput(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

(async () => {
    const userUrl = await getUserInput('Please enter the URL you want to navigate to: ');
    rl.close();

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        userAgent: getRandomUserAgent(),
    });
    const page = await context.newPage();

    try {
        console.log("Browser launched and new page created.");

        // Load cookies if available
        await loadCookies(context);

        // Always use the user-provided URL, ignoring any saved state
        // Navigate to X login page
        await page.goto('https://x.com/i/flow/login');
        await page.waitForTimeout(5000);
        console.log("Navigated to X login page.");
        await page.waitForTimeout(getRandomTimeout());

        // If no cookies, proceed with login
        if (!fs.existsSync('cookies.json')) {
            // Enter Username or Email
            await page.fill('input[name="text"]', 'lotfikanouni4@gmail.com');
            console.log("Username or email entered.");
            await page.waitForTimeout(getRandomTimeout());

            // Click 'Next' button using XPath
            await page.waitForSelector('xpath=//*[@id="layers"]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div/div/div/button[2]', { timeout: 30000 });
            await page.click('xpath=//*[@id="layers"]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div/div/div/button[2]');
            console.log("Next button clicked.");
            await page.waitForTimeout(getRandomTimeout());

            // Check if asked for username/phone verification
            const usernameInput = await page.$('input[name="text"]');
            if (usernameInput) {
                console.log("Additional username or phone number input detected.");
                await usernameInput.fill('lotfikanouni4@gmail.com');
                console.log("Username provided.");
                const confirmButton = await page.$('div[role="button"]:has-text("Next")');
                if (confirmButton) {
                    await confirmButton.click();
                    console.log("Confirm button clicked.");
                }
                await page.waitForTimeout(getRandomTimeout());
            }

            // Wait for Password field to be visible
            await page.waitForSelector('input[name="password"]', { state: 'visible', timeout: 30000 });
            await page.fill('input[name="password"]', '12345678Tt@');
            console.log("Password entered.");
            await page.waitForTimeout(getRandomTimeout());

            // Click 'Log In' button using XPath
            await page.waitForSelector('xpath=//*[@id="layers"]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[2]/div/div[1]/div/div/button', { timeout: 30000 });
            await page.click('xpath=//*[@id="layers"]/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[2]/div/div[1]/div/div/button');
            console.log("Login button clicked.");
            await page.waitForTimeout(getRandomTimeout());

            // Save cookies after login
            await saveCookies(context);
        }

        // Navigate to the user-specified page
        await page.goto(userUrl);
        await page.waitForTimeout(5000);
        console.log(`Navigated to the target page: ${userUrl}`);
        await page.waitForTimeout(getRandomTimeout());

        // Save the current state
        saveState(userUrl);

        // Find all elements with the data-testid="like" attribute
        const likeButtons = await page.$$('button[data-testid="like"]');

        // Function to click the first 3 buttons with random sleep intervals
        for (let i = 0; i < Math.min(3, likeButtons.length); i++) {
            console.log(`Clicking Button ${i + 1}`);
            await likeButtons[i].click(); // Click the button

            // Generate a random sleep time between 1000ms (1 sec) and 3000ms (3 sec)
            const randomSleepTime = getRandomTimeout();
            console.log(`Sleeping for ${randomSleepTime}ms`);

            // Sleep for the random interval
            await page.waitForTimeout(randomSleepTime);
        }

        // Pause the script to allow inspection
        console.log("Pausing execution for inspection. You can continue manually.");
        console.log('Pausing for manual changes. Inspect the page state and interact as needed.');
        await page.pause();

    } catch (error) {
        console.error("An error occurred: ", error);
        // Pause the script to allow inspection
        console.log("Pausing execution for error inspection. Inspect the state and make necessary changes.");
        console.log('Pausing for manual changes. Inspect the page state and interact as needed.');
        await page.pause();
    } finally {
        console.log("Execution complete, browser will remain open for inspection.");
        // Keeping the browser open for inspection instead of closing it immediately
    }
})();

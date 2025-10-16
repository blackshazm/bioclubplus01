from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Register
    page.goto("http://localhost:3000/register")
    page.fill('input[id="name"]', "Test User")
    page.fill('input[id="email"]', "test@example.com")
    page.fill('input[id="cpf"]', "11144477735")
    page.fill('input[id="password"]', "password")
    page.screenshot(path="jules-scratch/verification/register_page.png")
    page.click('button[type="submit"]')

    # Login
    page.wait_for_url("http://localhost:3000/login")
    page.fill('input[id="email"]', "test@example.com")
    page.fill('input[id="password"]', "password")
    page.screenshot(path="jules-scratch/verification/login_page.png")
    page.click('button[type="submit"]')

    # Dashboard
    page.wait_for_url("http://localhost:3000/dashboard")
    page.screenshot(path="jules-scratch/verification/dashboard_page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
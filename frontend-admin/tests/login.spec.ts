import { test, expect } from '@playwright/test';

test.describe('Admin Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('http://localhost:5174/auth/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('should display login form correctly', async ({ page }) => {
    await page.goto('http://localhost:5174/auth/login');

    // Check that all form elements are visible
    await expect(page.getByRole('textbox', { name: 'Email / Username' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Ghi nhớ đăng nhập' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Đăng nhập' })).toBeVisible();

    // Check default credentials hint
    await expect(page.getByText('admin@gmail.com')).toBeVisible();
    await expect(page.getByText('Password:', { exact: false })).toBeVisible();
  });

  test('should validate empty form submission', async ({ page }) => {
    await page.goto('http://localhost:5174/auth/login');

    // Try to submit empty form
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    // Should show validation error
    await expect(page.getByText('Vui lòng nhập đầy đủ email và mật khẩu')).toBeVisible();
  });

  test('should successfully login with valid credentials (mocked)', async ({ page }) => {
    // Mock successful login API response
    await page.route('**/api/users/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock-jwt-token-12345',
          username: 'admin',
          email: 'admin@gmail.com',
          fullName: 'Admin User',
          avatar: '',
          role: 'ADMIN',
          userId: 1
        })
      });
    });

    await page.goto('http://localhost:5174/auth/login');

    // Fill in login form
    await page.getByRole('textbox', { name: 'Email / Username' }).fill('admin@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');

    // Submit form
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    // Wait for navigation to dashboard
    await page.waitForURL('http://localhost:5174/', { timeout: 5000 });

    // Verify we're on dashboard
    expect(page.url()).toBe('http://localhost:5174/');

    // Verify localStorage was set correctly
    const token = await page.evaluate(() => localStorage.getItem('bt-admin-token'));
    const role = await page.evaluate(() => localStorage.getItem('bt-admin-role'));
    const lastActivity = await page.evaluate(() => localStorage.getItem('bt-admin-lastActivity'));

    expect(token).toBe('mock-jwt-token-12345');
    expect(role).toBe('ADMIN');
    expect(lastActivity).toBeTruthy();
  });

  test('should handle login failure with error message (mocked)', async ({ page }) => {
    // Mock failed login API response
    await page.route('**/api/users/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Email hoặc mật khẩu không đúng'
        })
      });
    });

    await page.goto('http://localhost:5174/auth/login');

    // Fill in login form with wrong credentials
    await page.getByRole('textbox', { name: 'Email / Username' }).fill('wrong@email.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpass');

    // Submit form
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    // Should show error message (using partial match due to styling)
    await expect(page.locator('text=Email hoặc mật khẩu không đúng')).toBeVisible();

    // Should still be on login page
    expect(page.url()).toContain('/auth/login');

    // Verify localStorage was NOT set
    const token = await page.evaluate(() => localStorage.getItem('bt-admin-token'));
    expect(token).toBeNull();
  });

  test('should redirect to dashboard if already authenticated', async ({ page }) => {
    // Set up authenticated state
    await page.goto('http://localhost:5174/auth/login');
    await page.evaluate(() => {
      localStorage.setItem('bt-admin-token', 'existing-token');
      localStorage.setItem('bt-admin-role', 'ADMIN');
      localStorage.setItem('bt-admin-username', 'admin');
      localStorage.setItem('bt-admin-email', 'admin@gmail.com');
      localStorage.setItem('bt-admin-lastActivity', Date.now().toString());
      localStorage.setItem('bt-admin-permissions', JSON.stringify(['TOUR_READ', 'BOOKING_READ']));
    });

    // Try to access login page
    await page.goto('http://localhost:5174/auth/login');

    // Should automatically redirect to dashboard
    await page.waitForURL('http://localhost:5174/', { timeout: 5000 });
    expect(page.url()).toBe('http://localhost:5174/');
  });

  test('should clear all localStorage keys on 401 response', async ({ page }) => {
    // Set up authenticated state
    await page.goto('http://localhost:5174/auth/login');
    await page.evaluate(() => {
      localStorage.setItem('bt-admin-token', 'expired-token');
      localStorage.setItem('bt-admin-role', 'ADMIN');
      localStorage.setItem('bt-admin-username', 'admin');
      localStorage.setItem('bt-admin-email', 'admin@gmail.com');
      localStorage.setItem('bt-admin-lastActivity', Date.now().toString());
      localStorage.setItem('bt-admin-permissions', JSON.stringify(['TOUR_READ']));
    });

    // Mock 401 response for any API call
    await page.route('**/api/**', async (route) => {
      if (route.request().url().includes('tours')) {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Unauthorized' })
        });
      } else {
        await route.continue();
      }
    });

    // Navigate to a protected route that will trigger API call
    await page.goto('http://localhost:5174/');

    // Wait a bit for potential API calls
    await page.waitForTimeout(2000);

    // Verify all localStorage keys are cleared
    const token = await page.evaluate(() => localStorage.getItem('bt-admin-token'));
    const role = await page.evaluate(() => localStorage.getItem('bt-admin-role'));
    const username = await page.evaluate(() => localStorage.getItem('bt-admin-username'));
    const email = await page.evaluate(() => localStorage.getItem('bt-admin-email'));

    expect(token).toBeNull();
    expect(role).toBeNull();
    expect(username).toBeNull();
    expect(email).toBeNull();
  });

  test('should check "Remember Me" functionality', async ({ page }) => {
    // Mock successful login
    await page.route('**/api/users/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock-token',
          username: 'admin',
          email: 'admin@gmail.com',
          role: 'ADMIN',
          userId: 1
        })
      });
    });

    await page.goto('http://localhost:5174/auth/login');

    // Fill form and check "Remember Me"
    await page.getByRole('textbox', { name: 'Email / Username' }).fill('admin@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('checkbox', { name: 'Ghi nhớ đăng nhập' }).check();

    // Submit
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    // Wait for navigation
    await page.waitForURL('http://localhost:5174/', { timeout: 5000 });

    // Verify sessionStorage does NOT have token (because rememberMe is true)
    const sessionToken = await page.evaluate(() => sessionStorage.getItem('bt-admin-session-token'));
    expect(sessionToken).toBeNull();
  });
});

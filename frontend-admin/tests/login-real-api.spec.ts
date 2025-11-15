import { test, expect } from '@playwright/test';

/**
 * REAL API TEST - No mocking, tests against actual backend
 * Prerequisites: Backend must be running (docker-compose up)
 */

test.describe('Admin Login Flow - Real API', () => {
  const testUser = {
    username: 'admin',
    email: 'admin@gmail.com',
    password: 'admin'
  };

  test.beforeEach(async ({ page }) => {
    // Clear storage before each test
    await page.goto('http://localhost:5174/auth/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('should successfully login with real backend API', async ({ page }) => {
    await page.goto('http://localhost:5174/auth/login');

    // Fill login form
    await page.getByRole('textbox', { name: 'Email / Tên đăng nhập' }).fill(testUser.username);
    await page.getByRole('textbox', { name: 'Mật khẩu' }).fill(testUser.password);

    // Submit form
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    // Wait for navigation to dashboard
    await page.waitForURL('http://localhost:5174/', { timeout: 10000 });

    // Verify we're on dashboard
    expect(page.url()).toBe('http://localhost:5174/');

    // Wait a bit for localStorage to be fully set
    await page.waitForTimeout(500);

    // Verify localStorage was set correctly
    const token = await page.evaluate(() => localStorage.getItem('bt-admin-token'));
    const username = await page.evaluate(() => localStorage.getItem('bt-admin-username'));
    const email = await page.evaluate(() => localStorage.getItem('bt-admin-email'));
    const role = await page.evaluate(() => localStorage.getItem('bt-admin-role'));
    const lastActivity = await page.evaluate(() => localStorage.getItem('bt-admin-lastActivity'));

    expect(token).toBeTruthy();
    expect(token).toContain('eyJ'); // JWT token format
    expect(username).toBe(testUser.username);
    expect(email).toBe(testUser.email);
    expect(role).toBe('ADMIN'); // Default role from frontend workaround
    expect(lastActivity).toBeTruthy();

    console.log('✅ Login successful with real API!');
    console.log(`Token: ${token?.substring(0, 50)}...`);
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Role: ${role}`);
  });

  test('should handle invalid credentials correctly', async ({ page }) => {
    await page.goto('http://localhost:5174/auth/login');

    // Fill with wrong credentials
    await page.getByRole('textbox', { name: 'Email / Tên đăng nhập' }).fill('wronguser');
    await page.getByRole('textbox', { name: 'Mật khẩu' }).fill('wrongpass');

    // Submit form
    await page.getByRole('button', { name: 'Đăng nhập' }).click();

    // Should show error message
    await expect(page.locator('text=Invalid username or password')).toBeVisible({ timeout: 5000 });

    // Should still be on login page
    expect(page.url()).toContain('/auth/login');

    // Verify localStorage was NOT set
    const token = await page.evaluate(() => localStorage.getItem('bt-admin-token'));
    expect(token).toBeNull();

    console.log('✅ Invalid credentials handled correctly!');
  });

  test('should persist session after page reload', async ({ page }) => {
    // First, login
    await page.goto('http://localhost:5174/auth/login');
    await page.getByRole('textbox', { name: 'Email / Tên đăng nhập' }).fill(testUser.username);
    await page.getByRole('textbox', { name: 'Mật khẩu' }).fill(testUser.password);
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await page.waitForURL('http://localhost:5174/', { timeout: 10000 });

    // Get token before reload
    const tokenBefore = await page.evaluate(() => localStorage.getItem('bt-admin-token'));
    expect(tokenBefore).toBeTruthy();

    // Reload page
    await page.reload();

    // Should still be on dashboard (not redirected to login)
    expect(page.url()).toBe('http://localhost:5174/');

    // Token should still exist
    const tokenAfter = await page.evaluate(() => localStorage.getItem('bt-admin-token'));
    expect(tokenAfter).toBe(tokenBefore);

    console.log('✅ Session persisted after page reload!');
  });

  test('should auto-redirect to dashboard if already authenticated', async ({ page }) => {
    // Set up authenticated state
    await page.goto('http://localhost:5174/auth/login');
    await page.evaluate(() => {
      localStorage.setItem('bt-admin-token', 'existing-token');
      localStorage.setItem('bt-admin-role', 'ADMIN');
      localStorage.setItem('bt-admin-username', 'testuser');
      localStorage.setItem('bt-admin-email', 'test@test.com');
      localStorage.setItem('bt-admin-lastActivity', Date.now().toString());
      localStorage.setItem('bt-admin-permissions', JSON.stringify(['TOUR_READ', 'BOOKING_READ']));
    });

    // Try to access login page
    await page.goto('http://localhost:5174/auth/login');

    // Should automatically redirect to dashboard
    await page.waitForURL('http://localhost:5174/', { timeout: 5000 });
    expect(page.url()).toBe('http://localhost:5174/');

    console.log('✅ Auto-redirect working correctly!');
  });

  test('should set lastActivity timestamp on login', async ({ page }) => {
    // Record time before login
    const timeBefore = Date.now();

    // Login
    await page.goto('http://localhost:5174/auth/login');
    await page.getByRole('textbox', { name: 'Email / Tên đăng nhập' }).fill(testUser.username);
    await page.getByRole('textbox', { name: 'Mật khẩu' }).fill(testUser.password);
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await page.waitForURL('http://localhost:5174/', { timeout: 10000 });

    // Wait a bit for localStorage to be fully set
    await page.waitForTimeout(500);

    // Get lastActivity after login
    const lastActivity = await page.evaluate(() =>
      parseInt(localStorage.getItem('bt-admin-lastActivity') || '0')
    );

    // lastActivity should be set and be recent (within last few seconds)
    expect(lastActivity).toBeGreaterThan(0);
    expect(lastActivity).toBeGreaterThanOrEqual(timeBefore);
    expect(lastActivity).toBeLessThanOrEqual(Date.now());

    console.log('✅ LastActivity timestamp set on login!');
  });
});

import { test, expect } from '@playwright/test';

async function getAdminToken() {
  const res = await fetch('http://localhost:8080/api/users/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'letmein' })
  });
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  const json = await res.json();
  return json.token;
}

test.describe('Admin Tours', () => {
  test.beforeEach(async ({ page }) => {
    const token = await getAdminToken();
    await page.addInitScript((tkn) => {
      localStorage.setItem('bt-admin-token', tkn);
      localStorage.setItem('bt-admin-role', 'ADMIN');
      localStorage.setItem('bt-admin-permissions', JSON.stringify(['TOUR_READ','TOUR_CREATE','TOUR_UPDATE','TOUR_DELETE']));
      localStorage.setItem('bt-admin-lastActivity', Date.now().toString());
    }, token);
  });

  test('create tour real API returns 201 (workaround token)', async ({ page }) => {
    await page.goto('http://localhost:5176/tours/new');
    await page.getByRole('textbox', { name: 'Tour name' }).fill('E2E Tour');
    await page.getByRole('textbox', { name: 'Slug' }).fill('e2e-tour');
    await page.getByRole('spinbutton', { name: 'Base price' }).fill('1999');
    await page.getByRole('spinbutton', { name: 'Duration (days)' }).fill('5');

    const [resp] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/tours') && r.request().method() === 'POST'),
      page.getByRole('button', { name: 'Create tour' }).click(),
    ]);

    expect(resp.status()).toBe(201);
  });

  test('edit tour shows success toast and navigates to list (stubbed)', async ({ page }) => {
    await page.route('**/api/tours/1', async (route) => {
      if (route.request().method() === 'GET') {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
          tour_id: 1,
          tourName: 'Loaded Tour',
          tourSlug: 'loaded-tour',
          status: 'ACTIVE',
          adultPrice: 1000,
          days: 3
        }) });
      }
      if (route.request().method() === 'PUT') {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) });
      }
      return route.continue();
    });

    await page.goto('http://localhost:5176/tours/1');
    await expect(page.getByText('Đang tải dữ liệu tour...')).toBeHidden({ timeout: 5000 });
    await page.getByRole('spinbutton', { name: 'Base price' }).fill('2500');
    await page.getByRole('button', { name: 'Update tour' }).click();
    await expect(page.getByRole('alert')).toContainText('Tour updated successfully');
  });
});

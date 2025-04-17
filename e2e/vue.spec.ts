import { test, expect } from '@playwright/test';

// See here how to get started:
// https://playwright.dev/docs/intro
// test('visits the app root url', async ({ page }) => {
//   await page.goto('/');
//   await expect(page.locator('h1')).toHaveText('You did it!');
// })


test('redirect to signup', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/signup');
});


test('switch to login/signup', async ({ page }) => {
  await page.goto('/signup');
  await expect(page.locator('#signIn-tab')).toHaveAttribute('aria-selected', 'true');
  await page.locator('#signUp-tab').click();
  await expect(page.locator('#signUp-tab')).toHaveAttribute('aria-selected', 'true');
  await page.locator('#signIn-tab').click();
});

test('fields signIn', async ({ page }) => {
  await page.goto('/signup');
  await expect(page.getByPlaceholder('Enter your Email')).toBeVisible();
  await expect(page.getByPlaceholder('Enter your Password')).toBeVisible();
});

test('fields signUp', async ({ page }) => {
  await page.goto('/signup');
  await page.locator('#signUp-tab').click();
  await expect(page.getByPlaceholder('Enter your Email')).toBeVisible();
  await expect(page.getByPlaceholder('Enter your Password')).toBeVisible();
  await expect(page.getByPlaceholder('Please confirm your Password')).toBeVisible();
  await expect(page.getByPlaceholder('Enter your Name')).toBeVisible();
});

test('forgot password', async ({ page }) => {
  await page.goto('/signup');
  await expect(page.getByText('Reset Password')).not.toBeVisible();
  await page.getByText('Forgot your password?').click();
  await expect(page.getByText('Reset Password')).toBeVisible();
});

test('error signIn', async ({ page }) => {
  await page.goto('/signup');
  await page.getByPlaceholder('Enter your Email').fill('a@a');
  await page.getByPlaceholder('Enter your Password').fill('a');
  await page.getByRole('button', { name: 'Sign In' }).last().click();
  await expect(page.getByText('User does not exist.')).toBeVisible();
});
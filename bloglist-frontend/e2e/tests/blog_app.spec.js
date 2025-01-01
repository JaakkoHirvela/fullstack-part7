const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blogs app", () => {
  beforeEach(async ({ page, request }) => {
    const response = await request.post("/api/testing/reset");
    await expect(response.status()).toBe(204);
    await request.post("/api/users", {
      data: {
        name: "Teppo Testi",
        username: "testiteuvo",
        password: "salasana",
      },
    });
    await request.post("/api/users", {
      data: {
        name: "Väärä Teppo",
        username: "wrongteuvo",
        password: "salasana",
      },
    });
    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    const loginButton = await page.getByText("login");
    const usernameInput = await page.getByTestId("username");
    const passwordInput = await page.getByTestId("password");
    await expect(loginButton).toBeVisible();
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "testiteuvo", "salasana");
      await expect(page.getByText("Logged in successfully as Teppo Testi")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "testiteuvo", "wronk");
      await expect(page.getByText("wrong username or password")).toBeVisible();
    });
  });

  describe("When logged in", () => {
    test("A blog can be created", async ({ page }) => {
      await loginWith(page, "testiteuvo", "salasana");
      await createBlog(page, "Test blog", "Test Author", "http://test.com");

      await expect(page.getByText("Test blog Test Author")).toBeVisible();
    });

    test("A blog can be liked", async ({ page }) => {
      await loginWith(page, "testiteuvo", "salasana");
      await createBlog(page, "Test blog", "Test Author", "http://test.com");

      // View the details
      await page.getByText("view").click();

      // Check that the likes are 0
      await expect(page.getByText("likes 0")).toBeVisible();

      // Like the blog
      await page.getByText("like").click();

      // Check that the likes are now 1
      await expect(page.getByText("likes 1")).toBeVisible();
    });

    test("A blog can be deleted", async ({ page }) => {
      await loginWith(page, "testiteuvo", "salasana");
      await createBlog(page, "Test blog", "Test Author", "http://test.com");

      // View the details
      await page.getByText("view").click();

      // Delete the blog
      page.on("dialog", async (dialog) => {
        await dialog.accept();
      });
      await page.getByText("remove").click();

      // Check that the blog is not visible
      await expect(page.getByText("Test blog Test Author")).not.toBeVisible();
    });

    test("Only the blog creator sees the remove button", async ({ page }) => {
      await loginWith(page, "testiteuvo", "salasana");
      await createBlog(page, "Test blog", "Test Author", "http://test.com");

      // View the details
      await page.getByText("view").click();

      // Check that the remove button is visible
      await expect(page.getByText("remove")).toBeVisible();

      // Logout
      await page.getByText("logout").click();

      // Login with another user
      await loginWith(page, "wrongteuvo", "salasana");

      // View the details
      await page.getByText("view").click();

      // Check that the remove button is not visible
      await expect(page.getByText("remove")).not.toBeVisible();
    });

    test("Blogs are ordered by likes", async ({ page }) => {
      await loginWith(page, "testiteuvo", "salasana");
      await createBlog(page, "Test blog 1", "Test Author", "http://test.com");
      await createBlog(page, "Test blog 2", "Test Author", "http://test.com");
      await createBlog(page, "Test blog 3", "Test Author", "http://test.com");

      // Wait for the blogs to be fully visible before proceeding
      await expect(page.getByText("Test blog 3 Test Author")).toBeVisible();

      // View the details for all blogs
      const viewButtons = await page.getByText("view").all();
      expect(viewButtons.length).toBe(3);
      for (const viewButton of viewButtons) {
        await viewButton.click();
      }

      // Like the blogs
      const likeButtons = await page.getByText("like").all();

      // 3 likes for the second blog. Make sure that each like is registered.
      await likeButtons[1].click(); 
      await expect(page.getByText("likes 1")).toBeVisible();
      await likeButtons[1].click();
      await expect(page.getByText("likes 2")).toBeVisible();
      await likeButtons[1].click();
      await expect(page.getByText("likes 3")).toBeVisible();
      
      // 1 like for one of the other blogs.
      await likeButtons[2].click(); 
      await expect(page.getByText("likes 1")).toBeVisible();

      // Check that the blogs are ordered correctly
      const blogs = await page.locator(".blog").all();
      expect(blogs.length).toBe(3);

      expect(await blogs[0].innerText()).toContain("likes 3");
      expect(await blogs[1].innerText()).toContain("likes 1");
      expect(await blogs[2].innerText()).toContain("likes 0");
    });
  });
});

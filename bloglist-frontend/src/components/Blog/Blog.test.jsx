import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { beforeEach, describe, expect } from "vitest";

describe("Blog component", () => {
  const testUser = {
    name: "Test User",
    username: "testuser",
    id: "12345",
  };
  const testBlog = {
    title: "This is the test blog",
    author: "Test Author",
    url: "http://test.url",
    likes: 0,
    user: testUser,
  };

  let container;
  let mockLike;

  beforeEach(() => {
    mockLike = vi.fn();
    const handleDelete = () => {};
    container = render(<Blog blog={testBlog} user={testUser} handleDelete={handleDelete} handleLike={mockLike} />).container;
  });

  test("renders content, default view", () => {
    // Check that the blog title and author are rendered.
    screen.getByText("This is the test blog Test Author");

    // Check that the togglable content is not visible.
    const togglableDiv = container.querySelector(".togglableContent");
    expect(togglableDiv).toHaveStyle("display: none");
  });

  test("renders content, expanded view", async () => {
    // Setup the userEvent library.
    const user = userEvent.setup();

    // Click the view button to expand the blog.
    const button = screen.getByText("view");
    await user.click(button);

    // Check that the blog title and author are rendered.
    screen.getByText("This is the test blog Test Author");

    // Check that the blog url is rendered.
    screen.getByText("http://test.url");

    // Check that the blog user name is rendered.
    screen.getByText("Test User");

    // Check that the blog likes are rendered.
    screen.getByText("likes 0");

    // Check that the togglable content is visible.
    const togglableDiv = container.querySelector(".togglableContent");
    expect(togglableDiv).not.toHaveStyle("display: none");
  });

  test("handleLike is called 2 times when clicked 2 times", async () => {
    // Setup the userEvent library.
    const user = userEvent.setup();

    // Click the like button twice.
    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockLike).toHaveBeenCalledTimes(2);
  });
});

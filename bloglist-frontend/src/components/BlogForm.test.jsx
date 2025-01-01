import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect } from "vitest";
import BlogForm from "./BlogForm";

describe("BlogForm component", () => {
  let container;
  let mockCreate;

  beforeEach(() => {
    mockCreate = vi.fn();
    container = render(<BlogForm createBlog={mockCreate} />).container;
  });

  test("Blog creation is called with correct info", async () => {
    const testTitle = "Test Blog Title";
    const testAuthor = "Test Author";
    const testUrl = "http://test.url";

    // Setup the userEvent library.
    const user = userEvent.setup();

    // Get the input fields.
    const titleInput = container.querySelector("input[name='title']");
    const authorInput = container.querySelector("input[name='author']");
    const urlInput = container.querySelector("input[name='url']");

    // Fill in the input fields.
    await user.type(titleInput, testTitle);
    await user.type(authorInput, testAuthor);
    await user.type(urlInput, testUrl);

    // Submit the form.
    const createButton = screen.getByText("create");
    await user.click(createButton);

    // Check that the createBlog function was called with the correct info.
    expect(mockCreate).toHaveBeenCalledWith({
      title: testTitle,
      author: testAuthor,
      url: testUrl,
    });
  });
});

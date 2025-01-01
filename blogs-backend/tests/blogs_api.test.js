const { test, after, beforeEach, describe, before } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../src/app");
const Blog = require("../src/models/blog");
const logger = require("../src/utils/logger");
const User = require("../src/models/user");

const api = supertest(app);
const testedRoute = "/api/blogs";

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
];

const nonExistingId = "5a422b3a1b54a676234d17f0";
let token;

// Log the test user in.
before(async () => {
  await User.deleteMany({});

  const testUser = {
    username: "johndoe",
    name: "John Doe",
    password: "password",
  };
  await api.post("/api/users").send(testUser);

  const response = await api.post("/api/login").send({ username: "johndoe", password: "password" });
  token = response.body.token;
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

describe(`${testedRoute}`, () => {
  describe(`GET ${testedRoute}`, () => {
    test("blogs are returned as json", async () => {
      await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("there's three blogs", async () => {
      const response = await api.get("/api/blogs");
      assert.strictEqual(response.body.length, initialBlogs.length);
    });

    test("the identification field is id instead of default _id", async () => {
      const response = await api.get("/api/blogs");
      assert(response.body[0]._id === undefined);
      assert(response.body[0].id);
    });
  });

  describe(`POST ${testedRoute}`, () => {
    test("a valid blog can be added", async () => {
      const newBlog = {
        title: "Test blog",
        author: "Test author",
        url: "https://test.com",
        likes: 0,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", "Bearer " + token)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");
      const lastBlog = response.body[response.body.length - 1];

      // Check that the response body has one more blog than the initial blogs.
      assert.strictEqual(response.body.length, initialBlogs.length + 1);

      // Check that the last blog has the same title as the just added blog.
      assert.strictEqual(lastBlog.title, newBlog.title);
    });

    test("if added blog has no likes-field, default to 0", async () => {
      const newBlog = {
        title: "Test blog",
        author: "Test author",
        url: "https://test.com",
      };

      await api
        .post("/api/blogs")
        .set("Authorization", "Bearer " + token)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");
      const lastBlog = response.body[response.body.length - 1];

      assert.strictEqual(lastBlog.likes, 0);
    });

    test("if added blog has no title, respond with 400", async () => {
      const newBlogNoTitle = {
        author: "Test author",
        url: "https://test.com",
      };
      await api
        .post("/api/blogs")
        .send(newBlogNoTitle)
        .set("Authorization", "Bearer " + token)
        .expect(400);

      // Make sure the blog was not added.
      const response = await api.get("/api/blogs");
      assert.strictEqual(response.body.length, initialBlogs.length);
    });

    test("if added blog has no url, respond with 400", async () => {
      const noUrl = {
        title: "Test title",
        author: "Test author",
      };
      await api
        .post("/api/blogs")
        .set("Authorization", "Bearer " + token)
        .send(noUrl)
        .expect(400);

      // Make sure the blog was not added.
      const response = await api.get("/api/blogs");
      assert.strictEqual(response.body.length, initialBlogs.length);
    });

    test("if request doesn't have token, respond with 401", async () => {
      const newBlog = {
        title: "Test blog",
        author: "Test author",
        url: "https://test.com",
        likes: 0,
      };

      await api
        .post("/api/blogs")
        // No token
        .send(newBlog)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      // Make sure the blog was not added.
      const response = await api.get("/api/blogs");
      assert.strictEqual(response.body.length, initialBlogs.length);
    });
  });

  describe(`DELETE ${testedRoute}/:id`, () => {
    test("deleting a blog returns 204", async () => {
      const postResponse = await api
        .post("/api/blogs")
        .set("Authorization", "Bearer " + token)
        .send({
          title: "Test blog",
          author: "Edsger W. Dijkstra",
          url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
          likes: 10,
        });
      const newBlogId = postResponse.body.id;

      await api
        .delete(`/api/blogs/${newBlogId}`)
        .set("Authorization", "Bearer " + token)
        .expect(204);

      const response = await api.get("/api/blogs");

      // We add and delete a blog, so the amount of blogs should be the same as the initial amount.
      assert.strictEqual(response.body.length, initialBlogs.length);
    });

    test("deleting a non-existing blog should return 404", async () => {
      await api
        .delete(`/api/blogs/${nonExistingId}`)
        .set("Authorization", "Bearer " + token)
        .expect(404);
      const response = await api.get("/api/blogs");
      assert.strictEqual(response.body.length, initialBlogs.length);
    });

    test("deleting a blog with invalid id should return 400", async () => {
      const invalidId = "12414";

      await api
        .delete(`/api/blogs/${invalidId}`)
        .set("Authorization", "Bearer " + token)
        .expect(400);
    });
  });

  describe(`PUT ${testedRoute}/:id`, () => {
    test("updating a blog", async () => {
      const updatedBlog = {
        title: "Updated title",
        author: "Updated author",
        url: "https://updated.com",
        likes: 100,
      };

      await api
        .put(`/api/blogs/${initialBlogs[0]._id}`)
        .set("Authorization", "Bearer " + token)
        .send(updatedBlog)
        .expect(200);

      const response = await api.get("/api/blogs");

      // Check that no blog was added or deleted.
      assert.strictEqual(response.body.length, initialBlogs.length);

      const likes = response.body.map((blog) => blog.likes);
      assert(likes.includes(100));
    });

    test("updating a blog with invalid id should return 400", async () => {
      const invalidId = "12414";

      await api
        .put(`/api/blogs/${invalidId}`)
        .set("Authorization", "Bearer " + token)
        .expect(400);
    });

    test("updating a non-existing blog should return 404", async () => {
      await api
        .put(`/api/blogs/${nonExistingId}`)
        .set("Authorization", "Bearer " + token)
        .expect(404);
    });
  });
});

after(async () => {
  mongoose.connection.close();
});

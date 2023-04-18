import axios from "axios";
import { CollectionIn } from "../types";

describe("API", () => {
  const authToken = "myAuthToken";
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/",
    headers: {
      "Content-Type": "application/json",
      Authorization: authToken,
    },
  });

  it("should check heartbeat", async () => {
    const response = await axiosInstance.get("heartbeat");
    expect(response.data).toBe(true);
  });

  it("should create a collection", async () => {
    const collection: CollectionIn = {
      title: "Test Collection",
      description: "A test collection",
    };

    const file1 = new File(["test content"], "document1.txt", {
      type: "text/plain",
    });
    const file2 = new File(["test content"], "document2.txt", {
      type: "text/plain",
    });

    const formData = new FormData();
    formData.append("title", collection.title);
    formData.append("description", collection.description);
    formData.append("files", file1);
    formData.append("files", file2);

    const response = await axiosInstance.post("collections/create", formData);
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      title: collection.title,
      description: collection.description,
    });
  });

  it("should query a collection", async () => {
    const collectionId = 1;
    const queryStr = "test query";

    const response = await axiosInstance.post(
      `collections/${collectionId}/query`,
      {
        collection_id: collectionId,
        query_str: queryStr,
      }
    );
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("response");
  });

  it("should get all available collections", async () => {
    const response = await axiosInstance.get("collections/available");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it("should add a file to a collection", async () => {
    const collectionId = 1;
    const file = new File(["test content"], "test.txt", { type: "text/plain" });
    const description = "A test file";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description);

    const response = await axiosInstance.post(
      `collections/${collectionId}/add_file`,
      formData
    );
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("message");
  });
});

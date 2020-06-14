import { getAbsoluteUrl, getCanonicalUrl } from "../urlUtilities";

describe("URL utilities", () => {
  describe("getAbsoluteUrl", () => {
    it("handles a path with a leading slash and a base URL without a trailing slash", () => {
      const result = getAbsoluteUrl("https://evrim.io", "/test");

      expect(result).toEqual("https://evrim.io/test");
    });

    it("handles a path without a leading slash and a base URL without a trailing slash", () => {
      const result = getAbsoluteUrl("https://evrim.io", "test");

      expect(result).toEqual("https://evrim.io/test");
    });

    it("handles a path with a leading slash and a base URL with a trailing slash", () => {
      const result = getAbsoluteUrl("https://evrim.io/", "/test");

      expect(result).toEqual("https://evrim.io/test");
    });

    it("handles a path without a leading slash and a base URL with a trailing slash", () => {
      const result = getAbsoluteUrl("https://evrim.io/", "test");

      expect(result).toEqual("https://evrim.io/test");
    });
  });

  describe("getCanonicalUrl", () => {
    const baseUrl = "https://covid19.evrim.io";

    it("handles URLs with query params", () => {
      const urls = [
        "https://www.example.com/test?param1=1&param2=2",
        "https://example.com/test?param1=1&param2=2",
        "www.example.com/test?param1=1&param2=2",
        "example.com/test?param1=1&param2=2",
      ];
      const paramsToKeep = ["param2"];

      urls.forEach((url) => {
        const result = getCanonicalUrl(url, baseUrl, paramsToKeep);

        expect(result).toEqual("https://covid19.evrim.io/test?param2=2");
      });
    });

    it("handles URLs without query params", () => {
      const urls = [
        "https://www.example.com/test",
        "https://example.com/test",
        "www.example.com/test",
        "example.com/test",
      ];
      const paramsToKeep = ["param2"];

      urls.forEach((url) => {
        const result = getCanonicalUrl(url, baseUrl, paramsToKeep);

        expect(result).toEqual("https://covid19.evrim.io/test");
      });
    });

    it("keeps all parameters when `paramsToKeep` is not given", () => {
      const url = "https://www.example.com/test?param1=1&param2=2";

      const result = getCanonicalUrl(url, baseUrl);

      expect(result).toEqual("https://covid19.evrim.io/test?param1=1&param2=2");
    });

    it("handles the case when the given URL has no sub-path", () => {
      const url = "http://localhost:3000/";
      const result = getCanonicalUrl(url, baseUrl);

      expect(result).toEqual("https://covid19.evrim.io/");
    });
  });
});

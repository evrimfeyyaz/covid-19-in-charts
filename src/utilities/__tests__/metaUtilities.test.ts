import { createPageTitle } from "../metaUtilities";

describe("Meta utilities", () => {
  describe("createPageTitle", () => {
    it("returns a title with the given page name", () => {
      const baseTitle = "Test Base Title";
      const pageName = "Test Page";

      const result = createPageTitle(baseTitle, pageName);

      expect(result).toContain(pageName);
      expect(result).toContain(baseTitle);
    });

    it("returns the base title when no page name is given", () => {
      const baseTitle = "Test Base Title";

      const result = createPageTitle(baseTitle);

      expect(result).toEqual(baseTitle);
    });
  });
});

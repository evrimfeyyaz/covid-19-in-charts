import "fake-indexeddb/auto";
import { App } from "../App";
import { render, screen, waitForElementToBeRemoved, within } from "../utilities/testUtilities";

describe("App", () => {
  beforeEach(async () => {
    render(<App />);

    await waitForElementToBeRemoved(() => screen.getByRole("status"));
  });

  it("renders the title", () => {
    expect(screen.getByText("COVID-19 in Charts")).toBeInTheDocument();
  });

  it("renders the navigation bar", () => {
    const navBar = screen.getAllByRole("navigation")[0];
    const withinNavBar = within(navBar);

    const aboutLink = withinNavBar.queryByRole("link", { name: /about/i });
    const homeLink = withinNavBar.queryByRole("link", { name: /covid-19 in charts/i });

    expect(aboutLink).toBeInTheDocument();
    expect(homeLink).toBeInTheDocument();
  });
});

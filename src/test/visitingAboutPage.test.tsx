import userEvent from "@testing-library/user-event";
import "fake-indexeddb/auto";
import { App } from "../App";
import { act, render, screen, waitForElementToBeRemoved } from "../utilities/testUtilities";

describe("Visiting the about page", () => {
  test("The user can visit the about page", async () => {
    render(<App />);

    await waitForElementToBeRemoved(() => screen.getByRole("status"));

    await act(async () => {
      userEvent.click(screen.getAllByRole("link", { name: /about/i })[0]);
    });

    expect(screen.queryByRole("heading", { name: /about/i })).toBeInTheDocument();
  });
});

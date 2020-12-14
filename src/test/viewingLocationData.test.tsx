import { COVID19API } from "@evrimfeyyaz/covid-19-api";
import userEvent from "@testing-library/user-event";
import "fake-indexeddb/auto";
import { App } from "../App";
import { FormattedValuesOnDate, getFormattedValuesOnDate } from "../utilities/covid19ApiUtilities";
import {
  act,
  cleanup,
  render,
  screen,
  waitForElementToBeRemoved,
  within,
} from "../utilities/testUtilities";

/**
 * Imitates the user changing the location using the auto-complete input, and waits for the page to
 * re-render with the new location.
 *
 * @param location Location name (not case-sensitive).
 */
async function changeLocation(location: string): Promise<void> {
  const locationInput = screen.getByLabelText(/location/i);

  userEvent.clear(locationInput);
  userEvent.type(locationInput, location);
  const locationName = new RegExp(location, "i");
  const countryWithNoDataOption = screen.getByRole("link", { name: locationName, exact: false });

  await act(async () => {
    await userEvent.click(countryWithNoDataOption);
  });
}

/**
 * Imitates the user changing the minimum confirmed cases using the select input, and waits for the
 * page to re-render with the new setting.
 *
 * @param minConfirmedCases `"off"` for turning this feature off, or one of `"10"`, `"100"`,
 *   `"1000"`, `"10000"`, `"100000"`.
 */
async function changeMinConfirmedCases(
  minConfirmedCases: "10" | "100" | "1000" | "10000" | "100000" | "off"
): Promise<void> {
  const minConfirmedCasesInput = screen.getByLabelText(/minimum confirmed cases/i);

  await act(async () => {
    userEvent.selectOptions(minConfirmedCasesInput, minConfirmedCases);
  });
}

async function renderApp(): Promise<void> {
  render(<App />);

  await waitForElementToBeRemoved(() => screen.getByRole("status"));
}

async function rerenderApp(): Promise<void> {
  cleanup();
  await act(async () => {
    await renderApp();
  });
}

describe("Viewing location data", () => {
  beforeEach(async () => {
    localStorage.clear();
    await renderApp();
  });

  test("The default location (USA) is shown at the first visit", () => {
    expect(screen.getByText(/covid-19: the us/i)).toBeInTheDocument();
  });

  describe("Sections", () => {
    let latestNumbers: FormattedValuesOnDate;

    beforeAll(async () => {
      const mockStore = new COVID19API();
      const usData = await mockStore.getDataByLocation("US");
      latestNumbers = getFormattedValuesOnDate(usData.values[usData.values.length - 1]);
    });

    test("The user can see the latest values information", () => {
      const {
        activeCases,
        confirmed,
        newConfirmed,
        recovered,
        newRecovered,
        deaths,
        newDeaths,
        recoveryRate,
        caseFatalityRate,
      } = latestNumbers;

      const latestConfirmedCardContainer = screen.getByTestId("latest-confirmed-card-container");
      const latestDeathsCardContainer = screen.getByTestId("latest-deaths-card-container");
      const latestRecoveredCardContainer = screen.getByTestId("latest-recovered-card-container");

      expect(within(latestConfirmedCardContainer).queryByText(confirmed)).toBeInTheDocument();
      expect(
        within(latestConfirmedCardContainer).queryByText(`+${newConfirmed}`)
      ).toBeInTheDocument();
      expect(within(latestDeathsCardContainer).queryByText(deaths ?? "")).toBeInTheDocument();
      expect(within(latestDeathsCardContainer).queryByText(`+${newDeaths}`)).toBeInTheDocument();
      expect(
        within(latestDeathsCardContainer).queryByText(`(${caseFatalityRate})`)
      ).toBeInTheDocument();
      expect(within(latestRecoveredCardContainer).queryByText(recovered ?? "")).toBeInTheDocument();
      expect(
        within(latestRecoveredCardContainer).queryByText(`+${newRecovered}`)
      ).toBeInTheDocument();
      expect(
        within(latestRecoveredCardContainer).queryByText(`(${recoveryRate})`)
      ).toBeInTheDocument();
      expect(
        screen.queryByTextWithMarkup(`${activeCases} active confirmed cases`)
      ).toBeInTheDocument();
    });

    test("The user can see the information on confirmed cases", () => {
      const { confirmed } = latestNumbers;

      expect(
        screen.queryByTextWithMarkup(`${confirmed} confirmed cases to date`)
      ).toBeInTheDocument();
    });

    test("The user can see the information on new cases", () => {
      const { newConfirmed } = latestNumbers;

      const regex = new RegExp(
        `there were[\\s\\S.]*${newConfirmed}[\\s\\S.]*new cases[\\s\\S.]*on`,
        "i"
      );

      expect(screen.queryByTextWithMarkup(regex)).toBeInTheDocument();
    });

    test("The user can see the information on deaths", () => {
      const { deaths } = latestNumbers;

      expect(screen.queryByTextWithMarkup(`${deaths} deaths to date`)).toBeInTheDocument();
    });

    test("The user can see the information on new deaths", () => {
      const { newDeaths } = latestNumbers;

      const regex = new RegExp(
        `there were[\\s\\S.]*${newDeaths}[\\s\\S.]*new deaths[\\s\\S.]*on`,
        "i"
      );

      expect(screen.queryByTextWithMarkup(regex)).toBeInTheDocument();
    });

    test("The user can see the information on recoveries", () => {
      const { recovered } = latestNumbers;

      expect(
        screen.queryByTextWithMarkup(`${recovered} recoveries to date on`)
      ).toBeInTheDocument();
    });

    test("The user can see the information on new recoveries", () => {
      const { newRecovered } = latestNumbers;

      const regex = new RegExp(
        `there were[\\s\\S.]*${newRecovered}[\\s\\S.]*new recoveries[\\s\\S.]*on`,
        "i"
      );

      expect(screen.queryByTextWithMarkup(regex)).toBeInTheDocument();
    });

    test("The user can see the overall information", () => {
      const { caseFatalityRate, recoveryRate } = latestNumbers;

      expect(
        screen.queryByTextWithMarkup(`case fatality rate was ${caseFatalityRate}`)
      ).toBeInTheDocument();
      expect(screen.queryByTextWithMarkup(`recovery rate was ${recoveryRate}`)).toBeInTheDocument();
    });
  });

  test("The user can change the location", async () => {
    await changeLocation("turkey");

    expect(screen.getByText(/covid-19: turkey/i)).toBeInTheDocument();
  });

  test("The user can change the minimum confirmed cases", async () => {
    await changeMinConfirmedCases("1000");

    expect(screen.getAllByText(/cases exceeded 1,000/i)).toHaveLength(7);
  });

  describe("Exponential moving average", () => {
    test("The exponential moving average information is shown", async () => {
      expect(screen.getAllByText(/15-day exponential moving average/i)).toHaveLength(2);
    });

    test("The exponential moving average information is not shown when there isn't enough data to calculate it", async () => {
      await changeMinConfirmedCases("1000");

      expect(screen.queryByText(/15-day exponential moving average/i)).not.toBeInTheDocument();
    });
  });

  test("The user is notified when there is no data to show", async () => {
    await changeLocation("nodata republic");

    expect(screen.queryByText(/no data to show/i)).toBeInTheDocument();
  });

  test("User settings are persisted", async () => {
    expect(screen.queryByText(/covid-19: turkey/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/covid-19: the us/i)).toBeInTheDocument();

    await changeLocation("turkey");

    expect(screen.queryByText(/covid-19: turkey/i)).toBeInTheDocument();
    expect(screen.queryByText(/covid-19: the us/i)).not.toBeInTheDocument();

    await rerenderApp();

    expect(screen.queryByText(/covid-19: turkey/i)).toBeInTheDocument();
    expect(screen.queryByText(/covid-19: the us/i)).not.toBeInTheDocument();
  });

  test("The recoveries and overall information is hidden when the selected location has no recoveries data", async () => {
    await changeLocation("norecoveriesistan");

    const latestRecoveriesCardContainer = screen.getByTestId("latest-recovered-card-container");

    expect(within(latestRecoveriesCardContainer).queryByText(/no data/i)).toBeInTheDocument();
    expect(within(latestRecoveriesCardContainer).queryByText(/%/i)).not.toBeInTheDocument();
    expect(within(latestRecoveriesCardContainer).queryByText(/why/i)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Overall" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Recoveries" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "New Recoveries" })).not.toBeInTheDocument();
  });

  describe("Locations with incomplete or missing recoveries data", () => {
    test("No recoveries and overall information is shown for the UK", async () => {
      await changeLocation("united kingdom");

      const latestRecoveriesCardContainer = screen.getByTestId("latest-recovered-card-container");

      expect(within(latestRecoveriesCardContainer).queryByText(/no data/i)).toBeInTheDocument();
      expect(within(latestRecoveriesCardContainer).queryByText(/%/i)).not.toBeInTheDocument();
      expect(within(latestRecoveriesCardContainer).queryByText(/why/i)).toBeInTheDocument();
      expect(screen.queryByText("active confirmed cases")).not.toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Overall" })).not.toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Recoveries" })).not.toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "New Recoveries" })).not.toBeInTheDocument();
    });

    test("No recoveries and overall information is shown for the Netherlands", async () => {
      await changeLocation("netherlands");

      const latestRecoveriesCardContainer = screen.getByTestId("latest-recovered-card-container");

      expect(within(latestRecoveriesCardContainer).queryByText(/no data/i)).toBeInTheDocument();
      expect(within(latestRecoveriesCardContainer).queryByText(/%/i)).not.toBeInTheDocument();
      expect(within(latestRecoveriesCardContainer).queryByText(/why/i)).toBeInTheDocument();
      expect(screen.queryByText("active confirmed cases")).not.toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Overall" })).not.toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Recoveries" })).not.toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "New Recoveries" })).not.toBeInTheDocument();
    });

    test("No recoveries and overall information is shown for Sweden", async () => {
      await changeLocation("sweden");

      const latestRecoveriesCardContainer = screen.getByTestId("latest-recovered-card-container");

      expect(within(latestRecoveriesCardContainer).queryByText(/no data/i)).toBeInTheDocument();
      expect(within(latestRecoveriesCardContainer).queryByText(/%/i)).not.toBeInTheDocument();
      expect(within(latestRecoveriesCardContainer).queryByText(/why/i)).toBeInTheDocument();
      expect(screen.queryByText("active confirmed cases")).not.toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Overall" })).not.toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Recoveries" })).not.toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "New Recoveries" })).not.toBeInTheDocument();
    });
  });
});

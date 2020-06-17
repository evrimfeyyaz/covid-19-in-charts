import { COVID19API, ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import userEvent from "@testing-library/user-event";
import "fake-indexeddb/auto";
import React from "react";
import { App } from "../App";
import { numToGroupedString, numToPercentFactory } from "../utilities/numUtilities";
import { act, render, screen, waitForElementToBeRemoved } from "../utilities/testUtilities";

/**
 * Imitates the user changing the location using the auto-complete input, and waits for the page to
 * re-render with the new location.
 *
 * @param location Location name (not case-sensitive).
 */
async function changeLocation(location: string): Promise<void> {
  const locationInput = screen.getByLabelText(/location/i);

  await userEvent.type(locationInput, location);
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

describe("Viewing location data", () => {
  beforeEach(async () => {
    localStorage.clear();
    render(<App />);

    await waitForElementToBeRemoved(() => screen.getByRole("status"));
  });

  test("The default location (USA) is shown at the first visit", () => {
    expect(screen.getByText(/covid-19: the us/i)).toBeInTheDocument();
  });

  describe("Sections", () => {
    let latestValues: ValuesOnDate;

    beforeAll(async () => {
      const mockStore = new COVID19API();
      const usData = await mockStore.getDataByLocation("US");
      latestValues = usData.values[usData.values.length - 1];
    });

    test("The user can see the information on confirmed cases", () => {
      const confirmedCases = latestValues.confirmed;

      expect(
        screen.queryByTextWithMarkup(
          `${numToGroupedString(confirmedCases)} confirmed cases to date`
        )
      ).toBeInTheDocument();
    });

    test("The user can see the information on new cases", () => {
      const newCases = latestValues.newConfirmed;

      const regex = new RegExp(
        `there were[\\s\\S.]*${numToGroupedString(newCases)}[\\s\\S.]*new cases[\\s\\S.]*on`,
        "i"
      );

      expect(screen.queryByTextWithMarkup(regex)).toBeInTheDocument();
    });

    test("The user can see the information on deaths", () => {
      const deaths = latestValues.deaths as number;

      expect(
        screen.queryByTextWithMarkup(`${numToGroupedString(deaths)} deaths to date`)
      ).toBeInTheDocument();
    });

    test("The user can see the information on new deaths", () => {
      const newDeaths = latestValues.newDeaths as number;

      const regex = new RegExp(
        `there were[\\s\\S.]*${numToGroupedString(newDeaths)}[\\s\\S.]*new deaths[\\s\\S.]*on`,
        "i"
      );

      expect(screen.queryByTextWithMarkup(regex)).toBeInTheDocument();
    });

    test("The user can see the information on recoveries", () => {
      const recoveries = latestValues.recovered as number;

      expect(
        screen.queryByTextWithMarkup(`${numToGroupedString(recoveries)} recoveries to date on`)
      ).toBeInTheDocument();
    });

    test("The user can see the information on new recoveries", () => {
      const newRecoveries = latestValues.newRecovered as number;

      const regex = new RegExp(
        `there were[\\s\\S.]*${numToGroupedString(
          newRecoveries
        )}[\\s\\S.]*new recoveries[\\s\\S.]*on`,
        "i"
      );

      expect(screen.queryByTextWithMarkup(regex)).toBeInTheDocument();
    });

    test("The user can see the overall information", () => {
      const mortalityRate = latestValues.mortalityRate as number;
      const recoveryRate = latestValues.recoveryRate as number;

      expect(
        screen.queryByTextWithMarkup(`mortality rate was ${numToPercentFactory(2)(mortalityRate)}`)
      ).toBeInTheDocument();
      expect(
        screen.queryByTextWithMarkup(`recovery rate was ${numToPercentFactory(2)(recoveryRate)}`)
      ).toBeInTheDocument();
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

    render(<App />);

    expect(screen.queryByText(/covid-19: turkey/i)).toBeInTheDocument();
    expect(screen.queryByText(/covid-19: the us/i)).not.toBeInTheDocument();
  });

  test("The recoveries and overall sections are hidden when the selected location has no recoveries data", async () => {
    expect(screen.queryByRole("heading", { name: "Overall" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Recoveries" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "New Recoveries" })).toBeInTheDocument();

    await changeLocation("norecoveriesistan");

    expect(screen.queryByRole("heading", { name: "Overall" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Recoveries" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "New Recoveries" })).not.toBeInTheDocument();
  });
});

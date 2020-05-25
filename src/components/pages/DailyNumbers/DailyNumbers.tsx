import { COVID19API, ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent, useEffect, useState } from "react";
import { IMAGES } from "../../../constants";
import { useDateSelection } from "../../../hooks/useDateSelection";
import useLocationSelection from "../../../hooks/useLocationSelection";
import { prettifyDate } from "../../../utilities/dateUtilities";
import { downloadNode } from "../../../utilities/nodeToImageUtilities";
import DataPage from "../../common/DataPage";
import DailyNumbersTable from "./DailyNumbersTable";

interface DailyNumbersProps {
  store: COVID19API;
}

const DailyNumbers: FunctionComponent<DailyNumbersProps> = ({ store }) => {
  const defaultLocation = "US";

  const [locationsList] = useState(store.locations);
  const [data, setData] = useState<ValuesOnDate>();
  const [lastUpdated, setLastUpdated] = useState<Date>();
  const [firstDate] = useState(store.firstDate);
  const [lastDate] = useState(store.lastDate);

  const [[location], locationInputComponent] = useLocationSelection(
    locationsList,
    [defaultLocation],
    {
      lastSelectionAsDefault: true,
      lastSelectionStorageKey: "dailyNumbersLastLocation",
    }
  );
  const [date, dateInputComponent] = useDateSelection(firstDate, lastDate);
  const canonicalQueryParams = ["location", "date"];

  const tableId = "daily-numbers";
  const title = `COVID-19 Daily Numbers: ${location}`;
  const subtitle = date != null || lastDate != null ? prettifyDate(date ?? (lastDate as Date)) : "";
  const pageDescription = `See the daily COVID-19 numbers for ${location}.`;

  function clearData(): void {
    setData(undefined);
    setLastUpdated(undefined);
  }

  function handleDownloadClick(): void {
    const node = document.getElementById(tableId) as HTMLElement;
    downloadNode(node).catch(console.error);
  }

  function hasLoaded(): boolean {
    return (
      data != null && lastUpdated != null && firstDate != null && lastDate != null && date != null
    );
  }

  useEffect(() => {
    if (date == null) {
      return;
    }

    clearData();
    store.getDataByLocationAndDate(location, date).then((data) => {
      const lastUpdated = store.sourceLastUpdatedAt;

      setData(data);
      setLastUpdated(lastUpdated);
    });
  }, [store, location, date]);

  const bodyComponent = <DailyNumbersTable data={data} />;

  return (
    <DataPage
      title={title}
      subTitle={subtitle}
      pageDescription={pageDescription}
      ogImage={IMAGES.dailyNumbersOg}
      lastUpdated={lastUpdated as Date}
      hasLoaded={hasLoaded()}
      bodyComponent={bodyComponent}
      optionsComponents={[locationInputComponent, dateInputComponent]}
      dataContainerId={tableId}
      canonicalQueryParams={canonicalQueryParams}
      onDownloadClick={handleDownloadClick}
    />
  );
};

export default DailyNumbers;

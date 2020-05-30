import React, { FunctionComponent } from "react";

interface SingleLocationLineChartSectionProps {
  /**
   * The title of the section.
   */
  title: string;
  /**
   * The description of the section.
   */
  description: string;
  /**
   * The {@link SingleLineChart} in the section.
   */
  chart: JSX.Element;
}

/**
 * Container for a section that contains a {@link SingleLineChart} on the {@link SingleLocation}
 * page.
 */
const SingleLocationLineChartSection: FunctionComponent<SingleLocationLineChartSectionProps> = ({
  title,
  description,
  chart,
}) => {
  return (
    <section className="mb-5">
      <header className="mb-4">
        <h2>{title}</h2>
        <p>{description}</p>
      </header>
      {chart}
    </section>
  );
};

export default SingleLocationLineChartSection;

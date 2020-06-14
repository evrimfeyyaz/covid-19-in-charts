import React, { FunctionComponent } from "react";

interface SingleLocationSectionProps {
  /**
   * The title of the section, e.g. "Confirmed Cases".
   */
  title: string;
  /**
   * The description of the section or an element that contains the description of the section.
   */
  description: string | JSX.Element;
  /**
   * The chart to render within the section.
   */
  chart: JSX.Element;
}

/**
 * Container for a section on the {@link SingleLocation} page.
 */
export const SingleLocationSection: FunctionComponent<SingleLocationSectionProps> = ({
  title,
  description,
  chart,
}) => {
  const descriptionComponent = typeof description === "string" ? <p>{description}</p> : description;

  return (
    <section className="mb-5">
      <header className="mb-4">
        <h2>{title}</h2>
        {descriptionComponent}
      </header>
      {chart}
    </section>
  );
};

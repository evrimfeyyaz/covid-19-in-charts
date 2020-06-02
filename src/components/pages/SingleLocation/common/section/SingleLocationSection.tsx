import React, { FunctionComponent } from "react";

interface SingleLocationSectionProps {
  /**
   * The title of the section.
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
const SingleLocationSection: FunctionComponent<SingleLocationSectionProps> = ({
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

export default SingleLocationSection;

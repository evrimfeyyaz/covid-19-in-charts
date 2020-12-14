import { render, RenderOptions, RenderResult, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { FunctionComponent } from "react";
import { Route, Router } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";

const Providers: FunctionComponent = ({ children }) => {
  const history = createMemoryHistory();

  return (
    <Router history={history}>
      <QueryParamProvider ReactRouterRoute={Route}>{children}</QueryParamProvider>
    </Router>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "queries">
): RenderResult => render(ui, { wrapper: Providers, ...options });

const customScreen = {
  ...screen,
  // Based on https://stackoverflow.com/a/55516023.
  queryByTextWithMarkup: (text: string | RegExp): HTMLElement | null =>
    screen.queryByText((_, node) => {
      if (node == null) {
        return false;
      }

      const hasText = (node: Element): boolean => node.textContent?.match(text) != null;
      const nodeHasText = hasText(node);
      const childrenDontHaveText = Array.from(node.children).every((child) => !hasText(child));

      return nodeHasText && childrenDontHaveText;
    }),
};

export * from "@testing-library/react";
export { customRender as render, customScreen as screen };

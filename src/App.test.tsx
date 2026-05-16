import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders the masthead wordmark and the lede", () => {
    render(<App />);
    expect(screen.getAllByText("588").length).toBeGreaterThan(0);
    expect(screen.getByText(/retienen/i)).toBeInTheDocument();
  });
});

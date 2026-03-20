import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CountrySwitcher } from "@/src/components/LanguageSwitcher";
import { CountryProvider } from "@/src/context/LanguageContext";

describe("CountrySwitcher", () => {
  it("renders without crashing", () => {
    render(
      <CountryProvider>
        <CountrySwitcher />
      </CountryProvider>
    );
    expect(screen.getByLabelText("Select country")).toBeInTheDocument();
  });
});

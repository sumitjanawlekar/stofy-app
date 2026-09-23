import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Catalog } from "@/src/components/Catalog";
import { STORIES } from "@/src/data/mockStory";

describe("Catalog Branding & Metadata", () => {
  it("renders title logo images when title_logo_url is present", () => {
    render(<Catalog onSelectStory={vi.fn()} />);
    const logoImages = screen.getAllByRole("img", { name: STORIES[0].title });
    expect(logoImages.length).toBeGreaterThan(0);
  });

  it("renders fallback text heading when title_logo_url is absent", () => {
    const storiesWithoutLogo = [
      {
        ...STORIES[0],
        id: "fallback-story",
        slug: "fallback-story",
        title: "Fallback Test Story",
        title_logo_url: undefined,
      },
    ];

    render(
      <Catalog onSelectStory={vi.fn()} stories={storiesWithoutLogo} />,
    );
    expect(
      screen.getByRole("heading", { name: "Fallback Test Story" }),
    ).toBeDefined();
  });
});

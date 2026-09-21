import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ChoiceOverlay } from "@/src/components/ChoiceOverlay";
import type { Choice } from "@/src/types/choice";

const mockChoices: Choice[] = [
  {
    id: "c1",
    parent_scene_id: "s1",
    label: "Confront the Dragon King",
    target_scene_id: "scene_02_a",
  },
  {
    id: "c2",
    parent_scene_id: "s1",
    label: "Flee into the Catacombs",
    target_scene_id: "scene_02_b",
  },
];

describe("ChoiceOverlay", () => {
  it("renders a button for each choice label", () => {
    render(
      <ChoiceOverlay choices={mockChoices} onSelectChoice={vi.fn()} />,
    );

    expect(
      screen.getByRole("button", { name: /Confront the Dragon King/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Flee into the Catacombs/i }),
    ).toBeInTheDocument();
  });

  it("calls onSelectChoice with the selected choice target_scene_id", () => {
    const onSelectChoice = vi.fn();

    render(
      <ChoiceOverlay choices={mockChoices} onSelectChoice={onSelectChoice} />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Confront the Dragon King/i }),
    );

    expect(onSelectChoice).toHaveBeenCalledTimes(1);
    expect(onSelectChoice).toHaveBeenCalledWith("scene_02_a");
  });

  it("calls onSelectChoice with the second choice target_scene_id", () => {
    const onSelectChoice = vi.fn();

    render(
      <ChoiceOverlay choices={mockChoices} onSelectChoice={onSelectChoice} />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Flee into the Catacombs/i }),
    );

    expect(onSelectChoice).toHaveBeenCalledWith("scene_02_b");
  });

  it("renders terminal CTA and calls onBackToCatalog when choices are empty", () => {
    const onBackToCatalog = vi.fn();

    render(
      <ChoiceOverlay
        choices={[]}
        onSelectChoice={vi.fn()}
        onBackToCatalog={onBackToCatalog}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /To Be Continued/i }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /Explore Other Stories/i }),
    );

    expect(onBackToCatalog).toHaveBeenCalledTimes(1);
  });
});

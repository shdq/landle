import { expect, test } from "vitest";
import { getNextUniqueRandomNumber } from "./functions";

test("getNextNumber() should always return a different number in between 1-99 in multiple attempts", () => {
  // Arrange & Act
  let prevNumber = 1;
  for (let i = 0; i < 100; i++) {
    const newNumber = getNextUniqueRandomNumber(prevNumber);

    // Assert
    expect(newNumber).toBeGreaterThanOrEqual(1);
    expect(newNumber).toBeLessThanOrEqual(99);
    expect(newNumber).not.toBe(prevNumber);

    prevNumber = newNumber;
  }
});

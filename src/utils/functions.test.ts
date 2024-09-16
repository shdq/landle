import { expect, test } from "vitest";
import { getNextUniqueRandomNumber, generateOptions } from "./functions";

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

test("generateOptions() should return an array of 4 numbers", () => {
  // Arrange
  const originalNumber = 50;

  // Act
  const options = generateOptions(originalNumber);

  // Assert
  expect(options).toHaveLength(4); // Array should have 4 elements
});

test("generateOptions() should always contain the original number", () => {
  // Arrange
  const originalNumber = 25;

  // Act
  const options = generateOptions(originalNumber);

  // Assert
  expect(options).toContain(originalNumber); // Original number should always be in the options array
});

test("generateOptions() should return numbers between 1 and 99", () => {
  // Arrange
  const originalNumber = 10;

  // Act
  const options = generateOptions(originalNumber);

  // Assert
  options.forEach((num) => {
    expect(num).toBeGreaterThanOrEqual(1); // All numbers should be >= 1
    expect(num).toBeLessThanOrEqual(99);   // All numbers should be <= 99
  });
});

test("generateOptions() should not have duplicate numbers", () => {
  // Arrange
  const originalNumber = 75;

  // Act
  const options = generateOptions(originalNumber);

  // Assert
  const uniqueOptions = new Set(options);
  expect(uniqueOptions.size).toBe(4); // There should be no duplicates
});
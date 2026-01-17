import { isValidUrl } from "../../utils/isValidUrl";

describe("isValidUrl", () => {
  test("accept valid url", () => {
    expect(isValidUrl("https://jestjs.io/")).toBe(true);
  });

  test("reject invalid url", () => {
    expect(isValidUrl("helloworld")).toBe(false);
  });

  test("reject js", () => {
    expect(isValidUrl("<script>alert('Incoming Attack')</script>")).toBe(false);
  });

  test("reject empty input field", () => {
    expect(isValidUrl("")).toBe(false);
  });
});

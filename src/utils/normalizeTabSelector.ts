/**
 * Normalize the tab selector value for consistent usage
 * Accepts a CSS selector or attribute name (with or without square brackets).
 *
 * - If input is `undefined`, defaults to `[data-overflow-key]`
 * - If input is in the form `[attr]`, the brackets are stripped (returns `attr`)
 * - Otherwise returns the input as-is
 *
 * @param selector Optional CSS selector or attribute name
 * @returns Normalized selector string (e.g., "data-overflow-key")
 */
const normalizeTabSelector = (selector?: string) => {
    const normalizedSelector = selector ?? "[data-overflow-key]";

    // if it is in the form [attr], remove the square brackets.
    if (normalizedSelector.startsWith("[") && normalizedSelector.endsWith("]")) {
        return normalizedSelector.slice(1, -1);
    }

    return normalizedSelector;
};

export default normalizeTabSelector;

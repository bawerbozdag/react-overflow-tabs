// a plain attribute name, e.g. "data-overflow-key"
const ATTRIBUTE_NAME_PATTERN = /^-?[A-Za-z_][\w-]*$/;

/**
 * Normalize the tab selector to a plain attribute name.
 * Accepts an attribute name with or without square brackets.
 *
 * - If input is `undefined`, defaults to `data-overflow-key`
 * - If input is in the form `[attr]`, the brackets are stripped (returns `attr`)
 * - Throws if the result is not a plain attribute name (e.g. `.tab` or `[data-x="1"]`)
 *
 * @param selector Optional attribute name, e.g. "data-tab" or "[data-tab]"
 * @returns Attribute name (e.g., "data-overflow-key")
 */
const normalizeTabSelector = (selector = "data-overflow-key") => {
    let attribute = selector.trim();

    // if it is in the form [attr], remove the square brackets.
    if (attribute.startsWith("[") && attribute.endsWith("]")) {
        attribute = attribute.slice(1, -1).trim();
    }

    if (!ATTRIBUTE_NAME_PATTERN.test(attribute)) {
        throw new Error(
            `react-overflow-tabs: invalid tabSelector "${selector}". ` +
                `Expected an attribute name such as "data-overflow-key" or "[data-overflow-key]".`,
        );
    }

    return attribute;
};

export default normalizeTabSelector;

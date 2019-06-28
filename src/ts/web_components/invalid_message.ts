/**
 * User-supplied function which validates the item to be added
 * @param name Item to be added
 * @returns `null` if `name` is valid; `string` containing why it isn't otherwise
 */
export type getInvalidMessage = (name) => string | null;
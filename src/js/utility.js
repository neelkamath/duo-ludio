export function escapeHTML(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function titleCase(string) {
    return string[0].toUpperCase() + string.slice(1);
}

export function getAttribute(context, attribute, defaultAttribute = '') {
    return context.hasAttribute(attribute) ? escapeHTML(context.getAttribute(attribute)) : defaultAttribute;
}
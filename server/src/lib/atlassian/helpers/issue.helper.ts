import { QueryIssues } from '../types/issues.type';

export function generateQueryIssueString(query?: QueryIssues) {
    if (!query) return '';

    const entries = Object.keys(query);

    const parameters = [];
    entries.forEach(element => {
        if (element === 'jql' && query[element]) {
            parameters.push(`${element}=${encodeURIComponent(query[element])}`);
        } else if (query[element]) {
            parameters.push(`${element}=${query[element]}`);
        }
    });

    if (parameters.length > 0) {
        return '?' + parameters.join('&');
    }

    return '';
}

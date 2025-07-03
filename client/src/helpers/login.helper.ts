export class LoginHelper {
  static getLoginUrl() {
    const baseUrl =
      process.env.NEXT_PUBLIC_LOCAL_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://devmetrics.com.br/'
        : 'http://localhost:3000/');

    const loginUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${
      process.env.NEXT_PUBLIC_JIRA_CLIENT_ID
    }&scope=${process.env.NEXT_PUBLIC_JIRA_SCOPES_REQUESTED}&redirect_uri=${this.escapeUrl(baseUrl)}api%2Fauth%2Fcallback&state=${crypto.randomUUID()}&response_type=code&prompt=consent`;

    return loginUrl;
  }

  static escapeUrl(url?: string) {
    if (!url) return '';
    return encodeURIComponent(url)
      .replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`)
      .replace(/%20/g, '+');
  }
}

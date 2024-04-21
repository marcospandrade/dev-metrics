export class LoginHelper {
  static getLoginUrl() {
    const loginUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${
      process.env.NEXT_PUBLIC_JIRA_CLIENT_ID
    }&scope=${
      process.env.NEXT_PUBLIC_JIRA_SCOPES_REQUESTED
    }&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback&state=${crypto.randomUUID()}&response_type=code&prompt=consent`

    return loginUrl
  }
}

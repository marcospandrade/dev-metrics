import { escape } from 'querystring'
export class LoginHelper {
  static getLoginUrl() {
    const loginUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${
      process.env.NEXT_PUBLIC_JIRA_CLIENT_ID
    }&scope=${
      process.env.NEXT_PUBLIC_JIRA_SCOPES_REQUESTED
    }&redirect_uri=${escape(process.env.NEXT_PUBLIC_LOCAL_URL!)}api%2Fauth%2Fcallback&state=${crypto.randomUUID()}&response_type=code&prompt=consent`;

    return loginUrl;
  }
}

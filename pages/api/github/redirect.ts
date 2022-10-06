import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import { State } from 'utils/crypto';
import { resolve } from 'utils/promise';
import fire from 'firebase/node';
import { CLIENT_ID_GITHUB, CLIENT_SECRET_GITHUB } from 'keystore';


const getAuth = () => fire.auth();

const html = (body: string) => `<!DOCTYPE html><html lang="en"><body>${body}</body></html>`
const sendHtml = (res: NextApiResponse<string>, body: string, status: number = 200) => res.status(status).setHeader('content-type', 'text/html; charset=utf-8').send(html(body));
const script = (token: string) => `<script>
  localStorage.setItem('custom-auth-jwt', '${token}')
  var redirectPath = localStorage.getItem('redirect-path') || '/';
  window.location.replace(redirectPath);
</script>`

type Data = string

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { code, state } = req.query;
  if (!code) {
    return sendHtml(res, `<h2>Error</h2><p>${JSON.stringify(req.query, null, '\t')}</p>`, 500);
  }
  const { result: accessToken, error: accessTokenError} = await resolve(axios.post(`https://github.com/login/oauth/access_token`, null, {
    params: {
      client_id: CLIENT_ID_GITHUB,
      client_secret: CLIENT_SECRET_GITHUB,
      code: code,
    },
    headers: {
      accept: 'application/json'
    }
  }), 1000 * 60 * 5);
  // token 获取错误
  if (accessTokenError) {
    return sendHtml(res, `<h2>Error: token 获取错误</h2><pre>${JSON.stringify(accessTokenError, null, '\t')}</pre>`, 500)
  }
  // state 参数校验失败
  if (!State.check(state as string)) {
    return sendHtml(res, `<h2>Error: state 参数校验失败</h2><p>非法请求</p>`, 500);
  }
  const token = accessToken?.data as Github.AccessTokenData;
  // 获取用户信息
  const {result: userResult, error: userError } = await resolve(axios.get(`https://api.github.com/user`, {
    headers: {
      Authorization: `${token.token_type} ${token.access_token}`
    }
  }));
  // 获取用户信息错误
  if (userError) {
    return sendHtml(res,`<h2>Error:</h2><pre>${JSON.stringify(userError, null, '\t')}</pre>`, 500);
  }
  const user = userResult?.data as Github.UserInfo;
  if (user.email) {
    let { result: userRecord, error: userRecordError } = await resolve(getAuth().getUserByEmail(user.email), 1000 * 60);
    if (userRecordError) {
      userRecord = await getAuth().createUser({
        email: user.email,
        emailVerified: true,
        displayName: user.name,
        photoURL: user.avatar_url,
      });
    }
    if (userRecord) {
      let { result: customToken } = await resolve(getAuth().createCustomToken(userRecord.uid));
      if (customToken) {
        return sendHtml(res, script(customToken));
      }
    }
  }
  return sendHtml(res, `<h2>Error:</h2><p>需要提供邮箱📮</p>`, 500)
}
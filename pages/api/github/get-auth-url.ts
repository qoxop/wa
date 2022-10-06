// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { State } from 'utils/crypto';
import { CLIENT_ID_GITHUB } from "keystore";
import type { NextApiRequest, NextApiResponse } from 'next'



type Data = {
  url: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const state = State.generate();
  let url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID_GITHUB}&state=${state}`;
  url += `&scope=${encodeURIComponent(['read:user'].join(','))}`;
  res.redirect(url);
}
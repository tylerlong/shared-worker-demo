import RingCentral from '@rc-ex/core';

import WSSharedWorker from './ws-shared-worker';

const rc = new RingCentral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});
rc.authorize({
  jwt: process.env.RINGCENTRAL_JWT_TOKEN,
});

const wsSharedWorker = new WSSharedWorker(rc);
(self as any).onconnect = (event: any) => {
  wsSharedWorker.init(event);
};

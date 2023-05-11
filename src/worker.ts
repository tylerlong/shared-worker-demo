import RingCentral from '@rc-ex/core';
import WSExtension from '@rc-ex/ws';

const rc = new RingCentral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});

const ports = new Set<any>();
const init = async () => {
  await rc.authorize({
    jwt: process.env.RINGCENTRAL_JWT_TOKEN,
  });
  const wsExt = new WSExtension();
  await rc.installExtension(wsExt);
  await wsExt.subscribe(['/restapi/v1.0/account/~/extension/~/message-store?type=Pager'], (event) => {
    for (const port of Array.from(ports)) {
      port.postMessage(event);
    }
  });
};
init();

self.onconnect = function (event) {
  const port = event.ports[0];
  port.onmessage = function (e) {
    if (e.data.type === 'subscribe') {
      ports.add(port);
      port.postMessage({ type: 'subscribed' });
    } else if (e.data.type === 'unsubscribe') {
      ports.delete(port);
      port.postMessage({ type: 'unsubscribed' });
    } else if (e.data.type === 'trigger') {
      rc.restapi()
        .account()
        .extension()
        .companyPager()
        .post({
          from: { extensionId: rc.token.owner_id },
          to: [{ extensionId: rc.token.owner_id }],
          text: 'Hello world',
        });
      port.postMessage({ type: 'triggered' });
    }
  };
};

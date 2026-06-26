export function getWebPushPublicKey(): string {
  return process.env.WEB_PUSH_PUBLIC_KEY
    || process.env.VAPID_PUBLIC_KEY
    || '';
}

export function getWebPushPrivateKey(): string {
  return process.env.WEB_PUSH_PRIVATE_KEY
    || process.env.VAPID_PRIVATE_KEY
    || '';
}

export function getWebPushSubject(): string {
  return process.env.WEB_PUSH_SUBJECT
    || process.env.VAPID_SUBJECT
    || 'mailto:notifications@gymmer.app';
}

export function getWebPushConfig() {
  const publicKey = getWebPushPublicKey();
  const privateKey = getWebPushPrivateKey();
  const subject = getWebPushSubject();

  return {
    publicKey,
    privateKey,
    subject,
    configured: publicKey.length > 0 && privateKey.length > 0,
  };
}

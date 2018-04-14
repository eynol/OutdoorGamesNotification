import Fingerprintjs2 from 'fingerprintjs2';

export default function getFingerprint(){
  return new Promise((res, rej) => {
    try {
      new Fingerprintjs2({ excludeUserAgent: true }).get(uuid => {
        if (uuid) { res(uuid) };
      })
    } catch (e) {
      rej(e);
    }
  })
};

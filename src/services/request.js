import request from '../utils/request';
import mapToFormData from '../utils/formData';

import * as ws from './websocket';


export default function proxyRequest(url, options = {}) {
  if (ws.isActive()) {
    return ws.request(url, options);
  } else {
    if (options.body) {
      return request(url, { ...options, body: mapToFormData(options.body) });
    } else {
      return request(url, options);
    }
  }
}


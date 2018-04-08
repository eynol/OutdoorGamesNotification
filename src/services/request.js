import request from '../utils/request';
import mapToFormData from '../utils/formData';

import * as ws from './websocket';


export default function proxyRequest(url,options){
    if(ws.isActive()){
      return Promise.reject(new Error('TODO'))
    }else{
      return request(url,{...options,body:mapToFormData(options.body)});
    }
}


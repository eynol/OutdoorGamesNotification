let connection=null;


export function isActive(){
  return connection !== null;
}


export function listen() {

  return unlisten;
}
export function unlisten() {
  connection = null;
}

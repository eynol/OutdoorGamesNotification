export function set(id, data) {
  localStorage.setItem(id, JSON.stringify(data));
}
export function get(id) {
  let item = localStorage.getItem(id)
  if (item) { return JSON.parse(item) }
  else { return item }
}

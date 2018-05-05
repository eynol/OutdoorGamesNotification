

window.addEventListener('focus', () => {

})
window.addEventListener('blur', () => {

})

export default function vibrate(n) {
  console.log('~~~~~~~~~~~~~~~~~~')
  if (!n) { n = 1 }
  if (n == 5000) return;
  return setTimeout(() => {
    try {

      const result = navigator.vibrate([800, 500, 800])
      if (!result) {
        return vibrate(n + 1);
      }
    } catch (e) {
      console.log('user block vibrate')
    }
  }, 50);
}

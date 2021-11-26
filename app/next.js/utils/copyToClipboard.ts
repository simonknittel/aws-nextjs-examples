export default function copyToClipboard(value: string) {
  const el = document.createElement('textarea')
  el.value = value
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '100%';
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

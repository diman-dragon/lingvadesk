export default function timestamp() {
  return new Date().toISOString().slice(0, 16).replace(/[-:]/g, '').replace('T', '-');
}

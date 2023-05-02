export function cleanOutputPath(output) {
  return output ? output.replace(/[&\/\\#+$!"~.%:*?<>{}\|]/g, '') : '';
}

export function rightNow() {
    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/:/g, '-').replace(/ /g, '-').replace(/-/g, '');
}

export function addZero(number) {
    return number.toString().padStart(2, '0');
}

export function removeQuery(url) {
  return url.split('?')[0];
}

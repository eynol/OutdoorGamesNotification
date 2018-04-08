function toDateSafe(num) {
  let date;
  if (typeof num === 'number') {
    date = new Date(num);
  } else if (typeof num === 'object') {
    if (num instanceof Date) {
      date = num;
    };
  }

  if (!date) {
    throw new Error('expect number/Date type')
  }
  if (Number.isNaN(date.getDate())) {
    throw new TypeError('unexpected timestamp:' + num)
  }
  return date;
}

function _0(n) { return n < 10 ? '0' + n : n }

export function getTimeStr(num, stringType = 'yyyy年MM月dd日 HH:mm') {
  try {
    const date = toDateSafe(num);

    let ret = stringType.replace('yyyy', date.getFullYear());
    ret = ret.replace('MM', date.getMonth());
    ret = ret.replace('dd', date.getDate());
    ret = ret.replace('HH', _0(date.getHours()));
    ret = ret.replace('mm', _0(date.getMinutes()));

    return ret
  } catch (e) {
    console.error(e);
    return 'Timestring parse failed'
  }
};

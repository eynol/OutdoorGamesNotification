function toDateSafe(num) {
  let date;
  const argType = typeof num;
  if (argType === 'number' || argType === 'string') {
    date = new Date(num);
  } else if (argType === 'object') {
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

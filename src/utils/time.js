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
    ret = ret.replace('MM', _0(date.getMonth()));
    ret = ret.replace('dd', _0(date.getDate()));
    ret = ret.replace('HH', _0(date.getHours()));
    ret = ret.replace('mm', _0(date.getMinutes()));
    ret = ret.replace('ss', _0(date.getSeconds()));

    return ret
  } catch (e) {
    console.error(e);
    return 'Timestring parse failed'
  }
};

export function getTimeGap(begin, end) {
  try {
    const $begin = toDateSafe(begin);
    const $end = toDateSafe(end);

    const $gap = $end.getTime() - $begin.getTime();

    let seconds = Math.round($gap / 1000);

    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;

    let days = Math.floor(hours / 24);
    hours = hours % 24;


    if (days) {
      return days + '天' + hours + '小时';
    } else if (hours) {
      return hours + '小时' + minutes + '分钟';
    } else if (minutes) {
      return minutes + '分钟' + seconds + '秒';
    } else if (seconds) {
      return seconds + '秒';
    }

  } catch (e) {
    console.error(e);
    return 'Timestring parse failed'
  }
}

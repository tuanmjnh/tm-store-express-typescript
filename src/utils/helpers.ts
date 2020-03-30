import * as moment from 'moment';

export const getBody = (obj: any, req: any) => {
  // req: Request
  const rs = {};
  Object.keys(obj).forEach((e: any) => {
    if (req.body && req.body[e] !== undefined) rs[e] = req.body[e];
  });
  return rs;
};

export const toTimestamp = (strDate: string) => {
  const datum = Date.parse(strDate);
  return datum / 1000;
};

export const ToUpperCase = (obj: any) => {
  const rs = {};
  Object.keys(obj).forEach(e => {
    rs[e.toUpperCase()] = obj[e];
  });
  return rs;
};

export const ToLowerCase = (obj: any) => {
  const rs = {};
  Object.keys(obj).forEach(e => {
    rs[e.toLowerCase()] = obj[e];
  });
  return rs;
};

export const RandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const ToDate = (timestamp: number, format: string = null) => {
  if (format) {
    return moment(timestamp).format(format);
  } else {
    return moment(timestamp).toDate();
  }
};

export const pushIfNotExist = (data: any[], element: any, key: string) => {
  if (Array.isArray(element)) {
    element.forEach(e => {
      if (key) {
        if (data.findIndex((x: any) => x[key] === e[key]) < 0) data.push(e);
      } else {
        if (data.indexOf(e) < 0) data.push(e);
      }
    });
  } else {
    if (key) {
      if (data.findIndex((x: any) => x[key] === element[key]) < 0) data.push(element);
    } else {
      if (data.indexOf(element) < 0) data.push(element);
    }
  }
  return data;
};

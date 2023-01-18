const androidRegexp = /Android/i;
const iOSRegexp = /Iphone|Ipad|iPod/i;
const WindowsRegexp = /Windows/i;
const MacintoshRegexp = /Macintosh/i;

export enum DesktopEnum {
  Windows = 'Windows',
  Mac = 'Mac OS',
  Unknown = 'Unknown',
}

export enum DevicesEnum {
  Android = 'Android',
  iOS = 'iOS',
  Other = 'Other',
}

export const getDesktopPlatform = (userAgent: string): DesktopEnum => {
  return WindowsRegexp.test(userAgent) ? DesktopEnum.Windows : MacintoshRegexp.test(userAgent) ? DesktopEnum.Mac : DesktopEnum.Unknown;
};

export const getDeviceFromUserAgent = (userAgent: string): DevicesEnum => {
  return androidRegexp.test(userAgent) ? DevicesEnum.Android : iOSRegexp.test(userAgent) ? DevicesEnum.iOS : DevicesEnum.Other;
};

export const userAgentBrowserDetect = (userAgent: string) => {
  if (userAgent.match(/chrome|chromium|crios/i)) {
    return 'Chrome';
  } else if (userAgent.match(/firefox|fxios/i)) {
    return 'Firefox';
  } else if (userAgent.match(/safari/i)) {
    return 'Safari';
  } else if (userAgent.match(/opr\//i)) {
    return 'Opera';
  } else if (userAgent.match(/edg/i)) {
    return 'Edge';
  } else {
    return 'Unknown browser';
  }
};

const userAgentOSDetect = (userAgent: string) => {
  if (userAgent.indexOf('Win') !== -1) return 'Windows';
  if (userAgent.indexOf('Mac') !== -1) return 'MacOS';
  if (userAgent.indexOf('X11') !== -1) return 'UNIX';
  if (userAgent.indexOf('Linux') !== -1) return 'Linux';
  return 'Unknown OS';
};

// use localStorage to store the authority info, which might be sent from server in actual project.
import { getLocalstorage } from '@/utils/utils';

export function getAuthority(str?: string): string | string[] {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? JSON.stringify(getLocalstorage('current_user')) : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  if (authority && typeof authority === 'object') {
    if (authority.status === '1') {
      return ['admin'];
    }
    return [authority.loginName];
  }
  if (!authority) {
    return ['NULL'];
  }
  return authority;
}

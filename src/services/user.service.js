import { getLocalstorage } from '../utils/utils';

export default {}

export async function queryUser() {
  return new Promise((resolve) => {
    const data = getLocalstorage('current_user');
    if (data && Object.keys(data).length) {
      resolve({
        success: true,
        data,
      });
    } else {
      resolve({
        success: false,
      });
    }
  });
}


export default {}

export async function login({ username, password }) {

}

export async function logout() {
  localStorage.removeItem('current_user');
  return Promise.resolve(() => ({ success: true }));
}

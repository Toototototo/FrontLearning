export default [
  {
    path: '/',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      {
        path: '/login',
        component: './login'
      },
      {
        path: '/',
        redirect: '/welcome',
        hideInMenu: true,
      },
      {
        path: '/welcome',
        component: './Welcome'
      },
    ],
  },
];

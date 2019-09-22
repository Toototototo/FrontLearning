import React from 'react';
import { Button, Checkbox, Form, Icon, Input } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import qs from 'querystring';
import { isNotEmpty } from '@/utils/utils';
import Preloader from '@/components/PreLoader';
import { logout } from '@/services/login.service';
import { queryUser } from '@/services/user.service';
import { reloadAuthorized } from '@/utils/Authorized';
import styles from './index.less';

const FormItem = Form.Item;

const parseRedirect = path => {
  const [pathname, search] = path.split('?');
  return [pathname, qs.parse(search)];
};

@connect(({ login, loading, dispatch }) => ({
  login,
  loading,
  dispatch,
}))
@Form.create()
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginName: null,
      remember: true,
      isLoading: true,
      isLoadedGlobalSet: false,
    };
  }

  componentDidMount() {
    // session验证
    queryUser().then(res => {
      if (res.success && res.data) {
        reloadAuthorized();
        const {
          location: { query },
        } = this.props;
        const { redirect = '' } = query;
        const [pathname, search] = parseRedirect(redirect);
        // 避免死循环
        setTimeout(() => {
          router.replace({
            pathname: pathname === '/login' ? '/' : pathname || '/',
            query: search,
          });
        }, 0);
      } else {
        this.setState({ isLoading: false, isLoadedGlobalSet: true });
        logout();
      }
    });
  }

  // 点击登录
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.setState(
          {
            loginName: values.loginName,
            remember: values.remember,
          },
          () => {
            const { remember } = this.state;
            dispatch({
              type: 'login/login',
              payload: {
                loginName: values.loginName,
                password: values.password,
                tenantId: values.tenantId !== '-1' ? values.tenantId : '',
                remember,
              },
            });// 控制登录接口是否要获取系统设置信息【不传或为空，表示登录不获取设置信息】
          },
        );
      }
    });
  };

  handleForgot = () => {
    router.push('/forgot/index');
  };

  handleRegister = () => {
    router.push('/register/index');
  };

  bindLoginDom = ref => {
    this.loginDom = ref;
  };

  render() {
    const { form } = this.props;
    const {
      isLoading,
      loginName,
      isLoadedGlobalSet,
    } = this.state;
    const formItemStyle = {};

    const { getFieldDecorator } = form;
    if (isLoadedGlobalSet) {
      return (
        <div ref={this.bindLoginDom} className={styles.login}>
          <div className={styles['login-form-center']}>
            <div
              className={styles['login-logo']}
            >
              <span>登录</span>
            </div>
            <Form onSubmit={this.handleSubmit} style={{ maxWidth: '300px' }}>
              <FormItem style={formItemStyle}>
                {getFieldDecorator('loginName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入用户名/邮箱/编号/手机！',
                    },
                  ],
                  initialValue: loginName,
                })(
                  <Input
                    prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                    placeholder="用户名 / 邮箱 / 编号 / 手机"
                  />,
                )}
              </FormItem>
              <FormItem style={formItemStyle}>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '请输入密码！',
                    },
                  ],
                })(
                  <Input.Password
                    prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                    placeholder="密码"
                  />,
                )}
              </FormItem>
              <FormItem style={formItemStyle}>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(<Checkbox>记住我</Checkbox>)}
                <a
                  className={styles['login-form-forgot']}
                  onClick={this.handleRegister}
                  style={{ float: 'right' }}
                >
                  注册
                </a>
                <span
                  style={{
                    float: 'right',
                    marginRight: '4px',
                  }}
                >
                  或
                </span>
                <a
                  className={styles['login-form-forgot']}
                  onClick={this.handleForgot}
                  style={{
                    float: 'right',
                    marginRight: '4px',
                  }}
                >
                  忘记密码?
                </a>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles['login-form-button']}
                  style={{ width: '100%' }}
                  loading={isLoading}
                >
                  登录
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>
      );
    }
    return <Preloader />;
  }
}

export default Login;

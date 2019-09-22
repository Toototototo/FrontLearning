import React from 'react';
import { Icon } from "antd";

export default (): React.ReactNode => (
  <div className="center" style={{ textAlign: 'center', padding: '200px', width: '100%', height: '100%', color: '#bebebe', overflow: 'hidden' }}>
    <h1><Icon style={{ fontSize: 75 }} type="smile" /> 欢迎使用, 请在【系统设置】自定义LOGO|背景|主题|首页.</h1>
  </div>
);

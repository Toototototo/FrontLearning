import React from 'react';
import { isDeveloper } from '@/utils/userUtils';
import appConfig, { getSystemSetUserCache, removeSystemSetUserCache } from '@/utils/app.config';
import { isNotEmpty } from '@/utils/utils';
import styles from './index.less';

export interface ILogoCustom {
  setting?: typeof appConfig,
  collapsed: boolean
}

const LogoCustom = (props: ILogoCustom) => {
  if (isDeveloper()) removeSystemSetUserCache();
  // @ts-ignore
  const userCacheLogo = getSystemSetUserCache().sysLogo;
  // @ts-ignore
  const userCacheName = getSystemSetUserCache().sysName;
  const sysLogo = isNotEmpty(userCacheLogo) ? userCacheLogo : appConfig.sysLogo;
  const sysName = isNotEmpty(userCacheName) ? userCacheName : appConfig.sysName;
  const {collapsed, setting = {}} = props;
  return (
    <div className={styles.logo} style={collapsed ? {padding: '7px 2px'} : {justifyContent: 'center'}}>
      <img
        src={setting.sysLogo || sysLogo}
        alt={setting.sysName || sysName}
        title={setting.sysName || sysName}
      />
      {!collapsed && <label className={styles.txt}>{setting.sysName || sysName}</label>}
    </div>
  );
};

export default LogoCustom;

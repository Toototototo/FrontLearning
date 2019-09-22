import React from 'react';
import styles from './preloader.less';

function Preloader() {
  return (
    <div className={styles.preloaderContainer}>
      <div className={styles['cs-loader-Wapper']}>
        <div className={styles['cs-loader-innerWapper']}>
          <span> ●</span>
          <span> ●</span>
          <span> ●</span>
          <span> ●</span>
          <span> ●</span>
          <span> ●</span>
        </div>
      </div>
    </div>
  );
}

export default Preloader;

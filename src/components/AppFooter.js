import React from 'react';
import { CFooter } from '@coreui/react';

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <a target="_blank" rel="noopener noreferrer">
          SGU Connect
        </a>
        <span className="ms-1">&copy; 2023 creativeLabs.</span>
      </div>
    </CFooter>
  );
};

export default React.memo(AppFooter);

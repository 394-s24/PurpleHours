import { useEffect, useContext } from 'react';

import UserContext from '../components/UserContext.jsx';

import { initializeUserIfNeeded } from '../../server/database/UserFuncs';

const useInitializeUser = (course) => {
  const user = useContext(UserContext);

  useEffect(() => {
    if (user) {
        initializeUserIfNeeded(user, course);
    }
  }, [user, course]);

  return user;
};

export default useInitializeUser;

import { useEffect, useContext } from 'react';

import UserContext from '../components/UserContext.jsx';

import { initializeUserIfNeeded } from '../../server/database/UserFuncs';

const useInitializeUser = (course, isValid, setLoggedIn) => {
  const user = useContext(UserContext);

  useEffect(() => {
    if (user && isValid) {
        initializeUserIfNeeded(user, course);
        setLoggedIn(true)
    }
  }, [user, course, isValid]);

  return user;
};

export default useInitializeUser;

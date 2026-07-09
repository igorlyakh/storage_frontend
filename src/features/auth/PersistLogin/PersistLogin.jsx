import { Center, Loader } from '@mantine/core';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { syncLanguageFromAccount } from '../../language/useSyncLanguage';
import { useGetMeQuery } from '../../../store/api/api';
import { isLoginSelector, tokenSelector } from '../../../store/selectors/selectors';
import { setData } from '../../../store/userSlice/userSlice';

const PersistLogin = () => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const token = useSelector(tokenSelector);
  const isLogin = useSelector(isLoginSelector);

  const { data, isLoading } = useGetMeQuery(undefined, {
    skip: !!token || !isLogin,
  });

  useEffect(() => {
    if (data && token) {
      dispatch(
        setData({
          username: data.username,
          role: data.role,
          adminScopes: data.adminScopes,
          accessToken: token,
        }),
      );
      syncLanguageFromAccount(i18n, data.language);
    }
  }, [data, token, dispatch, i18n]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size={50} />
      </Center>
    );
  }

  return <Outlet />;
};

export default PersistLogin;

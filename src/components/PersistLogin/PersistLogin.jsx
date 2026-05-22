import { Center, Loader } from '@mantine/core';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { useGetMeQuery } from '../../store/api/api';
import { isLoginSelector, tokenSelector } from '../../store/selectors/selectors';
import { setData } from '../../store/userSlice/userSlice';

const PersistLogin = () => {
  const dispatch = useDispatch();
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
    }
  }, [data, token, dispatch]);

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

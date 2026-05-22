import { Center, Loader } from '@mantine/core';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { useGetMeQuery } from '../../store/api/api';
import { setData } from '../../store/userSlice/userSlice';

const PersistLogin = () => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.user.accessToken);

  const { data, isLoading } = useGetMeQuery(undefined, {
    skip: !!token,
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

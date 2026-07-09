import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { useGetAllOrdersQuery, useGetMyOrdersQuery } from '../../store/api/api';
import { tokenSelector, userRoleSelector } from '../../store/selectors/selectors';
import { startTitleBlink, stopTitleBlink } from '../../utils/titleBlink';

const POLL_INTERVAL = 25000;
const ALL_STATUSES = 'NEW,IN_PROGRESS,SENT,COMPLETED,BACKORDER';

export const useOrderNotifications = () => {
  const { t } = useTranslation('warehouse');
  const token = useSelector(tokenSelector);
  const role = useSelector(userRoleSelector);
  const location = useLocation();

  const isWarehouse = role === 'WAREHOUSE';
  const isStore = role === 'STORE';

  const { data: newOrders } = useGetAllOrdersQuery(
    { statuses: 'NEW' },
    {
      skip: !token || !isWarehouse,
      pollingInterval: POLL_INTERVAL,
      skipPollingIfUnfocused: false,
    },
  );

  const { data: myOrders } = useGetMyOrdersQuery(
    { statuses: ALL_STATUSES },
    {
      skip: !token || !isStore,
      pollingInterval: POLL_INTERVAL,
      skipPollingIfUnfocused: false,
    },
  );

  const knownNewOrderIds = useRef(null);
  const knownStatuses = useRef(null);

  useEffect(() => {
    if (!isWarehouse || !newOrders?.data) return;

    const currentIds = new Set(newOrders.data.map(order => order.id));

    if (knownNewOrderIds.current === null) {
      knownNewOrderIds.current = currentIds;
      return;
    }

    const arrivedIds = [...currentIds].filter(id => !knownNewOrderIds.current.has(id));

    if (arrivedIds.length > 0) {
      arrivedIds.forEach(id => {
        const order = newOrders.data.find(o => o.id === id);
        toast.success(
          t('notifications.newOrder', {
            store: order?.store?.name || t('notifications.aStore'),
          }),
        );
      });
      startTitleBlink(t('notifications.newOrderTitle', { count: currentIds.size }));
    }

    knownNewOrderIds.current = currentIds;
  }, [newOrders, isWarehouse, t]);

  useEffect(() => {
    if (!isStore || !myOrders?.data) return;

    const currentStatuses = new Map(myOrders.data.map(order => [order.id, order.status]));

    if (knownStatuses.current === null) {
      knownStatuses.current = currentStatuses;
      return;
    }

    currentStatuses.forEach((status, id) => {
      const prevStatus = knownStatuses.current.get(id);
      if (prevStatus && prevStatus !== status) {
        const order = myOrders.data.find(o => o.id === id);
        toast.success(t('notifications.statusChanged', { name: order?.name, status }));
      }
    });

    knownStatuses.current = currentStatuses;
  }, [myOrders, isStore, t]);

  useEffect(() => {
    if (location.pathname === '/all-orders') {
      stopTitleBlink();
    }
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener('focus', stopTitleBlink);
    return () => window.removeEventListener('focus', stopTitleBlink);
  }, []);
};

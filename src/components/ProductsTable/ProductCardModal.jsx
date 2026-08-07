import {
  Badge,
  Button,
  Center,
  FileButton,
  Group,
  Image,
  Modal,
  Select,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { ImageOff, Trash, Upload } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { productTags } from '../../constants/productTags';
import {
  useDeleteProductImageMutation,
  useGetAllProductsQuery,
  useGetAllWarehousesQuery,
  useGetProductMonthlyOrderedQuery,
  useUpdateProductsMutation,
  useUploadProductImageMutation,
} from '../../store/api/api';
import { userRoleSelector } from '../../store/selectors/selectors';
import { getApiErrorMessage } from '../../utils/apiError';

const ProductCardModal = ({ product, onClose }) => {
  const { t } = useTranslation('products');
  const userRole = useSelector(userRoleSelector);
  const canManage = ['ADMIN', 'WAREHOUSE'].includes(userRole);
  const isAdmin = userRole === 'ADMIN';

  const { data: warehouses = [] } = useGetAllWarehousesQuery(undefined, {
    skip: !product || !canManage,
  });
  const { data: monthlyOrdered } = useGetProductMonthlyOrderedQuery(product?.id, {
    skip: !product || !canManage,
  });
  const { data: allProducts = [] } = useGetAllProductsQuery(undefined, {
    skip: !product || !isAdmin,
  });
  const [uploadImage, { isLoading: isUploading }] = useUploadProductImageMutation();
  const [deleteImage, { isLoading: isDeletingImage }] = useDeleteProductImageMutation();
  const [updateProduct, { isLoading: isUpdatingRecipient }] = useUpdateProductsMutation();
  const [fullView, setFullView] = useState(false);

  if (!product) return null;

  const orderRecipient = product.orderRecipient || 'WAREHOUSE';

  const recipientOptions = [
    { value: 'WAREHOUSE', label: t('card.recipientWarehouse') },
    { value: 'ADMIN', label: t('card.recipientAdmin') },
  ];

  const scopeOptions = productTags.map(tag => ({ value: tag, label: tag }));

  const substituteOptions = allProducts
    .filter(p => p.id !== product.id)
    .map(p => ({ value: p.id, label: `${p.article} — ${p.name}` }));

  const handleRecipientUpdate = async (field, value) => {
    if (!value || value === product[field]) return;
    try {
      await updateProduct({ ...product, [field]: value }).unwrap();
      toast.success(t('updated'));
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'updateFailed'));
    }
  };

  const handleSubstituteUpdate = async value => {
    if ((value || null) === (product.substituteId || null)) return;
    try {
      await updateProduct({ ...product, substituteId: value || null }).unwrap();
      toast.success(t('updated'));
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'updateFailed'));
    }
  };

  const stocksByWarehouse = new Map(
    (product.stocks || []).map(stock => [stock.warehouse?.id, stock]),
  );

  const rows = warehouses.map(warehouse => {
    const stock = stocksByWarehouse.get(warehouse.id);
    return {
      id: warehouse.id,
      name: warehouse.name,
      isDefault: warehouse.isDefault,
      packageCount: stock?.packageCount ?? 0,
      quantity: stock?.quantity ?? 0,
    };
  });

  const totalQuantity = rows.reduce((sum, row) => sum + row.quantity, 0);
  const totalPackages = rows.reduce((sum, row) => sum + row.packageCount, 0);

  const handleUpload = async file => {
    if (!file) return;
    try {
      await uploadImage({ id: product.id, file }).unwrap();
      toast.success(t('card.photoUploaded'));
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'card.photoUploadFailed'));
    }
  };

  const handleDeleteImage = async () => {
    try {
      await deleteImage(product.id).unwrap();
      toast.success(t('card.photoDeleted'));
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'card.photoDeleteFailed'));
    }
  };

  return (
    <Modal
      opened={!!product}
      onClose={onClose}
      title={
        <Stack gap={0}>
          <Text fw={700}>{product.name}</Text>
          <Text
            size="xs"
            c="dimmed"
          >
            {product.article}
          </Text>
        </Stack>
      }
      size="lg"
      centered
      padding={{ base: 'md', sm: 'lg' }}
    >
      <Stack gap="md">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fit="contain"
            mah={280}
            radius="md"
            style={{ cursor: 'zoom-in' }}
            onClick={() => setFullView(true)}
          />
        ) : (
          <Center
            h={140}
            bg="gray.0"
            style={{ borderRadius: 8 }}
          >
            <Stack
              align="center"
              gap={4}
            >
              <ImageOff
                size={28}
                color="var(--mantine-color-gray-5)"
              />
              <Text
                size="sm"
                c="dimmed"
              >
                {t('card.noPhoto')}
              </Text>
            </Stack>
          </Center>
        )}

        {canManage && (
          <Group justify="center">
            <FileButton
              onChange={handleUpload}
              accept="image/png,image/jpeg,image/webp,image/gif"
            >
              {props => (
                <Button
                  {...props}
                  variant="light"
                  leftSection={<Upload size={16} />}
                  loading={isUploading}
                >
                  {product.imageUrl ? t('card.replacePhoto') : t('card.uploadPhoto')}
                </Button>
              )}
            </FileButton>
            {product.imageUrl && (
              <Button
                color="red"
                variant="light"
                leftSection={<Trash size={16} />}
                loading={isDeletingImage}
                onClick={handleDeleteImage}
              >
                {t('card.deletePhoto')}
              </Button>
            )}
          </Group>
        )}

        {canManage && (
          <>
            <Group
              justify="space-between"
              wrap="nowrap"
            >
              <Text size="sm">{t('card.orderedThisMonth')}</Text>
              <Badge
                variant="light"
                color="grape"
                size="lg"
              >
                {monthlyOrdered?.requested ?? 0} {t('columns.pcsUnit')}
              </Badge>
            </Group>

            <Group
              justify="space-between"
              wrap="nowrap"
            >
              <Text size="sm">{t('card.orderRecipientLabel')}</Text>
              {isAdmin ? (
                <Group
                  gap="xs"
                  wrap="nowrap"
                >
                  <Select
                    data={recipientOptions}
                    value={orderRecipient}
                    onChange={value => handleRecipientUpdate('orderRecipient', value)}
                    disabled={isUpdatingRecipient}
                    allowDeselect={false}
                    size="xs"
                    w={130}
                  />
                  {orderRecipient === 'ADMIN' && (
                    <Select
                      data={scopeOptions}
                      value={product.tag}
                      onChange={value => handleRecipientUpdate('tag', value)}
                      disabled={isUpdatingRecipient}
                      allowDeselect={false}
                      size="xs"
                      w={150}
                    />
                  )}
                </Group>
              ) : (
                <Group gap="xs">
                  <Badge
                    variant="light"
                    color={orderRecipient === 'WAREHOUSE' ? 'cyan' : 'red'}
                    size="lg"
                  >
                    {orderRecipient === 'WAREHOUSE'
                      ? t('card.recipientWarehouse')
                      : t('card.recipientAdmin')}
                  </Badge>
                  {orderRecipient === 'ADMIN' && (
                    <Badge
                      variant="light"
                      color="pink"
                      size="lg"
                    >
                      {product.tag}
                    </Badge>
                  )}
                </Group>
              )}
            </Group>

            <Group
              justify="space-between"
              wrap="nowrap"
              align="flex-start"
            >
              <div>
                <Text size="sm">{t('card.substituteLabel')}</Text>
                <Text
                  size="xs"
                  c="dimmed"
                  maw={220}
                >
                  {t('card.substituteHint')}
                </Text>
              </div>
              {isAdmin ? (
                <Select
                  data={substituteOptions}
                  value={product.substituteId || null}
                  onChange={handleSubstituteUpdate}
                  placeholder={t('card.substitutePlaceholder')}
                  disabled={isUpdatingRecipient}
                  clearable
                  searchable
                  size="xs"
                  w={210}
                />
              ) : product.substitute ? (
                <Badge
                  variant="light"
                  color="orange"
                  size="lg"
                >
                  {product.substitute.name}
                </Badge>
              ) : (
                <Text
                  size="xs"
                  c="dimmed"
                >
                  {t('card.substituteNone')}
                </Text>
              )}
            </Group>

            <div>
              <Text
                fw={600}
                mb={6}
              >
                {t('card.stockByWarehouse')}
              </Text>
              <Table
                withTableBorder
                verticalSpacing="xs"
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{t('card.warehouse')}</Table.Th>
                    <Table.Th>{t('columns.packages')}</Table.Th>
                    <Table.Th>{t('columns.stockQty')}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rows.map(row => (
                    <Table.Tr key={row.id}>
                      <Table.Td>
                        <Group
                          gap="xs"
                          wrap="nowrap"
                        >
                          <Text size="sm">{row.name}</Text>
                          {row.isDefault && (
                            <Badge
                              color="blue"
                              variant="light"
                              size="xs"
                            >
                              {t('card.defaultWarehouse')}
                            </Badge>
                          )}
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text
                          size="sm"
                          c="orange.7"
                          fw={600}
                        >
                          {row.packageCount}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text
                          size="sm"
                          fw={500}
                          c={row.quantity < 0 ? 'red' : undefined}
                        >
                          {row.quantity}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                  <Table.Tr>
                    <Table.Td>
                      <Text
                        size="sm"
                        fw={700}
                      >
                        {t('card.total')}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text
                        size="sm"
                        fw={700}
                        c="orange.7"
                      >
                        {totalPackages}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text
                        size="sm"
                        fw={700}
                        c={totalQuantity < 0 ? 'red' : undefined}
                      >
                        {totalQuantity}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </div>
          </>
        )}
      </Stack>

      <Modal
        opened={fullView}
        onClose={() => setFullView(false)}
        size="auto"
        centered
        title={product.name}
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fit="contain"
          mah="80vh"
        />
      </Modal>
    </Modal>
  );
};

export default ProductCardModal;

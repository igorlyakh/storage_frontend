import {
  ActionIcon,
  Avatar,
  Button,
  Container,
  FileButton,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { Image as ImageIcon, Plus, Trash, Upload } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  useCreateReturnMutation,
  useGetAllProductsQuery,
  useUploadReturnPhotoMutation,
} from '../../store/api/api';
import { getApiErrorMessage } from '../../utils/apiError';

let nextKey = 0;
const emptyItem = () => ({
  key: nextKey++,
  productId: null,
  quantity: 1,
  photoUrl: null,
  uploading: false,
});

const CreateReturnPage = () => {
  const { t } = useTranslation('returns');
  const navigate = useNavigate();
  const { data: products = [] } = useGetAllProductsQuery();
  const [uploadPhoto] = useUploadReturnPhotoMutation();
  const [createReturn, { isLoading }] = useCreateReturnMutation();

  const [items, setItems] = useState([emptyItem()]);

  const productOptions = products.map(product => ({
    value: product.id,
    label: product.name,
  }));

  const updateItem = (key, patch) => {
    setItems(current => current.map(item => (item.key === key ? { ...item, ...patch } : item)));
  };

  const addItem = () => setItems(current => [...current, emptyItem()]);

  const removeItem = key =>
    setItems(current => (current.length > 1 ? current.filter(item => item.key !== key) : current));

  const handlePhotoChange = async (key, file) => {
    if (!file) return;
    updateItem(key, { uploading: true });
    try {
      const { url } = await uploadPhoto(file).unwrap();
      updateItem(key, { photoUrl: url, uploading: false });
    } catch (error) {
      updateItem(key, { uploading: false });
      toast.error(getApiErrorMessage(t, error, 'create.photoUploadFailed'));
    }
  };

  const handleSubmit = async () => {
    if (items.some(item => !item.productId)) {
      return toast.error(t('create.productRequired'));
    }
    if (items.some(item => !item.quantity || item.quantity < 1)) {
      return toast.error(t('create.quantityRequired'));
    }
    if (items.some(item => !item.photoUrl)) {
      return toast.error(t('create.photoRequired'));
    }

    try {
      await createReturn({
        items: items.map(({ productId, quantity, photoUrl }) => ({
          productId,
          quantity,
          photoUrl,
        })),
      }).unwrap();
      toast.success(t('create.created'));
      navigate('/returns');
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'create.createFailed'));
    }
  };

  return (
    <Container
      size="lg"
      py="xl"
    >
      <Title
        order={2}
        mb="md"
      >
        {t('create.title')}
      </Title>

      <Paper
        withBorder
        radius="md"
        p={{ base: 'md', sm: 'lg' }}
      >
        <Stack gap="lg">
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('create.columns.product')}</Table.Th>
                <Table.Th>{t('create.columns.quantity')}</Table.Th>
                <Table.Th>{t('create.columns.photo')}</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {items.map(item => (
                <Table.Tr key={item.key}>
                  <Table.Td miw={220}>
                    <Select
                      placeholder={t('create.productPlaceholder')}
                      data={productOptions}
                      value={item.productId}
                      onChange={value => updateItem(item.key, { productId: value })}
                      searchable
                    />
                  </Table.Td>
                  <Table.Td w={120}>
                    <NumberInput
                      value={item.quantity}
                      onChange={value => updateItem(item.key, { quantity: value })}
                      min={1}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Group gap="sm">
                      {item.photoUrl ? (
                        <Avatar
                          src={item.photoUrl}
                          radius="sm"
                          size={40}
                        >
                          <ImageIcon size={16} />
                        </Avatar>
                      ) : null}
                      <FileButton
                        onChange={file => handlePhotoChange(item.key, file)}
                        accept="image/png,image/jpeg,image/webp,image/gif"
                      >
                        {props => (
                          <Button
                            {...props}
                            size="xs"
                            variant="light"
                            leftSection={<Upload size={14} />}
                            loading={item.uploading}
                          >
                            {item.photoUrl ? t('create.replacePhoto') : t('create.addPhoto')}
                          </Button>
                        )}
                      </FileButton>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      disabled={items.length === 1}
                      onClick={() => removeItem(item.key)}
                    >
                      <Trash size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          <Group justify="space-between">
            <Button
              variant="light"
              leftSection={<Plus size={16} />}
              onClick={addItem}
            >
              {t('create.addItem')}
            </Button>

            <Text
              size="sm"
              c="dimmed"
            >
              {t('create.itemsCount', { count: items.length })}
            </Text>
          </Group>

          <Group justify="flex-end">
            <Button
              onClick={handleSubmit}
              loading={isLoading}
            >
              {t('create.submit')}
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
};

export default CreateReturnPage;

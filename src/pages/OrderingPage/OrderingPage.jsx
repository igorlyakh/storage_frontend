import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Center, Container, Grid, Loader, Paper, Select, Stack, Text, Title } from '@mantine/core';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import SortableRow from '../../components/ui/SortableRow';
import {
  api,
  useGetAllCategoriesQuery,
  useGetAllProductsQuery,
  useReorderCategoriesMutation,
} from '../../store/api/api';
import CategoryProductsOrderList from './CategoryProductsOrderList';

const OrderingPage = () => {
  const { t } = useTranslation('products');
  const dispatch = useDispatch();
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useGetAllCategoriesQuery();
  const { data: products = [], isLoading: isProductsLoading } = useGetAllProductsQuery();
  const [reorderCategories] = useReorderCategoriesMutation();

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleCategoryDragEnd = event => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categories.findIndex(c => c.id === active.id);
    const newIndex = categories.findIndex(c => c.id === over.id);
    const newOrder = arrayMove(categories, oldIndex, newIndex);

    dispatch(
      api.util.updateQueryData('getAllCategories', undefined, draft => {
        draft.length = 0;
        draft.push(...newOrder);
      }),
    );

    reorderCategories(newOrder.map(c => c.id))
      .unwrap()
      .catch(() => toast.error(t('reorder.categoryOrderFailed')));
  };

  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));
  const effectiveCategoryId = selectedCategoryId || categories[0]?.id || null;

  const categoryProducts = products
    .filter(p => p.category?.id === effectiveCategoryId)
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <Container
      size="lg"
      py="xl"
    >
      <Title
        order={2}
        mb="xs"
      >
        {t('reorder.title')}
      </Title>
      <Text
        c="dimmed"
        size="sm"
        mb="lg"
      >
        {t('reorder.description')}
      </Text>

      <Grid>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper
            withBorder
            radius="md"
            p="md"
          >
            <Text
              fw={600}
              mb="sm"
            >
              {t('reorder.categories')}
            </Text>
            {isCategoriesLoading ? (
              <Center py="lg">
                <Loader size="sm" />
              </Center>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleCategoryDragEnd}
              >
                <SortableContext
                  items={categories.map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Stack gap={6}>
                    {categories.map(category => (
                      <SortableRow
                        key={category.id}
                        id={category.id}
                        label={category.name}
                      />
                    ))}
                  </Stack>
                </SortableContext>
              </DndContext>
            )}
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <Paper
            withBorder
            radius="md"
            p="md"
          >
            <Text
              fw={600}
              mb="sm"
            >
              {t('reorder.productsInCategory')}
            </Text>
            <Select
              data={categoryOptions}
              value={effectiveCategoryId}
              onChange={setSelectedCategoryId}
              placeholder={t('reorder.selectCategory')}
              mb="md"
              searchable
              allowDeselect={false}
            />
            {isProductsLoading ? (
              <Center py="lg">
                <Loader size="sm" />
              </Center>
            ) : (
              <CategoryProductsOrderList
                key={effectiveCategoryId}
                initialProducts={categoryProducts}
              />
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default OrderingPage;

import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Stack, Text } from '@mantine/core';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import SortableRow from '../../components/ui/SortableRow';
import { useReorderProductsMutation } from '../../store/api/api';

const CategoryProductsOrderList = ({ initialProducts }) => {
  const { t } = useTranslation('products');
  const [items, setItems] = useState(initialProducts);
  const [reorderProducts] = useReorderProductsMutation();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = event => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(p => p.id === active.id);
    const newIndex = items.findIndex(p => p.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    reorderProducts(newItems.map(p => p.id))
      .unwrap()
      .catch(() => toast.error(t('reorder.productOrderFailed')));
  };

  if (items.length === 0) {
    return (
      <Text
        c="dimmed"
        size="sm"
        ta="center"
        py="lg"
      >
        {t('reorder.noProducts')}
      </Text>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(p => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <Stack gap={6}>
          {items.map(product => (
            <SortableRow
              key={product.id}
              id={product.id}
              label={product.name}
              sublabel={product.article}
            />
          ))}
        </Stack>
      </SortableContext>
    </DndContext>
  );
};

export default CategoryProductsOrderList;

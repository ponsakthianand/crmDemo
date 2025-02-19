'use client';
import { useAppSelector } from '@/app/store/hooks';
import { ScrollArea, ScrollBar } from '@/registry/new-york/ui/scroll-area';
import { ProductEventForm } from '../event-form/event-product-form';
import PageContainer from '@/components/layout/page-container';

const AddEvent = () => {
  const accessToken = useAppSelector((state) => state.authToken);
  return (
    <PageContainer scrollable={true}>
      <ProductEventForm token={accessToken.access_token} />
    </PageContainer>
  );
};

export default AddEvent;

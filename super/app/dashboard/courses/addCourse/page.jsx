'use client';
import { useAppSelector } from '@/app/store/hooks';
import PageContainer from '@/components/layout/page-container';
import { ProductCourseForm } from '../course-form/course-product-form';

const AddEvent = () => {
  const accessToken = useAppSelector((state) => state.authToken);
  return (
    <PageContainer scrollable={true}>
      <ProductCourseForm token={accessToken.access_token} />
    </PageContainer>
  );
};

export default AddEvent;

import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createPost } from 'apiSdk/posts';
import { Error } from 'components/error';
import { postValidationSchema } from 'validationSchema/posts';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { OrganizationInterface } from 'interfaces/organization';
import { SocialMediaAccountInterface } from 'interfaces/social-media-account';
import { getOrganizations } from 'apiSdk/organizations';
import { getSocialMediaAccounts } from 'apiSdk/social-media-accounts';
import { PostInterface } from 'interfaces/post';

function PostCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PostInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPost(values);
      resetForm();
      router.push('/posts');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PostInterface>({
    initialValues: {
      content: '',
      scheduled_time: new Date(new Date().toDateString()),
      organization_id: (router.query.organization_id as string) ?? null,
      social_media_account_id: (router.query.social_media_account_id as string) ?? null,
    },
    validationSchema: postValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Post
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="content" mb="4" isInvalid={!!formik.errors?.content}>
            <FormLabel>Content</FormLabel>
            <Input type="text" name="content" value={formik.values?.content} onChange={formik.handleChange} />
            {formik.errors.content && <FormErrorMessage>{formik.errors?.content}</FormErrorMessage>}
          </FormControl>
          <FormControl id="scheduled_time" mb="4">
            <FormLabel>Scheduled Time</FormLabel>
            <Box display="flex" maxWidth="100px" alignItems="center">
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.scheduled_time ? new Date(formik.values?.scheduled_time) : null}
                onChange={(value: Date) => formik.setFieldValue('scheduled_time', value)}
              />
              <Box zIndex={2}>
                <FiEdit3 />
              </Box>
            </Box>
          </FormControl>
          <AsyncSelect<OrganizationInterface>
            formik={formik}
            name={'organization_id'}
            label={'Select Organization'}
            placeholder={'Select Organization'}
            fetcher={getOrganizations}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <AsyncSelect<SocialMediaAccountInterface>
            formik={formik}
            name={'social_media_account_id'}
            label={'Select Social Media Account'}
            placeholder={'Select Social Media Account'}
            fetcher={getSocialMediaAccounts}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.platform}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'post',
  operation: AccessOperationEnum.CREATE,
})(PostCreatePage);

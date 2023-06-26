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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getSocialMediaAccountById, updateSocialMediaAccountById } from 'apiSdk/social-media-accounts';
import { Error } from 'components/error';
import { socialMediaAccountValidationSchema } from 'validationSchema/social-media-accounts';
import { SocialMediaAccountInterface } from 'interfaces/social-media-account';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';

function SocialMediaAccountEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<SocialMediaAccountInterface>(
    () => (id ? `/social-media-accounts/${id}` : null),
    () => getSocialMediaAccountById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: SocialMediaAccountInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateSocialMediaAccountById(id, values);
      mutate(updated);
      resetForm();
      router.push('/social-media-accounts');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<SocialMediaAccountInterface>({
    initialValues: data,
    validationSchema: socialMediaAccountValidationSchema,
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
            Edit Social Media Account
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="platform" mb="4" isInvalid={!!formik.errors?.platform}>
              <FormLabel>Platform</FormLabel>
              <Input type="text" name="platform" value={formik.values?.platform} onChange={formik.handleChange} />
              {formik.errors.platform && <FormErrorMessage>{formik.errors?.platform}</FormErrorMessage>}
            </FormControl>
            <FormControl id="username" mb="4" isInvalid={!!formik.errors?.username}>
              <FormLabel>Username</FormLabel>
              <Input type="text" name="username" value={formik.values?.username} onChange={formik.handleChange} />
              {formik.errors.username && <FormErrorMessage>{formik.errors?.username}</FormErrorMessage>}
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
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'social_media_account',
  operation: AccessOperationEnum.UPDATE,
})(SocialMediaAccountEditPage);

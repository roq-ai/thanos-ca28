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
import { createSocialMediaAccount } from 'apiSdk/social-media-accounts';
import { Error } from 'components/error';
import { socialMediaAccountValidationSchema } from 'validationSchema/social-media-accounts';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';
import { SocialMediaAccountInterface } from 'interfaces/social-media-account';

function SocialMediaAccountCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: SocialMediaAccountInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createSocialMediaAccount(values);
      resetForm();
      router.push('/social-media-accounts');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<SocialMediaAccountInterface>({
    initialValues: {
      platform: '',
      username: '',
      organization_id: (router.query.organization_id as string) ?? null,
    },
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
            Create Social Media Account
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'social_media_account',
  operation: AccessOperationEnum.CREATE,
})(SocialMediaAccountCreatePage);

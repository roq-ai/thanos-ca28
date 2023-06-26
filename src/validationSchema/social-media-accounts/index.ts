import * as yup from 'yup';

export const socialMediaAccountValidationSchema = yup.object().shape({
  platform: yup.string().required(),
  username: yup.string().required(),
  organization_id: yup.string().nullable(),
});

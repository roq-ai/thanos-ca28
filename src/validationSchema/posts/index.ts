import * as yup from 'yup';

export const postValidationSchema = yup.object().shape({
  content: yup.string().required(),
  scheduled_time: yup.date().required(),
  organization_id: yup.string().nullable(),
  social_media_account_id: yup.string().nullable(),
});

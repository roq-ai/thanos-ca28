import { OrganizationInterface } from 'interfaces/organization';
import { SocialMediaAccountInterface } from 'interfaces/social-media-account';
import { GetQueryInterface } from 'interfaces';

export interface PostInterface {
  id?: string;
  content: string;
  scheduled_time: any;
  organization_id?: string;
  social_media_account_id?: string;
  created_at?: any;
  updated_at?: any;

  organization?: OrganizationInterface;
  social_media_account?: SocialMediaAccountInterface;
  _count?: {};
}

export interface PostGetQueryInterface extends GetQueryInterface {
  id?: string;
  content?: string;
  organization_id?: string;
  social_media_account_id?: string;
}

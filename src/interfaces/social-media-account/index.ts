import { PostInterface } from 'interfaces/post';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface SocialMediaAccountInterface {
  id?: string;
  platform: string;
  username: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;
  post?: PostInterface[];
  organization?: OrganizationInterface;
  _count?: {
    post?: number;
  };
}

export interface SocialMediaAccountGetQueryInterface extends GetQueryInterface {
  id?: string;
  platform?: string;
  username?: string;
  organization_id?: string;
}

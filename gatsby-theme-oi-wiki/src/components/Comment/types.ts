import { Comments, Reactions } from '@mgtd/vssue-api-github-v4/lib/types';

export interface Issue {
  id: string;
  title: string;
  content: string;
  link: string;
}

export { Comments, Reactions };

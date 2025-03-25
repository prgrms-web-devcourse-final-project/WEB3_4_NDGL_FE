import { LINKS } from './links';

type NavbarItemsIdType = 'logout' | 'my_info' | 'my_blog' | 'collection';
export type NavbarItemsType = {
  id: NavbarItemsIdType;
  href: string | null;
  label: string;
};

export const navbarItems: NavbarItemsType[] = [
  { id: 'logout', href: null, label: '로그아웃' },
  { id: 'my_info', href: LINKS.PROFILE, label: '내 정보' },
  { id: 'my_blog', href: LINKS.POSTS, label: '내 블로그' },
  { id: 'collection', href: null, label: '컬렉션' },
];

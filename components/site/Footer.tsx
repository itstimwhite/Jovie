import { Footer as FooterOrganism } from '@/components/organisms/Footer';

export function Footer() {
  return (
    <FooterOrganism
      variant='marketing'
      showThemeToggle={true}
      links={[
        { href: '/legal/privacy', label: 'Privacy' },
        { href: '/legal/terms', label: 'Terms' },
      ]}
    />
  );
}

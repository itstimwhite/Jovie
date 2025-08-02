import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import { Container } from '@/components/site/Container';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';

export const metadata = {
  title: 'Terms of Service',
  description: 'Jovie Terms of Service - Rules and guidelines for using our service.',
};

export default async function TermsPage() {
  const filePath = path.join(process.cwd(), 'docs', 'terms.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  
  const processedContent = await remark()
    .use(html)
    .process(fileContents);
  
  const contentHtml = processedContent.toString();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div 
              className="prose prose-gray max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
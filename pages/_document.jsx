import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html className='transition scroll-smooth'>
        <Head>
          <link
            href='https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,700&display=swap'
            rel='stylesheet'
          />
          <link
            href='https://fonts.googleapis.com/css2?family=Fuzzy+Bubbles:wght@400;700&display=swap'
            rel='stylesheet'
          />
        </Head>
        <Main />
        <NextScript />
        <div id='modal-root'></div>
      </Html>
    );
  }
}

export default MyDocument;

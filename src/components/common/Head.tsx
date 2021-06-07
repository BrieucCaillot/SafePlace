import HeadNext from 'next/head'

const title = 'Safeplace'
const url = 'https://safe-place.vercel.app/'
const description =
  'Accordez-vous des instants, dans un monde calme et serein  :  votre safe place. Prenez le temps de vous imprégner de la quiétude du lieu, en le parcourant. Laissez-vous porter dans des voyages narratifs, qui vous apporteront tranquillité et relaxation au fil des interactions.'
const author = 'Brieuc CAILLOT & Léon BAUDOIN'

const Head = () => {
  return (
    <>
      <HeadNext>
        {/* Recommended Meta Tags */}
        <meta charSet='utf-8' />
        <meta name='language' content='english' />
        <meta httpEquiv='content-type' content='text/html' />
        <meta name='author' content={author} />
        <meta name='designer' content={author} />
        <meta name='publisher' content={author} />

        {/* Search Engine Optimization Meta Tags */}
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta
          name='keywords'
          content='Safeplace, Relaxation, Voix-off, Musique, Ambiance, Experience, Gobelins, 2021'
        />
        <meta name='robots' content='index,follow' />
        <meta name='distribution' content='web' />
        {/*
      Facebook Open Graph meta tags
        documentation: https://developers.facebook.com/docs/sharing/opengraph */}
        <meta name='og:title' content={title} />
        <meta name='og:type' content='site' />
        <meta name='og:url' content={url} />
        <meta name='og:image' content={'/icons/share.png'} />
        <meta name='og:image:alt' content='safeplace_image' />
        <meta name='og:site_name' content={title} />
        <meta name='og:description' content={description} />

        {/* Twitter Meta Tags */}
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:image' content={'/icons/share.png'} />
        <meta name='twitter:card' content='summary_large_image' />

        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Philosopher:ital,wght@0,400;0,700;1,400&display=swap'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Tenor+Sans&display=swap'
          rel='stylesheet'
        />

        <link
          rel='apple-touch-icon'
          sizes='57x57'
          href='/icons/apple-icon-57x57.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='60x60'
          href='/icons/apple-icon-60x60.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='72x72'
          href='/icons/apple-icon-72x72.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='76x76'
          href='/icons/apple-icon-76x76.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='114x114'
          href='/icons/apple-icon-114x114.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='120x120'
          href='/icons/apple-icon-120x120.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='144x144'
          href='/icons/apple-icon-144x144.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='152x152'
          href='/icons/apple-icon-152x152.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/icons/apple-icon-180x180.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='192x192'
          href='/icons/android-icon-192x192.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/img/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='96x96'
          href='/img/favicon-96x96.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/img/favicon-16x16.png'
        />

        <link rel='manifest' href='/manifest.json' />

        {/* Meta Tags for HTML pages on Mobile */}
        {/* <meta name="format-detection" content="telephone=yes"/>
        <meta name="HandheldFriendly" content="true"/>  */}
        <meta
          name='viewport'
          content='width=device-width, minimum-scale=1, initial-scale=1.0'
        />
        <meta name='theme-color' content='#000' />
        <meta name='msapplication-TileColor' content='#ffffff' />
        <meta name='msapplication-TileImage' content='/ms-icon-144x144.png' />
        <meta name='theme-color' content='#ffffff'></meta>

        {/*
      Twitter Summary card
        documentation: https://dev.twitter.com/cards/getting-started
        Be sure validate your Twitter card markup on the documentation site. */}
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@onirenaud' />
      </HeadNext>
    </>
  )
}

export default Head

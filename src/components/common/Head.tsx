import HeadNext from 'next/head'

const title = 'Safeplace'
const url = 'https://safe-place.vercel.app/'
const description = 'Safeplace description'
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
          content='Software Engineer,Product Manager,Project Manager,Data Scientist,Computer Scientist'
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
        <meta name='og:site_name' content={title} />
        <meta name='og:description' content={description} />

        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Philosopher:ital,wght@0,400;0,700;1,400&display=swap'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Tenor+Sans&display=swap'
          rel='stylesheet'
        />
        <link rel='apple-touch-icon' href='/icons/apple-touch-icon.png' />
        <link
          rel='apple-touch-icon'
          sizes='16x16'
          href='/icons/favicon-16x16.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='32x32'
          href='/icons/favicon-32x32.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/icons/apple-touch-icon.png'
        />
        <link rel='manifest' href='/manifest.json' />
        <link
          rel='mask-icon'
          color='#000000'
          href='/icons/safari-pinned-tab.svg'
        />
        <link rel='apple-touch-startup-image' href='/startup.png' />

        {/* Meta Tags for HTML pages on Mobile */}
        {/* <meta name="format-detection" content="telephone=yes"/>
        <meta name="HandheldFriendly" content="true"/>  */}
        <meta
          name='viewport'
          content='width=device-width, minimum-scale=1, initial-scale=1.0'
        />
        <meta name='theme-color' content='#000' />
        <link rel='shortcut icon' href='/icons/favicon.ico' />

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

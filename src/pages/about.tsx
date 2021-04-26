const About = () => {
  return (
    <>
      <main className='h-full'>
        <div className='container h-full'>
          <div className='flex w-full md:w-3/4 mx-auto h-full flex-col justify-center items-center text-center'>
            <h1 className='text-primary text-5xl pb-9'>Projet</h1>
            <p className='text-secondary text-base'>
              Accordez-vous des instants, dans un monde calme et serein : votre
              safe place.
            </p>
            <p className='text-secondary text-base'>
              Prenez le temps de vous imprégner de la quiétude du lieu, en le
              parcourant.
            </p>
            <p className='text-secondary text-base'>
              Laissez-vous porter dans des voyages narratifs, qui vous
              apporteront <br /> tranquillité et relaxation aux fils des
              interactions.
            </p>
            <h2 className='text-primary text-5xl pt-12 pb-9'>Crédits</h2>
            <div className='flex w-full'>
              <div className='flex flex-col w-full md:w-1/2'>
                <h3 className='text-white font-serif italic pb-3'>Designers</h3>
                <p className='text-secondary'>Marie-Liesse de Solages</p>
                <p className='text-secondary'>Alexandre Gomez Pardo</p>
                <p className='text-secondary'>Roxane Peuvrier</p>
              </div>

              <div className='flex flex-col w-full md:w-1/2'>
                <h3 className='text-white font-serif italic pb-3'>
                  Développeurs
                </h3>
                <p className='text-secondary'>Léon Baudouin</p>
                <p className='text-secondary'>Brieuc Caillot</p>
              </div>
            </div>
            <div className='flex w-full pt-8'>
              <div className='flex flex-col w-full md:w-1/2'>
                <h3 className='text-white font-serif italic pb-3'>Voix off</h3>
                <p className='text-secondary'>Artiste</p>
              </div>
              <div className='flex flex-col w-full md:w-1/2'>
                <h3 className='text-white font-serif italic pb-3'>Musique</h3>
                <p className='text-secondary'>Artiste</p>
              </div>
            </div>
            <p className='text-secondary pt-9 pb-9'>
              Nous remercions tout l'équipe pédagogique de Gobelins
            </p>
            <img
              className='w-16'
              src='/img/about/logo-gobelins.png'
              alt='logo-gobelins'
            />
          </div>
        </div>
      </main>
    </>
  )
}

export default About

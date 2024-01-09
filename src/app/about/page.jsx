import React from 'react';
import styles from '@/app/styles/aboutme.module.css';

const Page = () => {
  return (
    <div className={styles.mainWrapper}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      <h1 className='text-white text-2xl'>Sobre Nosotros</h1>
      <div className={styles.contentItem}>
        <div className={styles.imageContainer}>
          <img className="w-full" src="https://avatars.githubusercontent.com/u/91286415?v=4" alt="Imagen" />
        </div>
        <div className={styles.textContainer}>
          <span className="font-bold text-2xl text-violet-300 border-b-2 px-2">Luciano Bugarin</span>
          <p className="text-violet-200">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias officia atque error? Dolores reprehenderit quam facilis tenetur quia iste, enim, minus possimus velit hic nihil esse exercitationem dolorum, accusantium iusto.
          </p>

          <div className={styles.iconContainer}>
            <a href='https://github.com/BugaToro' alt='GitHub'>
              <div className={styles.iconItem}>
                <i className="fa fa-brands fa-github text-black fa-lg"></i>
              </div>
            </a>
            <a href='https://www.facebook.com/luchogoofy.buga' alt='Facebook'>
              <div className={styles.iconItem}>
                <i className="fa fa-brands fa-facebook text-black fa-lg"></i>
              </div>
            </a>
            <a href='https://www.instagram.com/_buga_99' alt='Instagram'>
              <div className={styles.iconItem}>
                <i className="fa fa-brands fa-instagram text-black fa-lg"></i>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className={styles.contentItem}>
        <div className={styles.imageContainer}>
          <img className="w-full" src="https://scontent.fafa1-1.fna.fbcdn.net/v/t39.30808-6/409559955_10159873354998317_4330106527178244085_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeH1EXAMwhyPeZV7yG0hwZf94hE2_YD-H5PiETb9gP4fk5SypolKEvncm1MP4TWTpe7Iq5G5M--QjMTUdSXqROpp&_nc_ohc=LIAXsv6xj84AX8POBYw&_nc_ht=scontent.fafa1-1.fna&oh=00_AfCILjgVuynkRaCc6Wmy5mumTQ9Edl1wl2dQsUB-tcKTEw&oe=657D50D0" alt="Imagen" />
        </div>
        <div className={styles.textContainer}>
          <span className="font-bold text-2xl text-violet-300 border-b-2 px-2">Mauricio Granda</span>
          <p className="text-violet-200">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias officia atque error? Dolores reprehenderit quam facilis tenetur quia iste, enim, minus possimus velit hic nihil esse exercitationem dolorum, accusantium iusto.
          </p>
          <div className={styles.iconContainer}>
            <a href='https://github.com/Maury32' alt='GitHub'>
              <div className={styles.iconItem}>
                <i className="fa fa-brands fa-github text-black fa-lg"></i>
              </div>
            </a>
            <a href='https://www.facebook.com/maurymagro' alt='Facebook'>
              <div className={styles.iconItem}>
                <i className="fa fa-brands fa-facebook text-black fa-lg"></i>
              </div>
            </a>
            <a href='https://www.instagram.com/granda.maury/' alt='Instagram'>
              <div className={styles.iconItem}>
                <i className="fa fa-brands fa-instagram text-black fa-lg"></i>
              </div>
            </a>
          </div>
        </div>
      </div>

    </div>

  );
};

export default Page;

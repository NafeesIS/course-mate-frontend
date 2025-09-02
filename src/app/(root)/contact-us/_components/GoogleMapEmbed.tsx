'use client';

const GoogleMapEmbed = () => {
  return (
    <div className='mapouter'>
      <div className='gmap_canvas'>
        <iframe
          className='gmap_iframe'
          width='100%'
          height='400px'
          // frameBorder='0'
          // scrolling='no'
          // marginHeight='0'
          // marginWidth='0'
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d333.57357457605787!2d72.83533950839899!3d18.93342191385347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1db13c6c627%3A0x9ffb19f387fe9675!2sRahimtoola%20House%2C%204%2C%20Homji%20St%2C%20near%20Modern%20Book%20Stall%2C%20Kala%20Ghoda%2C%20Fort%2C%20Mumbai%2C%20Maharashtra%20400001%2C%20India!5e0!3m2!1sen!2sbd!4v1723266915010!5m2!1sen!2sbd'
          allowFullScreen
          title='Google Map'
        ></iframe>
      </div>
      <style jsx>{`
        .mapouter {
          position: relative;
          text-align: right;
          width: 100%;
          height: 400px;
        }
        .gmap_canvas {
          overflow: hidden;
          background: none !important;
          width: 100%;
          height: 400px;
        }
        .gmap_iframe {
          height: 400px !important;
        }
      `}</style>
    </div>
  );
};

export default GoogleMapEmbed;

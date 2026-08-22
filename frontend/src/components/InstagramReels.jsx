import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import { Camera, Heart, MessageCircle, Send } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

const reelsData = [
  {
    id: 1,
    shortcode: "C837aLmxZrl",
    igLink: "https://www.instagram.com/reel/C837aLmxZrl/"
  },
  {
    id: 2,
    shortcode: "C7Q3k1iRCvF",
    igLink: "https://www.instagram.com/reel/C7Q3k1iRCvF/"
  },
  {
    id: 3,
    shortcode: "DHIY7agoZGf",
    igLink: "https://www.instagram.com/reel/DHIY7agoZGf/"
  },
  {
    id: 4,
    shortcode: "DM-Wan5yxS9",
    igLink: "https://www.instagram.com/reel/DM-Wan5yxS9/"
  }
];

export default function InstagramReels() {
  return (
    <section className="py-24 bg-transparent border-t border-text-primary/5 relative">
      {/* Background glow and glassmorphism */}
      <div className="absolute inset-0 bg-surface-dark/40 backdrop-blur-sm z-0 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-gradient-to-r from-brand/10 via-surface-card/10 to-brand/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-1 shadow-lg shadow-pink-500/20">
            <div className="w-full h-full bg-surface-dark rounded-xl flex items-center justify-center">
              <Camera className="text-text-primary w-8 h-8" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-text-primary">SJR on the Move</h2>
            <a href="https://www.instagram.com/sjrtyresofficial?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-text-secondary text-lg mt-1 font-medium hover:text-brand transition-colors flex items-center gap-2">
              @sjrtyresofficial
            </a>
          </div>
        </div>
        <a href="https://www.instagram.com/sjrtyresofficial?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-gradient-to-r from-brand to-brand text-text-primary font-bold rounded-full shadow-[0_0_30px_rgba(112,214,197,0.4)] hover:shadow-[0_0_50px_rgba(112,214,197,0.6)] hover:scale-105 transition-all flex items-center gap-2">
          <Camera size={20} /> Follow Us
        </a>
      </div>

      <div className="relative z-10 w-full mx-auto px-0 md:px-4">
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 250,
            modifier: 1.5,
            slideShadows: true,
          }}
          modules={[EffectCoverflow, Autoplay]}
          className="w-full py-10"
        >
          {reelsData.map((reel) => (
            <SwiperSlide 
              key={reel.id} 
              className="!w-[300px] md:!w-[340px] aspect-[9/16] relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group bg-white border border-text-primary/10"
            >
              {/* Overlay block for Swiper drag events when not active */}
              <div className="absolute inset-0 z-20 pointer-events-auto group-[.swiper-slide-active]:pointer-events-none"></div>

              {/* Instagram Embed iframe */}
              <iframe 
                src={`https://www.instagram.com/p/${reel.shortcode}/embed/`}
                className="absolute top-0 left-0 w-[calc(100%+2px)] h-[calc(100%+2px)] -translate-x-[1px] -translate-y-[1px] border-0 outline-none"
                scrolling="no"
                allowTransparency="true"
                allow="encrypted-media"
                style={{ background: 'white' }}
              ></iframe>

              {/* Quick Link Button at the bottom for active slide */}
              <div className="absolute inset-x-0 bottom-4 z-30 flex justify-center opacity-0 group-[.swiper-slide-active]:opacity-100 transition-opacity duration-500 pointer-events-none group-[.swiper-slide-active]:pointer-events-auto">
                <a 
                  href={reel.igLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-6 py-2 bg-brand/90 backdrop-blur-md text-text-primary font-bold rounded-full text-sm shadow-[0_0_20px_rgba(112,214,197,0.4)] hover:scale-105 hover:bg-brand transition-all border border-brand/50"
                >
                  View on Instagram
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

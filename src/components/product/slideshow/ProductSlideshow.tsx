'use client'
import { useState } from 'react';

import Image from 'next/image';

import { Swiper as SwiperObject } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'

import 'swiper/css';

interface Props {
    images: string[];
    title: string;
    className?: string;
}

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import './slideshow.css';

export const ProductSlideshow = ({ images, title, className }: Props) => {

    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();

    return (
        <div className={className}>
            <Swiper
                style={{
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                } as React.CSSProperties
                }
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper2"
            >
                {
                    images.map(image => (
                        <SwiperSlide key={ image }>
                            <Image
                                width={ 1024 }
                                height={ 800 }
                                src={`/products/${image}`}
                                alt={ title }
                                className='rounded-lg object-fill'
                            />
                        </SwiperSlide>
                    ))
                }

            </Swiper>
        </div>
    )
}

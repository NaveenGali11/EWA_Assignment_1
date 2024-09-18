import React, { useState } from 'react';
import {
    Carousel as ReactStrapCarousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
} from 'reactstrap';

import DoorbellsBanner from "../images/doorbells.png";
import DoorlocksBanner from "../images/doorlocks.png";
import SpeakersBanner from "../images/speakers.png";

const items = [
    {
        src: DoorbellsBanner,
        altText: 'Doorbells',
        caption: 'Smart Doorbells',
        key: 1,
    },
    {
        src: DoorlocksBanner,
        altText: 'Doorlocks',
        caption: 'Smart Doorlocks',
        key: 2,
    },
    {
        src: SpeakersBanner,
        altText: 'Speakers',
        caption: 'Smart Speakers',
        key: 3,
    },
];

function Carousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    };

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    };

    const goToIndex = (newIndex: number) => {
        if (animating) return;
        setActiveIndex(newIndex);
    };

    const slides = items.map((item) => {
        return (
            <CarouselItem
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={item.src}
            >
                <img src={item.src} alt={item.altText} style={{
                    height: '300px',
                }} />
            </CarouselItem>
        );
    });

    return (
        <ReactStrapCarousel
            activeIndex={activeIndex}
            next={next}
            previous={previous}
        >
            <CarouselIndicators
                items={items}
                activeIndex={activeIndex}
                onClickHandler={goToIndex}
            />
            {slides}
            <CarouselControl
                direction="prev"
                directionText="Previous"
                onClickHandler={previous}
            />
            <CarouselControl
                direction="next"
                directionText="Next"
                onClickHandler={next}
            />
        </ReactStrapCarousel>
    );
}

export default Carousel;
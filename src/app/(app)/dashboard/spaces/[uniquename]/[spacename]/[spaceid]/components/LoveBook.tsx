'use client'

import React, { useState } from 'react';
import LoveGalleryCustomizer from './LoveBookCustomizer';
import { EmbedCodeGenerator } from './EmbedCodeGenerator';
import { usePathname } from 'next/navigation';
import RealTimePreview from './RealTimePreview';

interface LoveGalleryProps {
    spaceId: string,
}

const LoveGallery: React.FC<LoveGalleryProps> = ({ spaceId }) => {

    const [theme, setTheme] = useState<string>('light');
    const [layout, setLayout] = useState<'carousel' | 'grid'>('carousel');

    return (
        <div className='flex flex-col gap-4'>

            <LoveGalleryCustomizer
                theme={theme}
                setTheme={setTheme}
                layout={layout}
                setLayout={setLayout}

            />

            <RealTimePreview spaceId={spaceId} theme={theme} layout={layout} />

            <EmbedCodeGenerator
                spaceId={spaceId}
                theme={theme}
                layout={layout}
            />
        </div>
    );
};

export default LoveGallery;
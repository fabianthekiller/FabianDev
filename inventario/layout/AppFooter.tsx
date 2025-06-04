/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';
import Image from 'next/image';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
                <Image 
                    src={layoutConfig.colorScheme !== 'dark' ? '/logo_white.png' : '/logo.png'} 
                    width={50} 
                    height={50} 
                    alt="logo"
                />
            <span className="font-medium ml-2">Rosal motos</span>
        </div>
    );
};

export default AppFooter;

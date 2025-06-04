/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <img src={`/logo.png`} alt="logo" width="50" height="50" className="w-2rem h-2rem mr-2" />
            <span className="font-medium ml-2">Rosal motos</span>
        </div>
    );
};

export default AppFooter;

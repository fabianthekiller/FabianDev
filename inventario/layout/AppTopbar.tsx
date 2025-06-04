"use client";
import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { PrimeReactContext } from 'primereact/api';
import Image from 'next/image';
import { signOut, useSession } from "next-auth/react"
import Avatar from 'react-avatar';
import { OverlayPanel } from 'primereact/overlaypanel';
import moment from 'moment';


const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar, setLayoutConfig } = useContext(LayoutContext);
    const { setRipple, changeTheme } = useContext(PrimeReactContext);

    const { data: session } = useSession()

    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const overlayPanelRef = useRef<OverlayPanel>(null);
    const [currentTime, setCurrentTime] = useState(new Date());


    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    moment(session?.expires).format('DD/MM/YYYY HH:mm:ss')
    moment(session?.expires).from(currentTime)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <Image 
                    src={layoutConfig.colorScheme !== 'dark' ? '/logo_white.png' : '/logo.png'} 
                    width={100} 
                    height={100} 
                    alt="logo"
                />
                <span>Rosal Motos</span>
            </Link>

            <OverlayPanel ref={overlayPanelRef} className="overlaypanel-demo" showCloseIcon>
                <div className="flex flex-column align-items-center">
                    <Avatar
                        value={session?.user?.name ?? 'NU'}
                        size="40"
                        round={true}
                        style={{ marginBottom: '10px' }}
                    />

                    <div className="flex flex-column align-items-center">
                        <span className="font-bold">{session?.user?.name}</span>
                        <span className="text-500">{session?.user?.email}</span>
                    </div>

                    {session?.expires && (
                        <div className="flex flex-column mt-3 p-2 surface-100 border-round align-items-center">
                            <span className="text-600 mb-2">Sesión expira en:</span>
                            <span className="text-primary font-medium">
                                {moment(session.expires).format('DD/MM/YYYY HH:mm')}
                            </span>
                            <span className="text-500 text-sm">
                                {moment(session.expires).fromNow()}
                            </span>
                        </div>
                    )}
                </div>

            </OverlayPanel>



            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <div className="flex align-items-center justify-content-center gap-3">
                    <button
                        type="button"
                        className="p-link layout-topbar-button"
                        onClick={() => {
                            changeTheme?.(layoutConfig.theme, layoutConfig.colorScheme === 'light' ? 'tailwind-light' : 'viva-dark', 'theme-css');
                            setLayoutConfig({
                                ...layoutConfig,
                                ripple: !layoutConfig.ripple,
                                colorScheme: layoutConfig.colorScheme === 'light' ? 'dark' : 'light',
                                theme: layoutConfig.colorScheme === 'light' ? 'tailwind-light' : 'viva-dark',
                            });
                        }}
                    >
                        <i className={layoutConfig.colorScheme === 'light' ? 'pi pi-sun' : 'pi pi-moon'}></i>
                        <span>{layoutConfig.colorScheme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>

                    <Avatar
                        value={session?.user?.name ?? 'NU'}
                        size="40"
                        round={true}
                        style={{ cursor: 'pointer' }}
                        onClick={(event) => {
                            overlayPanelRef.current?.toggle(event);
                        }}
                    />

                    {JSON.stringify(session) !== '{}' && (
                        <button
                            type="button"
                            className="p-link layout-topbar-button"
                            onClick={() => {
                                signOut();
                            }}
                        >
                            <i className="pi pi-sign-out"></i>
                            <span>Cerrar Sesión</span>
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;

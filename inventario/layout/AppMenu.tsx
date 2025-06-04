/* eslint-disable @next/next/no-img-element */

import React, { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '@/types';
import { FaFileInvoiceDollar, FaPuzzlePiece, FaTools, FaTruckMoving } from "react-icons/fa";
import { MdEmojiPeople, MdOutlineElectricalServices } from 'react-icons/md';
import { TbMotorbike } from 'react-icons/tb';
import { useSession } from 'next-auth/react';
import { is_admin } from '@/actions/usuarios/crud';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [is_adminState, setIsAdminState] = useState<boolean | null>(null);

    const session = useSession();


    useEffect(() => {
        if (!is_adminState) {
            const mail = session?.data?.user?.email;
            is_admin(mail as string).then((res) => {
                setIsAdminState(res);
            }
            ).catch((err) => {
                console.error("Error checking admin status:", err);
                setIsAdminState(false); // Default to false if there's an error
            }
            );
        }
    }, [is_adminState]);




    console.log("Session:", is_adminState)





    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [
                { label: 'Resumen', icon: 'pi pi-fw pi-home', to: '/' },
            ]

        },
        {
            label: 'Taller',
            items: [
                { label: 'Reparaciones', icon: <FaTools fontSize={20} className='mr-2' />, to: '/taller/reparaciones' },
                { label: 'Servicios', icon: <MdOutlineElectricalServices fontSize={28} className='mr-2' />, to: '/taller/servicios' },
                { label: 'Clientes', icon: <MdEmojiPeople fontSize={26} className='mr-2' />, to: '/taller/clientes' },
                {
                    label: 'Motocicletas',
                    icon: <TbMotorbike fontSize={26} className='mr-2' />,
                    to: '/taller/motocicletas'

                },
            ]
        },
    ];

    const modelAdmin: AppMenuItem[] = [
        {
            label: 'Home',
            items: [
                { label: 'Resumen', icon: 'pi pi-fw pi-home', to: '/' },
                { label: 'Usuarios', icon: 'pi pi-fw pi-users', to: '/usuarios' },

            ]

        },
        {
            label: 'Taller',
            items: [
                { label: 'Reparaciones', icon: <FaTools fontSize={20} className='mr-2' />, to: '/taller/reparaciones' },
                { label: 'Servicios', icon: <MdOutlineElectricalServices fontSize={28} className='mr-2' />, to: '/taller/servicios' },
                { label: 'Partes', icon: <FaPuzzlePiece fontSize={22} className='mr-2' />, to: '/taller/partes' },
                { label: 'Clientes', icon: <MdEmojiPeople fontSize={26} className='mr-2' />, to: '/taller/clientes' },
                {
                    label: 'Proveedores',
                    icon: <FaTruckMoving fontSize={26} className='mr-2' />,
                    to: '/taller/proveedores'

                },
                {
                    label: 'Motocicletas',
                    icon: <TbMotorbike fontSize={26} className='mr-2' />,
                    to: '/taller/motocicletas'

                },
                {
                    label: 'Facturas',
                    icon: <FaFileInvoiceDollar fontSize={26} className='mr-2' />,
                    to: '/taller/facturas'
                },
            ]
        },
    ];

    if  (!is_adminState) {
        return (
            <MenuProvider>
                <ul className="layout-menu">
                    {model.map((item, i) => {
                        return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                    })}

                </ul>
            </MenuProvider>
        );
    }
    else{

        return (
            <MenuProvider>
                <ul className="layout-menu">
                    {modelAdmin.map((item, i) => {
                        return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                    })}
    
                </ul>
            </MenuProvider>
        );

    }


    
};

export default AppMenu;

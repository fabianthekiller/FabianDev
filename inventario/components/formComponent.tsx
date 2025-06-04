"use client";

import { FC, use, useEffect, useRef, useState } from "react";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { crearElemento } from "@/actions/adder";
import { actualizarElemento } from "@/actions/updater";
import { AutoComplete, AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { buscarElemento } from "@/actions/searcher";
import { asignarElemento } from "@/actions/asigner";
interface FormComponentProps {
    modo: string;
    esquema?: any;
    valoresIniciales?: any;
    tipoCreacion?: string;
    crearFCN?: any;
    editarFCN?: any;
    padreAsignacion?: any;
    preasignado?: any;
}





export const FormComponent: FC<FormComponentProps> = ({
    modo, esquema, valoresIniciales, tipoCreacion,
    crearFCN, editarFCN, preasignado
}) => {


    const [esquemaParseado, setEsquemaParseado] = useState<any>(null);
    const [valoresInicialesState, setValoresInicialesState] = useState<any>(null);

    const [valoresBuscados, setValoresBuscados] = useState<any>([]);
    const [valorBuscado, setValorBuscado] = useState<any>(null);

    const router = useRouter();
    const toast = useRef<Toast>(null);

    useEffect(() => {
        if (esquema) {
            const esquemaParseado = typeof esquema === 'string' ? JSON.parse(esquema) : esquema;
            const keys = Object.keys(esquemaParseado.properties);
            
            

            const validaciones: any = {};
            keys.forEach((key: string) => {
                const propiedad = esquemaParseado.properties[key];

                if (key === 'id' && modo !== 'crear') {
                    validaciones[key] = Yup.string().uuid('El id debe ser un UUID');
                }
                if (propiedad.type === 'string' && esquemaParseado.required.includes(key)) {
                    validaciones[key] = Yup.string().required('Campo requerido');
                }
                else if (propiedad.type === 'number' && esquemaParseado.required.includes(key)) {
                    validaciones[key] = Yup.number().required('Campo requerido');
                }
                else if (propiedad.type === 'boolean' && esquemaParseado.required.includes(key)) {
                    validaciones[key] = Yup.boolean().required('Campo requerido');
                }
                else if (propiedad.type === 'array' && esquemaParseado.required.includes(key)) {
                    validaciones[key] = Yup.array().required('Campo requerido');
                }
                else if (propiedad.type === 'object' && esquemaParseado.required.includes(key)) {
                    validaciones[key] = Yup.object().required('Campo requerido');
                }
            }
            )
            
        }

    }
        , [esquema]);


        


    const formik = useFormik({
        initialValues: valoresIniciales,
        validationSchema: Yup.object().shape({
            ...esquemaParseado?.properties,
            ...esquemaParseado?.required,
        }),



        onSubmit: async (values, {

        }) => {
            
            if (modo === 'crear') {
                if (!tipoCreacion) {
                    throw new Error("tipoCreacion is undefined");
                }
                const crear = await crearElemento(values, tipoCreacion);
                
                if (crear) {
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Exito',
                        detail: 'Creado correctamente',
                        life: 3000
                    })

                    formik.resetForm();
                    router.back();
                }
                else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al crear',
                        life: 3000
                    });
                }
            }
            else if (modo === 'editar') {

                if (!tipoCreacion) {
                    throw new Error("tipoCreacion is undefined");
                }

                const editar = await actualizarElemento(values, tipoCreacion);
                
                if (editar) {
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Exito',
                        detail: 'Editado correctamente',
                        life: 3000
                    })

                    formik.resetForm();
                    router.back();
                }
                else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al editar',
                        life: 3000
                    });
                }


            }
            else if (modo === 'asignar') {
                if (!tipoCreacion) {
                    throw new Error("tipoCreacion is undefined");
                }

                //iterate through values and complete the preasignado object the keys that are not empty or length 0

                const preasignadoValuesObject = Object.keys(values).reduce((acc: any, key: string) => {
                    if (values[key] !== null && values[key] !== undefined && 
                        ((typeof values[key] === 'string' || Array.isArray(values[key])) ? values[key].length > 0 : true)) {
                        acc[key] = values[key];
                    } else {
                        acc[key] = preasignado[key];
                    }
                    return acc;
                }, {});

                

                const crear = await asignarElemento(preasignadoValuesObject, tipoCreacion);
                
                if (crear) {
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Exito',
                        detail: 'Creado correctamente',
                        life: 3000
                    })

                    formik.resetForm();
                    // router.back();
                }
                else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al crear',
                        life: 3000
                    });
                }

                

            }
            // formik.resetForm();
            // router.back();

        },
    });



    const buscarValores = async (event: any, key: string) => {
        

        const query = event.query;
        

        const response = await buscarElemento(query, key);

        setValoresBuscados((prevState: any) => ({
            ...prevState,
            [key]: response
        }));

        

    }

    const regexId = /[a-z]+Id$/gmi;
    const esId = (key: string) => {
        return regexId.test(key);
    }


    return (
        <div className="grid w-full">
            <Toast position="top-center" ref={toast} />

            <Card title={modo === 'crear' ? 'Crear ' + tipoCreacion : 'Editar ' + tipoCreacion
            } className="col-12">
                <div className="col-12">

                    <form onSubmit={(e) => {
                        e.preventDefault();

                        formik.handleSubmit(e)
                    }} className="flex flex-column gap-2"

                    >
                        {esquema && Object.keys(esquema.properties).map((key: string) => {
                            const propiedad = esquema.properties[key];
                            

                            return esquema.properties["extends"]?.properties?.ocultos?.default.find((item: any) => item === key) ?
                                null
                                : (
                                    <div key={key} className="flex flex-column gap-2">



                                        {propiedad.type === 'string' && esquema.properties[key].description !== 'Descripción' && esquema.properties[key].description !== 'Imagen' && esquema.properties[key].description !== 'Fecha'


                                            && (<>



                                                {
                                                    esquema.properties["extends"]?.properties?.ocultos?.default.find((item: any) => item === key) !== true ?
                                                        <label htmlFor={key}>{esquema.properties[key].description
                                                            || key}</label>
                                                        :
                                                        null
                                                }







                                                <InputText
                                                    type="text"
                                                    id={key}
                                                    name={key}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values[key]}
                                                    hidden={key === 'id' || esId(key)}
                                                />
                                            </>

                                            )}

                                            {
                                                propiedad.type === 'string' && esquema.properties[key].description === 'Fecha' && (
                                                    <>
                                                        <label htmlFor={key}>{esquema.properties[key].description
                                                            || key}</label>
                                                        <Calendar
                                                            id={key}
                                                            name={key}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values[key]}
                                                            dateFormat="dd/mm/yy"
                                                            showIcon
                                                        />
                                                    </>
                                                )
                                            }

                                        {
                                            propiedad.type === 'string' && esquema.properties[key].description === 'Descripción' && (
                                                <>
                                                    <label htmlFor={key}>{esquema.properties[key].description
                                                        || key}</label>
                                                    <InputTextarea

                                                        id={key}
                                                        name={key}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values[key]}
                                                        rows={5}
                                                        cols={30}
                                                        autoResize
                                                    />
                                                </>

                                            )
                                        }

                                        {propiedad.type === 'string' && esquema.properties[key].description === 'Imagen' && (
                                            <>

                                                <label htmlFor={key}>{esquema.properties[key].description
                                                    || key}</label>
                                                <div className="flex flex-column gap-2">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="p-inputtext-sm"
                                                        id={key}
                                                        name={key}
                                                        onChange={(event) => {
                                                            const file = event.currentTarget.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onloadend = () => {
                                                                    formik.setFieldValue(key, reader.result);
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />
                                                    {formik.values[key] && (
                                                        <img src={formik.values[key]} alt="preview" className="w-20rem h-20rem"
                                                            //fit 
                                                            style={{ objectFit: 'contain' }}
                                                        />
                                                    )}

                                                </div>
                                            </>



                                        )}


                                        {
                                            propiedad.type === 'number' && esquema.properties[key].description === 'Año' &&
                                            (<>
                                                <label htmlFor={key}>{esquema.properties[key].description
                                                    || key}</label>
                                                <Calendar
                                                    id={key}
                                                    name={key}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values[key]}
                                                    dateFormat="yy"
                                                    showIcon
                                                    view="year"
                                                    yearRange="1900:2100"
                                                    showButtonBar
                                                />
                                            </>

                                            )
                                        }

                                        {propiedad.type === 'number' && esquema.properties[key].description !== 'Año' && (
                                            <>
                                                <label htmlFor={key}>{esquema.properties[key].description
                                                    || key}</label>
                                                <InputNumber
                                                    id={key}
                                                    name={key}
                                                    onValueChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values[key]}
                                                    mode={
                                                        esquema.properties[key].description === 'Precio' ? 'currency' : 'decimal'
                                                    }
                                                    currency={
                                                        esquema.properties[key].description === 'Precio' ? 'COP' : undefined
                                                    }
                                                    locale="es-CO"
                                                    minFractionDigits={0}

                                                />
                                            </>

                                        )}




                                        {propiedad.type === 'boolean' && (
                                            <>
                                                <label htmlFor={key}>{esquema.properties[key].description
                                                    || key}</label>
                                                <Checkbox
                                                    type="checkbox"
                                                    id={key}
                                                    name={key}
                                                    onChange={formik.handleChange}
                                                    checked={formik.values[key]}
                                                />
                                            </>
                                        )}
                                        {propiedad.type === 'array' && modo !== 'asignar' && modo !== 'editar' && (
                                            <>
                                                <label htmlFor={key}>{esquema.properties[key].description
                                                    || key}</label>
                                                <InputText
                                                    type="text"
                                                    id={key}
                                                    name={key}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values[key]}
                                                />
                                                </>
                                        )}
                                        {propiedad.type === 'object' && esquema.properties[key].description !== "Extensiones" && 
                                        modo !== 'editar' &&
                                        
                                        (

                                            <>
                                                <label htmlFor={key}>{esquema.properties[key].description
                                                    || key}</label>
                                                <AutoComplete value={
                                                    formik.values[key]
                                                } suggestions={valoresBuscados[key]} completeMethod={(e: AutoCompleteCompleteEvent) => {
                                                    buscarValores(e, key);
                                                }
                                                } id={key} name={key} onChange={(e) => {
                                                    formik.setFieldValue(key, e.value);
                                                    formik.setFieldValue(key + 'Id', e.value.id);
                                                }
                                                }
                                                    onBlur={formik.handleBlur}
                                                    itemTemplate={(item: any) => {
                                                        return (
                                                            <div className="flex flex-column gap-2">
                                                                <span>{item?.nombre}</span>
                                                                <span>{item?.modelo}</span>
                                                            </div>
                                                        );
                                                    }
                                                    }
                                                    placeholder="Buscar mínimo 3 caracteres"
                                                    dropdown
                                                    field= {
                                                        key === 'motocicleta' ? 'modelo' : 'nombre'
                                                    }

                                                />
                                            </>
                                        )}
                                        {formik.errors[key] && formik.touched[key] && (
                                            <div className="text-red-500">
                                                {/* @ts-ignore */}
                                                {typeof formik.errors[key] === 'string' ? formik.errors[key] : null}
                                            </div>
                                        )}
                                    </div>
                                );
                        })}
                        <div className="flex gap-2">
                            <Button type="submit" label={modo === 'crear' ? 'Crear' : modo === 'editar' ? 'Editar' : 'Asignar'} className="p-button-primary" />
                            {modo === 'editar' && (
                                <Button type="button" label="Eliminar" className="p-button-danger" />
                            )}

                            <Button type="button" label="Limpiar" className="p-button-secondary"
                                onClick={() => {
                                    formik.resetForm();
                                }
                                }

                            />

                            <Button type="button" label="Volver" className="p-button-secondary"
                                onClick={() => {
                                    //get last path / 
                                    const path = window.location.pathname.split('/').slice(0, -1).join('/');
                                    router.push(path);
                                }
                                }
                            />

                            <Button type="button" label="Ver formik" className="p-button-secondary"
                                onClick={() => {
                                    
                                }
                                }
                            />
                        </div>
                    </form>

                </div>
            </Card>
        </div>
    );

}

export default FormComponent;
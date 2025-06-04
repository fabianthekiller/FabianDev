
"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";


export default function Template({ children }: { children: React.ReactNode }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.div>
    );
}
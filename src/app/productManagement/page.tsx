import React from 'react';
import ProductManagementPage from "@/components/products/ProductManagementPage";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";
import { authOptions } from "@/app/service/authOptions";

const Page = async () => {
    //console.log(authOptions);
    const session = await getServerSession(authOptions as any);
    if (!session) {
        redirect("/login"); // Если не залогинен — перекидываем на логин
    }
    return (
        <div>
            <ProductManagementPage/>
        </div>
    );
};

export default Page;
import React, {Suspense} from 'react';
import CardListPages from "@/components/cards/CardListPages";

const Page = () => {
    return (
        <Suspense fallback={<div>Загрузка карточек...</div>}>
            <CardListPages tempIsAdmin={false} />
         </Suspense>
    );
};

export default Page;
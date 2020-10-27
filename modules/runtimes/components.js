import { useEffect, useState } from "react";
import React, {useState} from 'react';

function Loading() {
    return <div>
        loading...
    </div>
}
Loading.isLoadingComponent = true;

function Dynamic(asyncImportFn) {
    let initComponent = Loading;
    return function(props) {
        const [Component, setComponent] = useState(() => initComponent);
        useEffect(() => {
            if (Component.isLoadingComponent) {
                asyncImportFn().then(mod => {
                    setComponent(() => (mod.default));
                    initComponent = mod.default;
                })
            }
        }, []);
        return <Component {...props} />
    }
}

export const setter = {
    setLoading(LoadingComp) {
        Loading = LoadingComp;
        LoadingComp.isLoadingComponent = true;
    },
    setDynamic(DynamicComp) {
        Dynamic = DynamicComp;
    }
}

export default () => ({
    Loading,
    Dynamic,
})
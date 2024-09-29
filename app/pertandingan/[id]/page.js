import ViewPertandingan from '@/app/frontend/components/viewPertandingan';
import React from 'react';


const ViewPertandinganId = (props) => {
    return <ViewPertandingan id={props?.params?.id} />
}

export default ViewPertandinganId;
import moment from "moment";
import { getAvailableBookings } from "../api/booking/availability/route";
import UrusTempahanComponent from "../frontend/components/urus-tempahan"
import { cache } from "react";
import CustomTab from "../frontend/components/customTab";
import JenisPertandingan from "../frontend/components/jenisPertandingan";

export const revalidate = 0; // Revalidate on every request

const UrusTempahan = async props => {
    return <CustomTab
        tabs={[
            {
                label: 'Kemaskini Tarikh Tempahan',
                value: 1,
                component: <UrusTempahanComponent />
            },
            {
                label: 'Kemaskini Jenis Pertandingan',
                value: 2,
                component: <JenisPertandingan />
            }
        ]}
    />
}

export default UrusTempahan;
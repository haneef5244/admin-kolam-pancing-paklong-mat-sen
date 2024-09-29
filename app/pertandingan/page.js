import { getAllActivePancangs } from "../backend/actions/pancang";
import { getAllPertandingan, getPertandinganLog } from "../backend/actions/pertandingan";
import StartPertandingan from "../frontend/components/startPertandingan";
import StartedPertandingan from "../frontend/components/startedPertandingan";
export const revalidate = 1;

const Pertandingan = async props => {
    const pertandingans = await getAllPertandingan()
    const started = pertandingans?.filter(p => p.is_started && !p.is_ended)

    if (started?.length) {
        const pancangs = await getAllActivePancangs()
        const data = await getPertandinganLog(Number(started?.[0]?.pertandingan_id))
        return <StartedPertandingan pancangs={pancangs} pertandinganId={started?.[0]?.pertandingan_id} jenisPertandingan={started?.[0]?.jenis} data={data} tarikhPertandingan={started?.[0]?.tarikh} />
    }

    return <StartPertandingan data={pertandingans} />
}

export default Pertandingan;
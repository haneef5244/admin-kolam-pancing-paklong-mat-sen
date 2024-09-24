import { getAllPertandingan } from "../backend/actions/pertandingan";
import StartedPertandingan from "../frontend/components/startedPertandingan";


const Pertandingan = async props => {
    const pertandingans = await getAllPertandingan()

    const started = pertandingans?.filter(p => p.is_started)

    if (started?.length) {
        return <StartedPertandingan />
    }
    return <></>
}

export default Pertandingan;
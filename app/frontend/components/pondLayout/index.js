import { Container, SvgIcon, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const PondLayout = ({ handleOnClick }) => {

    const [selectedKolam, setSelectedKolam] = useState(1);

    useEffect(() => {
        handleOnClick(1)
    }, [])

    const onClick = (id) => {
        setSelectedKolam(id);
        handleOnClick(id);
    }

    const scaleSvgString = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                width="50" height="50" viewBox="0 0 33 32" enable-background="new 0 0 33 32" xml:space="preserve">
                <g>
                    <path fill="#808184" d="M12.5,31c-0.276,0-0.5,0.224-0.5,0.5s0.224,0.5,0.5,0.5h7c0.276,0,0.5-0.224,0.5-0.5S19.776,31,19.5,31
                H12.5z"/>
                    <path fill="#808184" d="M4.648,6.995L0.772,19.35c-0.008,0.026-0.004,0.052-0.008,0.079C0.761,19.453,0.75,19.475,0.75,19.5
                c0,0.012,0.003,0.023,0.003,0.035c0.001,0.009,0.001,0.017,0.003,0.026C0.788,22.054,2.747,24,5.25,24
                c2.503,0,4.462-1.946,4.494-4.439c0.001-0.009,0.002-0.017,0.003-0.026c0-0.012,0.003-0.023,0.003-0.034
                c0-0.025-0.011-0.047-0.014-0.071c-0.004-0.026,0-0.053-0.008-0.079L5.808,6.856L15.5,5.492V29h-2c-0.276,0-0.5,0.224-0.5,0.5
                s0.224,0.5,0.5,0.5h5c0.276,0,0.5-0.224,0.5-0.5S18.776,29,18.5,29h-2V5.544l11.187,1.329L23.772,19.35
                c-0.008,0.026-0.004,0.052-0.008,0.079c-0.004,0.024-0.014,0.046-0.014,0.071c0,0.012,0.003,0.023,0.003,0.035
                c0.001,0.009,0.001,0.017,0.003,0.026C23.788,22.054,25.747,24,28.25,24c2.503,0,4.462-1.946,4.494-4.439
                c0.001-0.009,0.002-0.017,0.003-0.026c0-0.012,0.003-0.023,0.003-0.034c0-0.025-0.011-0.047-0.014-0.071
                c-0.004-0.026,0-0.053-0.008-0.079L28.853,7H31.5C31.776,7,32,6.776,32,6.5S31.776,6,31.5,6l-2.69,0.003L16.5,4.537V1
                c0-0.276-0.224-0.5-0.5-0.5S15.5,0.724,15.5,1v3.482L4.75,6H0.5C0.224,6,0,6.224,0,6.5S0.224,7,0.5,7L4.648,6.995z M28.25,8.42
                L31.569,19h-6.637L28.25,8.42z M28.25,23c-1.793,0-3.23-1.282-3.466-3h6.932C31.48,21.718,30.043,23,28.25,23z M5.25,23
                c-1.793,0-3.23-1.282-3.466-3h6.932C8.48,21.718,7.043,23,5.25,23z M1.931,19L5.25,8.42L8.569,19H1.931z"/>
                </g>
            </svg>`
    const scaleMusollaString = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
    <svg fill="#000000" width="50" height="50" viewBox="0 0 50 50" version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" overflow="inherit"><path d="M48.022 26.652c-1.396 6.519-6.192 11.874-12.516 13.976-1.94.646-3.95.973-5.975.973-8.149 0-15.354-5.19-17.93-12.914-1.595-4.781-1.229-9.896 1.03-14.404 2.259-4.507 6.141-7.867 10.93-9.46 4.505-1.496 9.397-1.246 13.71.689l.935-1.763c-6.263-3.869-14.064-4.795-21.078-2.462-6.343 2.109-11.484 6.559-14.476 12.528-2.992 5.97-3.476 12.746-1.364 19.08 3.412 10.231 12.955 17.105 23.747 17.105 2.682 0 5.343-.433 7.911-1.286 9.573-3.184 16.266-11.73 17.052-21.774l-1.976-.288zm-12.325-12.049l-5.014-9.384-2.55 10.477-10.429 2.05 9.547 5.421-1.642 10.796 8.107-7.374 10.046 4.82-5.131-10.027 8.124-7.842z"/></svg>`

    const arrowBottomSvg = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6.5L12 17.5M12 17.5L16 12.9118M12 17.5L8 12.9118" stroke="#363853" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`

    return (
        <Container maxWidth="sm" sx={{ pb: 0 }}>
            <Typography fontWeight={'bold'} sx={{ pb: 2 }}>Pilih Kolam</Typography>
            <svg viewBox="0 0 1000 1800" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">
                {/* <!-- Main Gate --> */}
                <text x="130" y="30" font-family="Arial" font-size="20" fill="#000" text-anchor="middle">Main GATE</text>

                {/* <!-- Office & Registration --> */}
                <rect x="400" y="0" width="300" height="100" fill="#AAB7B8" stroke="#2980B9" stroke-width="2" />
                <text x="550" y="50" font-family="Arial" font-size="16" fill="#000" text-anchor="middle">OFFICE & REGISTRATION</text>

                {/* <!-- Toilet (top) --> */}
                <rect x="835" y="100" width="55" height="90" fill="#AAB7B8" stroke="#2980B9" stroke-width="2" />
                <text x="805" y="140" font-family="Arial" transform='rotate(90 805,140)' font-size="16" fill="#000" text-anchor="middle">TOILET</text>

                {/* <!-- Toilet (top right) --> */}
                <rect x="920" y="400" width="55" height="50" fill="#AAB7B8" stroke="#2980B9" stroke-width="2" />
                <text x="950" y="480" font-family="Arial" font-size="16" fill="#000" text-anchor="middle">TOILET</text>


                {/* <!-- Pond 1 --> */}
                <rect onClick={() => onClick(1)} id="pond1" x="350" y="300" width="300" height="450" fill={selectedKolam == 1 ? "#F39C12" : "#85C1E9"} stroke={selectedKolam == 1 ? "#D35400" : "#2980B9"} stroke-width="3" />
                <text onClick={() => onClick(1)} x="500" y="525" font-family="Arial" font-size="30" fill="#000" text-anchor="middle">1</text>

                {/* A */}
                <text x="630" y="280" font-family="Arial" font-size="30" fill="#000" font-weight="bold" text-anchor="middle">A</text>
                {/* B */}
                <text x="370" y="280" font-family="Arial" font-size="30" fill="#000" font-weight="bold" text-anchor="middle">B</text>
                {/* A0001*/}
                <text x="670" y="410" font-family="Arial" font-size="30" fill="#000" transform='rotate(90, 670, 410)' text-anchor="middle">A0001</text>
                <foreignObject x="655" y="480" width="50" height={"50"}>
                    <div dangerouslySetInnerHTML={{ __html: arrowBottomSvg }} />
                </foreignObject>
                <text x="670" y="600" font-family="Arial" font-size="30" fill="#000" transform='rotate(90, 670, 600)' text-anchor="middle">A0138</text>

                {/* B0146 */}
                <text x="310" y="410" font-family="Arial" font-size="30" fill="#000" transform='rotate(90, 310, 410)' text-anchor="middle">B0139</text>
                <foreignObject x="295" y="480" width="50" height={"50"}>
                    <div dangerouslySetInnerHTML={{ __html: arrowBottomSvg }} />
                </foreignObject>
                <text x="310" y="600" font-family="Arial" font-size="30" fill="#000" transform='rotate(90, 310, 600)' text-anchor="middle">B0279</text>

                {/* Scale */}
                <text x="493" y="230" font-family="Arial" font-size="30" fill="#000" text-anchor="middle">1</text>
                <foreignObject x="470" y="230" width="200" height={"100"}>
                    <div dangerouslySetInnerHTML={{ __html: scaleSvgString }} />
                </foreignObject>


                {/* <!-- Pond 2 --> */}
                <rect onClick={() => onClick(2)} id="pond2" x="150" y="900" width="280" height="650" fill={selectedKolam == 2 ? "#F39C12" : "#85C1E9"} stroke={selectedKolam == 2 ? "#D35400" : "#2980B9"} stroke-width="3" />
                <text onClick={() => onClick(2)} x="290" y="1225" font-family="Arial" font-size="30" fill="#000" text-anchor="middle">2</text>

                {/* C */}
                <text x="170" y="880" font-family="Arial" font-size="30" fill="#000" font-weight="bold" text-anchor="middle">C</text>
                {/* D */}
                <text x="410" y="880" font-family="Arial" font-size="30" fill="#000" font-weight="bold" text-anchor="middle">D</text>
                {/* Scale */}
                <text x="363" y="800" font-family="Arial" font-size="30" fill="#000" text-anchor="middle">3</text>
                <foreignObject x="340" y="800" width="200" height={"100"}>
                    <div dangerouslySetInnerHTML={{ __html: scaleSvgString }} />
                </foreignObject>
                {/* C0284*/}
                {/* Scale */}
                <foreignObject x="60" y="900" transform='rotate(90, 60, 900)' width="200" height={"100"}>
                    <div dangerouslySetInnerHTML={{ __html: scaleSvgString }} />
                </foreignObject>
                <text x="20" y="1050" transform='rotate(90, 20, 1050)' font-family="Arial" font-size="30" fill="#000" text-anchor="middle">Penimbang</text>

                <text x="110" y="1100" font-family="Arial" font-size="30" fill="#000" transform='rotate(90, 110, 1100)' text-anchor="middle">C0280</text>
                <foreignObject x="95" y="1210" width="50" height={"50"}>
                    <div dangerouslySetInnerHTML={{ __html: arrowBottomSvg }} />
                </foreignObject>
                {/* Scale */}
                <text x="68" y="1200" font-family="Arial" font-size="30" fill="#000" text-anchor="middle">6</text>
                <foreignObject x="45" y="1200" width="200" height={"100"}>
                    <div dangerouslySetInnerHTML={{ __html: scaleSvgString }} />
                </foreignObject>
                <text x="110" y="1380" font-family="Arial" font-size="30" fill="#000" transform='rotate(90, 110, 1380)' text-anchor="middle">C0591</text>

                {/* D0596*/}
                <text x="450" y="1100" font-family="Arial" font-size="30" fill="#000" transform='rotate(90, 450, 1100)' text-anchor="middle">D0592</text>
                <foreignObject x="435" y="1210" width="50" height={"50"}>
                    <div dangerouslySetInnerHTML={{ __html: arrowBottomSvg }} />
                </foreignObject>
                {/* Scale */}
                <text x="508" y="1200" font-family="Arial" font-size="30" fill="#000" text-anchor="middle">5</text>
                <foreignObject x="485" y="1200" width="200" height={"100"}>
                    <div dangerouslySetInnerHTML={{ __html: scaleSvgString }} />
                </foreignObject>
                <text x="450" y="1380" font-family="Arial" font-size="30" fill="#000" transform='rotate(90, 450, 1380)' text-anchor="middle">D0991</text>
                {/* Scale */}
                <text x="293" y="1640" font-family="Arial" font-size="30" fill="#000" text-anchor="middle">8</text>
                <foreignObject x="270" y="1560" width="200" height={"100"}>
                    <div dangerouslySetInnerHTML={{ __html: scaleSvgString }} />
                </foreignObject>

                {/* <!-- Pond 3 --> */}
                <rect onClick={() => onClick(3)} id="pond3" x="590" y="900" width="280" height="650" fill={selectedKolam == 3 ? "#F39C12" : "#85C1E9"} stroke={selectedKolam == 3 ? "#D35400" : "#2980B9"} stroke-width="3" />
                <text onClick={() => onClick(3)} x="730" y="1225" font-family="Arial" font-size="30" fill="#000" text-anchor="middle">3</text>

                {/* E */}
                <text x="610" y="880" font-family="Arial" font-size="30" fill="#000" font-weight="bold" text-anchor="middle">E</text>
                {/* Scale */}
                <text x="643" y="800" font-family="Arial" font-size="30" fill="#000" text-anchor="middle">2</text>
                <foreignObject x="620" y="800" width="200" height={"100"}>
                    <div dangerouslySetInnerHTML={{ __html: scaleSvgString }} />
                </foreignObject>
                {/* F */}
                <text x="850" y="880" font-family="Arial" font-size="30" fill="#000" font-weight="bold" text-anchor="middle">F</text>
                {/* E0916*/}
                <text x="550" y="1100" font-family="Arial" font-size="30" fill="#000" transform='rotate(90, 550, 1100)' text-anchor="middle">E0992</text>
                <foreignObject x="535" y="1210" width="50" height={"50"}>
                    <div dangerouslySetInnerHTML={{ __html: arrowBottomSvg }} />
                </foreignObject>

                <text x="550" y="1380" font-family="Arial" font-size="30" fill="#000" transform='rotate(90, 550, 1380)' text-anchor="middle">E1231</text>

                {/* F1231*/}
                <text x="890" y="1100" font-family="Arial" font-size="30" fill="#000" transform='rotate(90, 890, 1100)' text-anchor="middle">F1232</text>
                <foreignObject x="875" y="1210" width="50" height={"50"}>
                    <div dangerouslySetInnerHTML={{ __html: arrowBottomSvg }} />
                </foreignObject>
                {/* Scale */}
                <text x="948" y="1200" font-family="Arial" font-size="30" fill="#000" text-anchor="middle">4</text>
                <foreignObject x="925" y="1200" width="200" height={"100"}>
                    <div dangerouslySetInnerHTML={{ __html: scaleSvgString }} />
                </foreignObject>
                <text x="890" y="1380" font-family="Arial" font-size="30" fill="#000" transform='rotate(90, 890, 1380)' text-anchor="middle">F1522</text>
                {/* Scale */}
                <text x="733" y="1640" font-family="Arial" font-size="30" fill="#000" text-anchor="middle">7</text>
                <foreignObject x="710" y="1560" width="200" height={"100"}>
                    <div dangerouslySetInnerHTML={{ __html: scaleSvgString }} />
                </foreignObject>

                {/* <!-- Toilet (bottom) --> */}
                <rect x="0" y="1750" width="75" height="50" fill="#AAB7B8" stroke="#2980B9" stroke-width="2" />
                <text x="40" y="1740" font-family="Arial" font-size="16" fill="#000" text-anchor="middle">TOILET</text>

                {/* <!-- Surau --> */}
                <rect x="750" y="1700" width="200" height="100" fill="#AAB7B8" stroke="#2980B9" stroke-width="2" />
                <foreignObject x="770" y="1725" width="100" height={"100"}>
                    <div dangerouslySetInnerHTML={{ __html: scaleMusollaString }} />
                </foreignObject>
                <text x="870" y="1755" font-family="Arial" font-size="16" fill="#000" text-anchor="middle">Surau</text>

                {/* <!-- Fence/Perimeter --> */}

                {/* top */}
                <rect x="250" y="0" width="640" height="1" fill="none" stroke="#000" stroke-width="1" />
                <rect x="250" y="0" width="1" height="50" fill="none" stroke="#000" stroke-width="1" />

                {/* the outline at top right */}
                <rect x="890" y="0" width="1" height="400" fill="none" stroke="#000" stroke-width="1" />
                <rect x="890" y="400" width="110" height="1" fill="none" stroke="#000" stroke-width="1" />
                {/* right */}
                <rect x="997" y="400" width="1" height="1400" fill="none" stroke="#000" stroke-width="1" />

                <rect x="0" y="0" width="1" height="1800" fill="none" stroke="#000" stroke-width="1" />
                <rect x="0" y="1798" width="1000" height="1" fill="none" stroke="#000" stroke-width="1" />

            </svg>
        </Container>

    );
};

export default PondLayout;
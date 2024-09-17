import { Container, LinearProgress } from "@mui/material";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <Container>
            <LinearProgress />
        </Container>
    );
}
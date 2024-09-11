import { Spinner } from "react-bootstrap";

import "./LoadingScreen.css";

const LoadingScreen = () => {
    return ( 
        <div className="loading">
            <Spinner as="span" animation="border" size="lg" />
        </div>
     );
}
 
export default LoadingScreen;
import "./ErrorPage.css";

const ErrorPage = ({ message }) => {
  return (
        <div className="error_page">
            <h1>:(</h1>
            <h2>404 - {message}</h2>
        </div>

    )
};

export default ErrorPage;

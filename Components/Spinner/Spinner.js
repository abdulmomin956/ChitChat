import "./Spinner.module.scss";

const Spinner = (props) => {
    return (
        <div className="loading">{props.status}</div>
    );
};

export default Spinner;
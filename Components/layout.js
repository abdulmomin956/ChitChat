import Navbar from "./navbar";

export default function Layout({ children }) {
    return (
        <div className="container">
            <div className="row">
                <Navbar />
                <>{children}</>
            </div>
        </div>
    )
}
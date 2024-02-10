import { useRouter } from "next/router"

export default function Navbar() {
    const router = useRouter()
    return (
        <nav className="menu">
            <ul className="items">
                <li className="item" onClick={() => router.push('/')}>
                    <i className="fa fa-home" aria-hidden="true"></i>
                </li>
                <li onClick={() => router.push('/friends')} className="item">
                    <i className="fa fa-user" aria-hidden="true"></i>
                </li>
                <li className="item">
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                </li>
                <li className="item item-active">
                    <i className="fa fa-commenting" aria-hidden="true" onClick={() => router.push('/message')}></i>
                </li>
                <li className="item">
                    <i className="fa fa-file" aria-hidden="true"></i>
                </li>
                <li className="item">
                    <i className="fa fa-cog" aria-hidden="true"></i>
                </li>
            </ul>
        </nav>
    )
}
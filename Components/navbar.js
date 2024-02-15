import { usePathname } from "next/navigation"
import { useRouter } from "next/router"

export default function Navbar() {
    const router = useRouter()
    const path = usePathname()
    return (
        <nav className="menu">
            <ul className="items">
                <li className={`item ${path === '/' ? 'item-active' : ''}`} onClick={() => router.push('/')}>
                    <i className="fa fa-home" aria-hidden="true"></i>
                </li>
                <li className={`item ${path === '/friends' ? 'item-active' : ''}`} onClick={() => router.push('/friends')} >
                    <i className="fa fa-user" aria-hidden="true"></i>
                </li>
                <li className="item">
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                </li>
                <li className={`item ${path === '/message' ? 'item-active' : ''}`} onClick={() => router.push('/message')}>
                    <i className="fa fa-commenting" aria-hidden="true" ></i>
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
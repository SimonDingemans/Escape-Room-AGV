import {Link, Outlet} from "react-router";

export const App = () => {
    return <>
        <nav style={{display: 'flex', justifyContent: 'space-around'}}>
            <Link to={'/editor'}>Editor</Link>
            <Link to={'/player'}>Player</Link>
        </nav>
        <main>
            <Outlet/>
        </main>
    </>
}
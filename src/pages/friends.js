import { returnUsername, verifyJWT } from "@/utils/verifyJWT";
import dbConnect, { UserModel } from "../../db";

export default function friendsPage() {
    return (
        <section className="w-75">
            <h1 className="text-center">Friends</h1>

        </section>
    )
}

export async function getServerSideProps({ req, res, params, query }) {
    await dbConnect();
    const { token } = await req.cookies;
    const verified = verifyJWT(token);

    if (!verified) {
        return {
            props: {
                isAuth: false
            }
        };
    }

    const username = returnUsername(token)
    const user = await UserModel.findOne({ username }).select({ name: 1, username: 1 })
    const data = await JSON.parse(JSON.stringify(user));
    return {
        props: {
            isAuth: true, auth: data
        },
    }
}
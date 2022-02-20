import EventItem from "@/components/EventItem";
import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import Link from "next/link";
import qs from 'qs'
import { PER_PAGE } from "@/config/index";


export default function EventsPage({ events, page, total }) {
    const e = events.data


    const last_page = Math.ceil(total / PER_PAGE)


    return (

        < Layout >

            <h1>Events</h1>
            <ul>
                {
                    e.map((evt) => {
                        return <EventItem key={evt.id} evt={evt.attributes} />
                    })
                }

            </ul>
            {page > 1 && (<Link href={`/events?page=${page - 1}`}>
                <a className="btn-secondary">Prev</a>
            </Link>)}

            {page < last_page && (<Link href={`/events?page=${page + 1}`}>
                <a className="btn-secondary">Next</a>
            </Link>)}

        </Layout >
    )
}




export async function getServerSideProps(context) {
    console.log(context.query.page)

    const page = context.query.page || 1

    const query = qs.stringify({
        pagination: {
            start: +page,
            limit: PER_PAGE,
        },
    }, {
        encodeValuesOnly: true,
    });

    const response = await fetch(`${API_URL}/api/events?${query}&populate=*`)
    const events = await response.json()
    const total = events.meta.pagination.total
    return (
        {
            props: {
                events,
                page: +page,
                total: +total
            },

        }

    )
}